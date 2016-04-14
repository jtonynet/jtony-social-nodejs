// Copy in your particulars and rename this to mail.js
module.exports = {
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PWD
  }
}
