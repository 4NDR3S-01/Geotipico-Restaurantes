require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));


// Endpoint para enviar mensajes de contacto
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  try {
    // Configuración del transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    // Opciones del correo
    const mailOptions = {
      from: `Geotípico Contacto <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      subject: `[Geotípico] Nuevo mensaje de contacto: ${subject}`,
      replyTo: email,
      text: `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subject}\nMensaje:\n${message}`,
      html: `<h2>Nuevo mensaje de contacto</h2><p><b>Nombre:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Asunto:</b> ${subject}</p><p><b>Mensaje:</b><br>${message.replace(/\n/g, '<br>')}</p>`
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    console.error('Error enviando correo de contacto:', err);
    res.status(500).json({ error: 'No se pudo enviar el mensaje. Intenta más tarde.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
