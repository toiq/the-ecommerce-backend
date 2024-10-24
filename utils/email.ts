import nodemailer from "nodemailer";
import { env } from "../config/env.js";

enum Driver {
  EMAIL,
  CONSOLE,
}

export const sendVerificationEmail = async (
  email: string,
  link: string,
  driver: Driver = Driver.CONSOLE
): Promise<void> => {
  try {
    // Create a transporter object with your SMTP settings
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER, // SMTP username
        pass: env.SMTP_PASS, // SMTP password
      },
    });

    console.log("Sending...");
    const emailData = {
      from: env.SMTP_USER, // Sender address
      to: email, // Recipient's email address
      subject: "Your Verification Link", // Subject line
      text: `Click the following link to verify your account`, // Plain text body
      html: `<p>Click the following link to verify your account:</p><a href="${link}" target="_blank">Click here</a>`, // HTML body
    };

    if (driver && driver === Driver.CONSOLE) {
      console.log({ emailData });
    } else {
      const info = await transporter.sendMail(emailData);
      console.log("Email sent: %s", info.messageId);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
