// lib/email.js

import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export async function sendVerificationEmail(email, token) {
  const transporter = createTransporter();

  // Usa la URL del FRONTEND (debe estar en env vars del proyecto backend)
  // Recomendado: define FRONTEND_URL en Vercel del backend
  const frontendUrl = process.env.FRONTEND_URL || 'https://front-prueba-dna.vercel.app';

  // Enlace directo a la página /verify del frontend con el token
  const verificationLink = `${frontendUrl}/verify?token=${token}`;

  const mailOptions = {
    from: `"DNA Music" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Confirma tu correo electrónico en DNA Music',
    html: `
      <h2>¡Bienvenido a DNA Music!</h2>
      <p>Para activar tu cuenta y confirmar tu correo, haz clic en el botón de abajo:</p>
      <a href="${verificationLink}" style="background:#4f46e5;color:white;padding:12px 28px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;margin:20px 0;">
        Confirmar Correo Electrónico
      </a>
      <p>Este enlace expira en 1 hora. Si no solicitaste esto, ignora el mensaje.</p>
      <p>¡Nos vemos dentro! 🎵</p>
      <small>DNA Music - Gestión de estudiantes y más</small>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de verificación enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error enviando email de verificación:', error);
    throw error;
  }
}