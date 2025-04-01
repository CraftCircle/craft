import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"CraftCircle Mailer" <${process.env.SENDER_EMAIL}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: '✅ SMTP Test Email from CraftCircle',
      text: 'Hello! This is a test email sent using PrivateEmail SMTP.',
      html: `<p>Hello! 👋<br>This is a <b>test email</b> sent from <code>mail.privateemail.com</code> using Nodemailer.</p>`,
    });

    console.log('📨 Email sent successfully!', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
}

testSMTP();
