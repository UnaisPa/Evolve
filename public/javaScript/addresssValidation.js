function validate() {
    //inputs
    const name = document.getElementById('name');
    const mobile = document.getElementById('mobile');
    const city = document.getElementById('city');
    const state = document.getElementById('state');
    const pincode = document.getElementById('pincode');
    const district = document.getElementById('district');
    const address = document.getElementById('address');

    //errors
    const nameError = document.getElementById('nameError');
    const mobileError = document.getElementById('mobileError');
    const cityError = document.getElementById('cityError');
    const stateError = document.getElementById('stateError');
    const pinError = document.getElementById('pinError');
    const districtError = document.getElementById('districtError');
    const addressError = document.getElementById('addressError');

    //regex
    const nameRegex = /^[A-Z]/;
    const cityRegex = /^[a-zA-Z]/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail+\.[a-zA-Z]{3}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mobileRegex = /^[0-9]{10}$/;
    const pinRegex = /^[0-9]{6}$/

    if (name.value.trim() === '') {
        nameError.innerHTML = 'Field is Required'
        name.style.borderColor = 'red'
        setTimeout(() => {
            nameError.innerHTML = ''
            name.style.borderColor = ''
        }, 5000);
        return false
    }
    if (!nameRegex.test(name.value)) {
        nameError.innerHTML = 'First letter Should be Capital'
        name.style.borderColor = 'red'
        setTimeout(() => {
            nameError.innerHTML = ''
            name.style.borderColor = ''
        }, 6000);
        return false
    }

    if (mobile.value.trim() === '') {
        mobileError.innerHTML = 'Field is Required';
        mobile.style.borderColor = 'red'
        setTimeout(() => {
            mobileError.innerHTML = '';
            mobile.style.borderColor = ''
        }, 6000);
        return false
    }

    if (!mobileRegex.test(mobile.value)) {
        mobileError.innerHTML = 'Enter valid Mob Number';
        mobile.style.borderColor = 'red'
        setTimeout(() => {
            mobileError.innerHTML = '';
            mobile.style.borderColor = ''
        }, 6000);
        return false
    }

    if (city.value.trim() === '') {
        cityError.innerHTML = 'Field is Required'
        city.style.borderColor = 'red'
        setTimeout(() => {
            cityError.innerHTML = ''
            city.style.borderColor = ''
        }, 6000);
        return false
    }
    if (!cityRegex.test(city.value)) {
        cityError.innerHTML = 'Enter a valid City Name'
        city.style.borderColor = 'red'
        setTimeout(() => {
            cityError.innerHTML = ''
            city.style.borderColor = ''
        }, 6000);
        return false
    }

    if (state.value.trim() === '') {
        stateError.innerHTML = 'Field is Required';
        state.style.borderColor = 'red'
        setTimeout(() => {
            stateError.innerHTML = ''
            state.style.borderColor = ''
        }, 6000);
        return false
    }
    if (!cityRegex.test(state.value)) {
        stateError.innerHTML = 'Enter valid State Name';
        state.style.borderColor = 'red'
        setTimeout(() => {
            stateError.innerHTML = ''
            state.style.borderColor = ''
        }, 6000);
        return false
    }

    if (pincode.value.trim() === '') {
        pinError.innerHTML = 'Field is Required';
        pincode.style.borderColor = 'red'
        setTimeout(() => {
            pinError.innerHTML = ''
            pincode.style.borderColor = ''
        }, 6000);
        return false
    }

    if (!pinRegex.test(pincode.value)) {
        pinError.innerHTML = 'Enter valid Pincode';
        pincode.style.borderColor = 'red'
        setTimeout(() => {
            pinError.innerHTML = ''
            pincode.style.borderColor = ''
        }, 6000);
        return false
    }

    if (district.value.trim() === '') {
        districtError.innerHTML = 'Field is Required';
        district.style.borderColor = 'red'
        setTimeout(() => {
            districtError.innerHTML = ''
            district.style.borderColor = ''
        }, 6000);
        return false
    }

    if (!cityRegex.test(district.value)) {
        districtError.innerHTML = 'Enter valid District Name';
        district.style.borderColor = 'red'
        setTimeout(() => {
            districtError.innerHTML = ''
            district.style.borderColor = ''
        }, 6000);
        return false
    }

    if (address.value.trim() === '') {
        addressError.innerHTML = 'Field is Required';
        address.style.borderColor = 'red'
        setTimeout(() => {
            addressError.innerHTML = ''
            address.style.borderColor = ''
        }, 6000);
        return false
    }
    return true
}
function validateProfile() {
    const name = document.getElementById('nameProfile');
    // const mobile = document.getElementById('mobileProfile');
    // const email = document.getElementById('emailProfile');

    const nameError = document.getElementById('nameErrorProfile');
    // const mobileError = document.getElementById('mobileErrorProfile');
    // const emailError = document.getElementById('emailErrorProfile');

    //regex
    const nameRegex = /^[A-Z]/;
    const cityRegex = /^[a-zA-Z]/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail+\.[a-zA-Z]{3}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mobileRegex = /^[0-9]{10}$/;
    const pinRegex = /^[0-9]{6}$/

    if (name.value.trim() === '') {
        nameError.innerHTML = 'Field is Required'
        name.style.borderColor = 'red'
        setTimeout(() => {
            nameError.innerHTML = ''
            name.style.borderColor = ''
        }, 5000);
        return false
    }
    if (!nameRegex.test(name.value)) {
        nameError.innerHTML = 'First letter Should be Capital'
        name.style.borderColor = 'red'
        setTimeout(() => {
            nameError.innerHTML = ''
            name.style.borderColor = ''
        }, 6000);
        return false
    }
   

    return true;
}

function editAddressValidate() {
    const name = document.getElementById('EditName')
    const mobile = document.getElementById('EditMobile')
    const city = document.getElementById('EditCity')
    const pincode = document.getElementById('EditPincode')
    const district = document.getElementById('EditDistrict')
    const state = document.getElementById('EditState')
    const address = document.getElementById('EditAddress')

     //errors
     const nameError = document.getElementById('EnameError');
     const mobileError = document.getElementById('EmobileError');
     const cityError = document.getElementById('EcityError');
     const stateError = document.getElementById('EstateError');
     const pinError = document.getElementById('EpinError');
     const districtError = document.getElementById('EdistrictError');
     const addressError = document.getElementById('EaddressError');
 
     //regex
     const nameRegex = /^[A-Z]/;
     const cityRegex = /^[a-zA-Z]/;
     const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail+\.[a-zA-Z]{3}$/;
     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
     const mobileRegex = /^[0-9]{10}$/;
     const pinRegex = /^[0-9]{6}$/
 
        console.log(name.value)
     if (name.value.trim() === '') {
         nameError.innerHTML = 'Field is Required'
         name.style.borderColor = 'red'
         setTimeout(() => {
             nameError.innerHTML = ''
             name.style.borderColor = ''
         }, 5000);
         return false
     }
     if (!nameRegex.test(name.value)) {
         nameError.innerHTML = 'First letter Should be Capital'
         name.style.borderColor = 'red'
         setTimeout(() => {
             nameError.innerHTML = ''
             name.style.borderColor = ''
         }, 6000);
         return false
     }
 
     if (mobile.value.trim() === '') {
         mobileError.innerHTML = 'Field is Required';
         mobile.style.borderColor = 'red'
         setTimeout(() => {
             mobileError.innerHTML = '';
             mobile.style.borderColor = ''
         }, 6000);
         return false
     }
 
     if (!mobileRegex.test(mobile.value)) {
         mobileError.innerHTML = 'Enter valid Mob Number';
         mobile.style.borderColor = 'red'
         setTimeout(() => {
             mobileError.innerHTML = '';
             mobile.style.borderColor = ''
         }, 6000);
         return false
     }
 
     if (city.value.trim() === '') {
         cityError.innerHTML = 'Field is Required'
         city.style.borderColor = 'red'
         setTimeout(() => {
             cityError.innerHTML = ''
             city.style.borderColor = ''
         }, 6000);
         return false
     }
     if (!cityRegex.test(city.value)) {
         cityError.innerHTML = 'Enter a valid City Name'
         city.style.borderColor = 'red'
         setTimeout(() => {
             cityError.innerHTML = ''
             city.style.borderColor = ''
         }, 6000);
         return false
     }
 
     if (state.value.trim() === '') {
         stateError.innerHTML = 'Field is Required';
         state.style.borderColor = 'red'
         setTimeout(() => {
             stateError.innerHTML = ''
             state.style.borderColor = ''
         }, 6000);
         return false
     }
     if (!cityRegex.test(state.value)) {
         stateError.innerHTML = 'Enter valid State Name';
         state.style.borderColor = 'red'
         setTimeout(() => {
             stateError.innerHTML = ''
             state.style.borderColor = ''
         }, 6000);
         return false
     }
 
     if (pincode.value.trim() === '') {
         pinError.innerHTML = 'Field is Required';
         pincode.style.borderColor = 'red'
         setTimeout(() => {
             pinError.innerHTML = ''
             pincode.style.borderColor = ''
         }, 6000);
         return false
     }
 
     if (!pinRegex.test(pincode.value)) {
         pinError.innerHTML = 'Enter valid Pincode';
         pincode.style.borderColor = 'red'
         setTimeout(() => {
             pinError.innerHTML = ''
             pincode.style.borderColor = ''
         }, 6000);
         return false
     }
 
     if (district.value.trim() === '') {
         districtError.innerHTML = 'Field is Required';
         district.style.borderColor = 'red'
         setTimeout(() => {
             districtError.innerHTML = ''
             district.style.borderColor = ''
         }, 6000);
         return false
     }
 
     if (!cityRegex.test(district.value)) {
         districtError.innerHTML = 'Enter valid District Name';
         district.style.borderColor = 'red'
         setTimeout(() => {
             districtError.innerHTML = ''
             district.style.borderColor = ''
         }, 6000);
         return false
     }
 
     if (address.value.trim() === '') {
         addressError.innerHTML = 'Field is Required';
         address.style.borderColor = 'red'
         setTimeout(() => {
             addressError.innerHTML = ''
             address.style.borderColor = ''
         }, 6000);
         return false
     }
     return true
}