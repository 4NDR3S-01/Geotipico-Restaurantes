const nodemailer = require('nodemailer');

exports.sendContactMail = async ({ name, email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const mailOptions = {
    from: `Geotípico Contacto <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_RECEIVER,
    subject: `[Geotípico] Nuevo mensaje de contacto: ${subject}`,
    replyTo: email,
    text: `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subject}\nMensaje:\n${message}`,
    html: `<h2>Nuevo mensaje de contacto</h2><p><b>Nombre:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Asunto:</b> ${subject}</p><p><b>Mensaje:</b><br>${message.replace(/\n/g, '<br>')}</p>`
  };
  await transporter.sendMail(mailOptions);
}; 