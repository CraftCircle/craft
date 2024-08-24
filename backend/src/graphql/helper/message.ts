import nodemailer from "nodemailer";
import twilio from "twilio";

export async function sendEmail(
  recipients: string[],
  subject: string,
  content: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Send the email
  const info = await transporter.sendMail({
    from: `"Your App Name" <${process.env.SMTP_USER}>`, 
    to: recipients.join(","),
    subject: subject, 
    text: content, 
  });

  console.log("Message sent: %s", info.messageId);
}


//sms
export async function sendSMS(
  recipients: string[],
  content: string
): Promise<void> {

    const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  
  for (const recipient of recipients) {
    const message = await client.messages.create({
      body: content,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: recipient,
    });

    console.log("Message sent: %s", message.sid);
  }
}