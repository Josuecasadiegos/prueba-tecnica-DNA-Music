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

  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Tu App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Confirma tu correo electrónico',
    html: `
      <h2>Bienvenido</h2>
      <p>Confirma tu correo haciendo clic aquí:</p>
      <a href="${verificationLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
        Confirmar correo
      </a>
      <p>Este enlace expira en 1 hora.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    throw error;
  }
}