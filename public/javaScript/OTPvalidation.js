function validate(){
    let otp = document.getElementById('otp');
    let otpError = document.getElementById('OTPError')

    const otpRegex = /^[0-9]{6}$/;

    if(otp.value.trim()===''){
        otpError.innerHTML='Please Enter your OTP'
        otp.style.borderColor='red'
        setTimeout(() => {
            otpError.innerHTML=''
            otp.style.borderColor=''
        }, 5000);
        return false
    }
    if(!otpRegex.test(otp.value)){
        otpError.innerHTML='Please Enter a Valid OTP'
        otp.style.borderColor='red';
        setTimeout(() => {
            otpError.innerHTML=''
            otp.style.borderColor=''
        }, 5000);
        return false
    }
    return true
}

var timeLeft = 59;
		var timer = document.getElementById('timer');
		var resend = document.getElementById('resend');

		timer.innerHTML = timeLeft + ' seconds left';

		var interval = setInterval(function() {
			if (timeLeft <= 0) {
				clearInterval(interval);
				timer.innerHTML = '';
				resend.style.display = 'block';
			} else {
				timer.innerHTML = timeLeft + ' seconds left';
                resend.style.display='none'
			}
			timeLeft -= 1;
		}, 1000);

		resend.onclick = function() {
			timeLeft = 30;
			resend.style.display = 'none';
			interval = setInterval(function() {
				if (timeLeft <= 0) {
					clearInterval(interval);
					timer.innerHTML = 'OTP expired';
					resend.style.display = 'block';
				} else {
					timer.innerHTML = timeLeft + ' seconds left';
				}
				timeLeft -= 1;
			}, 1000);
		};