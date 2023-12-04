const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail'
    auth: {
      user: 'unaismuhmed712@gmail.com',
      pass: 'jcss dpdv ekbp sutm',
    },
  });
  
  function sendOTPByEmail(email, otp) {
    const mailOptions = {
      from: 'unaismuhmed712@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for registration is: ${otp}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
      
    });
  }

  function sendOtpForgotPassword(email, otp) {
    const mailOptions = {
      from: 'unaismuhmed712@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for create new Password: ${otp}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
      
    });
  }
  
  module.exports ={sendOTPByEmail,sendOtpForgotPassword}