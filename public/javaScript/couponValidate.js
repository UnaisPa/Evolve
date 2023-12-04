function validate(){
    const couponCode = document.getElementById('couponCode');
    const description = document.getElementById('couponDescription');
    const minOrder = document.getElementById('minOrder');
    const maxDiscount = document.getElementById('maxDiscount');
    const expiryDate = document.getElementById('expiryDate');
    const startingDate = document.getElementById('startingDate');
    const discountPercentage = document.getElementById('discountPercentage');

    //Error messages
    const couponCodeError = document.getElementById('couponCodeError')
    const couponDescError = document.getElementById('couponDescError');
    const minOrderError = document.getElementById('minOrderError');
    const maxDiscountError =document.getElementById('maxDiscountError');
    const startingDateError = document.getElementById('startingDateError');
    const expiryDateError = document.getElementById('expiryDateError');
    const discountPercentageError = document.getElementById('discountPercentageError');

    const descriptionRegex = /^[a-zA-Z]/;

    if (couponCode.value.trim() === '') {
        couponCodeError.innerHTML = 'Field is Required'
        couponCode.style.borderColor = 'red'
        setTimeout(() => {
            couponCodeError.innerHTML = ''
            couponCode.style.borderColor = ''
        }, 5000);
        return false
    }
    if (description.value.trim() === '') {
        couponDescError.innerHTML = 'Field is Required'
        description.style.borderColor = 'red'
        setTimeout(() => {
            couponDescError.innerHTML = ''
            description.style.borderColor = ''
        }, 5000);
        return false
    }
    if (!descriptionRegex.test(description.value)) {
        couponDescError.innerHTML = 'Enter proper description'
        description.style.borderColor = 'red'
        setTimeout(() => {
            couponDescError.innerHTML = ''
            description.style.borderColor = ''
        }, 5000);
        return false
    }
    if (minOrder.value.trim() === '') {
        minOrderError.innerHTML = 'Field is Required'
        minOrder.style.borderColor = 'red'
        setTimeout(() => {
            minOrderError.innerHTML = ''
            minOrder.style.borderColor = ''
        }, 5000);
        return false
    }
    if (minOrder.value <=0) {
        minOrderError.innerHTML = 'Enter proper value'
        minOrder.style.borderColor = 'red'
        setTimeout(() => {
            minOrderError.innerHTML = ''
            minOrder.style.borderColor = ''
        }, 5000);
        return false
    }
    if (discountPercentage.value.trim() === '') {
        discountPercentageError.innerHTML = 'Field is Required'
        discountPercentage.style.borderColor = 'red'
        setTimeout(() => {
            discountPercentageError.innerHTML = ''
            discountPercentage.style.borderColor = ''
        }, 5000);
        return false
    }
    if (discountPercentage.value <=0 || discountPercentage.value>100) {
        discountPercentageError.innerHTML = 'Please Enter Proper discount percentage'
        discountPercentage.style.borderColor = 'red'
        setTimeout(() => {
            discountPercentageError.innerHTML = ''
            discountPercentage.style.borderColor = ''
        }, 5000);
        return false
    }
    if (maxDiscount.value.trim() === '') {
        maxDiscountError.innerHTML = 'Field is Required'
        maxDiscount.style.borderColor = 'red'
        setTimeout(() => {
            maxDiscountError.innerHTML = ''
            maxDiscount.style.borderColor = ''
        }, 5000);
        return false
    }
    if (maxDiscount.value <=0) {
        maxDiscountError.innerHTML = 'Enter proper value'
        maxDiscount.style.borderColor = 'red'
        setTimeout(() => {
            maxDiscountError.innerHTML = ''
            maxDiscount.style.borderColor = ''
        }, 5000);
        return false
    }
    if (expiryDate.value.trim() === '') {
        expiryDateError.innerHTML = 'Field is Required'
        expiryDate.style.borderColor = 'red'
        setTimeout(() => {
            expiryDateError.innerHTML = ''
            expiryDate.style.borderColor = ''
        }, 5000);
        return false
    }
    let enteredDate = new Date(expiryDate.value);
    let startDate = new Date(startingDate.value)
    if (enteredDate< new Date() || enteredDate<startDate) {
        expiryDateError.innerHTML = 'Please Enter future Expiration Date'
        expiryDate.style.borderColor = 'red'
        setTimeout(() => {
            expiryDateError.innerHTML = ''
            expiryDate.style.borderColor = ''
        }, 5000);
        return false
    }

    if (startingDate.value.trim() === '') {
        startingDateError.innerHTML = 'Field is Required'
        startingDate.style.borderColor = 'red'
        setTimeout(() => {
            startingDateError.innerHTML = ''
            startingDate.style.borderColor = ''
        }, 5000);
        return false
    }
    return true
}