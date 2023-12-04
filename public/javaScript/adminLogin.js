function validate(){
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    const username = document.getElementById('username');
    const password = document.getElementById('password');

    if(username.value.trim()==''){
        usernameError.innerHTML='Field is required';
        username.style.borderColor='red';
        setTimeout(()=>{
            usernameError.innerHTML=''
            username.style.borderColor=''
        },5000)
        return false
    }

    if(password.value.trim()==''){
        passwordError.innerHTML='Field is required';
        password.style.borderColor='red'
        setTimeout(()=>{
            passwordError.innerHTML='';
            password.style.borderColor=''
        },5000)
        return false

    }
    return true
}