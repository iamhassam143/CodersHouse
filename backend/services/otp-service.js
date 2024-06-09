const crypto = require('crypto');
const hashService = require('./hash-service');
const nodemailer = require("nodemailer");
const fs = require("fs");

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const client = require('twilio')(smsSid, smsAuthToken, {
    lazyLoading: true,
});
const verifySid = process.env.SMS_VERIFY_SID;

class OtpService {
    async generateOtp() {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }

    async sendBySms(phone, otp, ttl) {
        const expire_mins = ttl / (60 * 1000);
        return await client.messages.create({
            to: phone,
            from: process.env.SMS_FROM_NUMBER,
            body: `Your codershouse OTP is ${otp}. It will expire in ${expire_mins} min`,
        });
    }
    
    async sendByEmail(email, otp, ttl) {
        const expire_mins = ttl / (60 * 1000);
        const emailStyles = fs.readFileSync("storage/emailStyles/emailStyles.html", "utf8");

        let message = emailStyles.replace("{{otp}}", otp);
        message = message.replace("{{ttl}}", expire_mins);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN
            }
        });

        const mailOptions = {
            from: "bhoumikpagdhare2002@gmail.com",
            to: email,
            subject: 'CoderHouse Login OTP',
            html: message,
        };

        transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
              console.log(err);
            } else {
              console.log("Email sent successfully");
            }
          });
    }

    verifyOtp(hashedOtp, data) {
        let computedHash = hashService.hashOtp(data);
        return computedHash === hashedOtp;
    }
}

module.exports = new OtpService();
