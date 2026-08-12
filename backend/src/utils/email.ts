import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
  try {
    const mailOptions = {
      from: `M2N Hotels <${process.env.EMAIL_USERNAME}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send email');
  }
};

export const generateOTPEmailHtml = (title: string, description: string, otp: string, expiryMinutes: number): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f5f7; padding: 40px 20px; margin: 0; }
    .container { background-color: #ffffff; border-radius: 8px; overflow: hidden; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
    .header { background-color: #000000; color: #ffffff; padding: 24px; text-align: center; font-size: 22px; font-weight: bold; letter-spacing: 0.5px; }
    .content { padding: 32px; color: #374151; font-size: 15px; line-height: 1.6; }
    .otp-box { background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center; margin: 28px 0; padding: 20px; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #000000; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    p { margin-top: 0; margin-bottom: 16px; }
    p:last-child { margin-bottom: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${title}
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>${description}</p>
      <div class="otp-box">
        ${otp}
      </div>
      <p>This OTP is valid for <strong>${expiryMinutes} minutes</strong>. Please do not share this code with anyone.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <p>Thank you for using our service!</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} M2N Hotels. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
