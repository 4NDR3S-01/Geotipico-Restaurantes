const mailer = require('../utils/mailer');

exports.sendContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  try {
    await mailer.sendContactMail({ name, email, subject, message });
    res.json({ success: true, message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    console.error('Error enviando correo de contacto:', err);
    res.status(500).json({ error: 'No se pudo enviar el mensaje. Intenta más tarde.' });
  }
}; 