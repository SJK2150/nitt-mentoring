import nodemailer from "nodemailer";
import config from "~/config";

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: parseInt(config.SMTP_PORT),
  secure: parseInt(config.SMTP_PORT) === 465, // true for 465, false for other ports like 587
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates in development
  }
});
const subject = "Reset Your Password on NITT Mentoring Portal";
const createHtmlContent = (resetLink: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NITT Mentoring Portal - Forgot Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: bold;
      color: #962b07; /* Using nitMaroon 500 */
    }
    .content {
      padding: 20px;
    }
    .button {
      background-color: #962b07; /* Using nitMaroon 500 */
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }
    .button:hover {
      background-color: #782206; /* Using nitMaroon 600 */
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>NITT Mentoring Portal - Forgot Password</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. Please click the link below to proceed:</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p><strong>Important:</strong> This link will expire in 10 minutes. If you do not reset your password within this timeframe, you will need to request a new link.</p>
      <p>If you did not request this, please disregard this message.</p>
      <p>Thank you for using NITT Mentoring Portal.</p>
    </div>
  </div>
</body>
</html>

`;

export async function sendEmail(to: string, resetLink: string) {
  try {
    const body = createHtmlContent(resetLink);
    await transporter.sendMail({
      from: config.EMAIL_FROM,
      to,
      subject: subject,
      html: body,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
