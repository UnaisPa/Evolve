
function validate() {
    //     //error messages
    let nameError = document.getElementById('nameError');
    let mobileError= document.getElementById('mobileError');
    let emailError = document.getElementById('emailError');
    let passwordError = document.getElementById('passwordError')

    //Input IDs
    let name = document.getElementById('name')
    let mobile = document.getElementById('mobile');
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    //Regex
    const nameRegex = /^[A-Z]/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail+\.[a-zA-Z]{3}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mobileRegex = /^[0-9]{10}$/;
    const passwordRegex1 = /^[a-z]{8}$/
    const passwordRegex2 = /^[A-Z]{8}$/
    const passwordRegex3 = /^[0-9]{8}$/


    //name   
    if(name.value.trim()===''){
        nameError.innerHTML='Name field is Required'
        name.style.borderColor='red'
        setTimeout(()=>{
            nameError.innerHTML=''
            name.style.borderColor=''
        },5000)  
        return false  
    }
    if(!nameRegex.test(name.value)){
        nameError.innerHTML='First letter should be capital'
        name.style.borderColor='red'
        setTimeout(()=>{
            nameError.innerHTML=''
            name.style.borderColor=''
        },5000)   
        return false 
    }
    
    //mobile
    if(mobile.value.trim()===''){
        mobileError.innerHTML='Mobile field is required'
        mobile.style.borderColor='red'
        setTimeout(()=>{
            mobileError.innerHTML=''
            mobile.style.borderColor=''
        },5000)  
        return false
        
    }
    if(!mobileRegex.test(mobile.value)){
        mobileError.innerHTML='Please provide a valid Mobile Number'
        mobile.style.borderColor='red'
        setTimeout(()=>{
            mobileError.innerHTML=''
            mobile.style.borderColor=''
        },5000)
        return false
    }

    //email
    if(email.value.trim()===''){
        emailError.innerHTML='Email field id required';
        email.style.borderColor='red'
        setTimeout(()=>{
            emailError.innerHTML=''
            email.style.borderColor=''
        },5000)    
        return false
    }
    if(!emailRegex.test(email.value)){
        emailError.innerHTML='Please provide a valid Email ID'
        email.style.borderColor='red'
        setTimeout(()=>{
            emailError.innerHTML=''
            email.style.borderColor=''
        },5000)   
        return false
         
    }

    //password
    if(password.value.trim()===''){
        passwordError.innerHTML='Password field is required';
        password.style.borderColor='red'
        setTimeout(()=>{
            passwordError.innerHTML=''
            password.style.borderColor=''
        },5000)
        return false ;
    }
    if(!passwordRegex.test(password.value)){
        passwordError.innerHTML='Please Enter a Strong Password';
        password.style.borderColor='red'
        setTimeout(()=>{
            passwordError.innerHTML=''
            password.style.borderColor=''
        },5000) 
        return false
    }
    return true         
  }

//   setTimeout(function() {
//     var div = document.querySelector("#alertt");
//     div.classList.add("move-down");
// }, 1000);