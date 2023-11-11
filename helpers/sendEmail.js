const nodemailer = require("nodemailer");

// const META_PASSWORD = `${process.env.META_PASSWORD}`;
// const { META_PASSWORD } = process.env;

const nodemailConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "inna_des@meta.ua",
    pass:  "Test123456",
  },
};

const transport = nodemailer.createTransport(nodemailConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "inna_des@meta.ua" };
  await transport.sendMail(email);

  return true;
};

module.exports = sendEmail;
