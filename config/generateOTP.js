const generateOTP = ()=>{
    const otpLength = 6;
    const otp = Math.random()
    .toString()
    .slice(2, 2 + otpLength);

    return otp;
}

module.exports=generateOTP