const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Nombre, apellidos, email y contraseña son obligatorios.' });
  }
  // Validación de email válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'El email no es válido.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: 'El usuario ya existe.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    res.json({ success: true, message: 'Usuario registrado correctamente.' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '2h' }
    );
    res.json({
      success: true,
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Recuperación de contraseña: solicitar
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email es obligatorio.' });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Por seguridad, responder igual aunque no exista
      return res.json({ success: true, message: 'Si el correo existe, recibirás instrucciones.' });
    }
    // Generar token seguro
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpire = Date.now() + 1000 * 60 * 30; // 30 minutos
    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpire;
    await user.save();
    // Enviar email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: `Geotípico <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Recupera tu contraseña - Geotípico',
      html: `<h2>Recupera tu contraseña</h2><p>Haz clic en el siguiente enlace para restablecer tu contraseña. El enlace es válido por 30 minutos.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
    });
    res.json({ success: true, message: 'Si el correo existe, recibirás instrucciones.' });
  } catch (err) {
    console.error('Error en forgotPassword:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Recuperación de contraseña: restablecer
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios.' });
  if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ error: 'El enlace no es válido o expiró.' });
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Contraseña restablecida correctamente.' });
  } catch (err) {
    console.error('Error en resetPassword:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}; 