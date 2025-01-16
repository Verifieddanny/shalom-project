const twilio = require("twilio");
const nodemailer = require("nodemailer");

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendNotification = async (title, body, phoneNumber, email) => {
  try {
    await twilioClient.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    await emailTransporter.sendMail({
      from: process.env.SMTP_FROM_ADDRESS,
      to: email,
      subject: title,
      text: body,
      html: `<h1>${title}</h1><p>${body}</p>`,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

module.exports = { sendNotification };
