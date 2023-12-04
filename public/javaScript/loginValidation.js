function validate(){
    let email = document.getElementById('email');
    let password = document.getElementById('password')

    let emailError = document.getElementById('emailError');
    let passwordError = document.getElementById('passwordError');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail+\.[a-zA-Z]{3}$/;

    if(email.value.trim()===''){
        emailError.innerHTML='Email field is required'
        email.style.borderColor='red';
        setTimeout(() => {
            emailError.innerHTML=''
            email.style.borderColor=''
        }, 5000);
        return false
    }

    if(!emailRegex.test(email.value)){
        emailError.innerHTML='Please Enter Valid Email'
        email.style.borderColor='red'
        setTimeout(() => {
            emailError.innerHTML=''
            email.style.borderColor=''
        }, 5000);
        return false
    }

    if(password.value.trim()===''){
        passwordError.innerHTML='Password field is required'
        password.style.borderColor='red'
        setTimeout(()=>{
            passwordError.innerHTML=''
            password.style.borderColor=''
        },5000);
        return false
    }
    return true
}