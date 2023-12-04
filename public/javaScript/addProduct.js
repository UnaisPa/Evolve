function validate(){
    const name = document.getElementById('name');
    const price = document.getElementById('price');
    const offerprice = document.getElementById('offerprice');
    const quantity = document.getElementById('quantity');
    const description = document.getElementById('description');
    const image = document.getElementById('image');
    const color = document.getElementById('color')

    const nameError = document.getElementById('nameError');
    const priceError = document.getElementById('priceError');
    const offerpriceError = document.getElementById('offerpriceError');
    const quantityError = document.getElementById('quantityError')
    const descriptionError = document.getElementById('descriptionError');
    const imageError = document.getElementById('imageError');
    const colorError = document.getElementById('colorError');
    const numberRegex = /^[1-9]/;
    const nameRegex = /^[A-Z]/;
   
    if(name.value.trim()==''){
        nameError.innerHTML='Filed is Required'
        name.style.borderColor='red'
        setTimeout(()=>{
            nameError.innerHTML=''
            name.style.borderColor=''
        },5000)
        return false;
    }
    if(!nameRegex.test(name.value)){
        nameError.innerHTML='First Letter should be capital'
        name.style.borderColor='red'
        setTimeout(()=>{
            nameError.innerHTML=''
            name.style.borderColor=''
        },5000)
        return false
    }
    if(price.value.trim()==''){
        priceError.innerHTML='Field is Required'
        price.style.borderColor='red'
        setTimeout(()=>{
            priceError.innerHTML=''
            price.style.borderColor=''
        },5000)
        return false
    }
    if(!numberRegex.test(price.value)){
        priceError.innerHTML='Enter Proper value'
        price.style.borderColor='red'
        setTimeout(()=>{
            priceError.innerHTML=''
            price.style.borderColor=''
        },5000)
        return false
    }

    if(price.value<=0){
        priceError.innerHTML='Enter proper value'
        price.style.borderColor='red'
        setTimeout(()=>{
            priceError.innerHTML=''
            price.style.borderColor=''
        },5000)
        return false
    }

    if(offerprice.value.trim()==''){
        offerpriceError.innerHTML='Field is Required'
        offerprice.style.borderColor='red'
        setTimeout(()=>{
            offerpriceError.innerHTML=''
            offerprice.style.borderColor=''
        },5000)
        return false
    }
    if(!numberRegex.test(offerprice.value)){
        offerpriceError.innerHTML='Enter proper value'
        offerprice.style.borderColor='red'
        setTimeout(()=>{
            offerpriceError.innerHTML=''
            offerprice.style.borderColor=''
        },5000)
        return false
    }

    if(offerprice.value<=0){
        offerpriceError.innerHTML='Enter proper value'
        offerprice.style.borderColor='red'
        setTimeout(()=>{
            offerpriceError.innerHTML=''
            offerprice.style.borderColor=''
        },5000)
        return false
    }
    if(quantity.value.trim()==''){
        quantityError.innerHTML='Field is Required'
        quantity.style.borderColor='red'
        setTimeout(()=>{
            quantityError.innerHTML=''
            quantity.style.borderColor=''
        },5000)
        return false
    }
    if(!numberRegex.test(quantity.value)){
        quantityError.innerHTML='Enter proper value'
        quantity.style.borderColor='red'
        setTimeout(()=>{
            quantityError.innerHTML=''
            quantity.style.borderColor=''
        },5000)
        return false
    }
    if(quantity.value<=0){
        quantityError.innerHTML='Enter proper value'
        quantity.style.borderColor='red'
        setTimeout(()=>{
            quantityError.innerHTML=''
            quantity.style.borderColor=''
        },5000)
        return false
    }
    if(description.value.trim()===''){
        descriptionError.innerHTML='Fild is Required'
        description.style.borderColor='red'

        setTimeout(()=>{
        descriptionError.innerHTML=''
        description.style.borderColor=''
        },5000)
        return false
    }
    if(image.value.trim()===''){
        imageError.innerHTML='Fild is Required'
        image.style.borderColor='red'

        setTimeout(()=>{
        imageError.innerHTML=''
        image.style.borderColor=''
        },5000)
        return false
    }
    if(color.value.trim()===''){
        colorError.innerHTML='Fild is Required'
        color.style.borderColor='red'

        setTimeout(()=>{
        colorError.innerHTML=''
        color.style.borderColor=''
        },5000)
        return false
    }
    
    return true

    

    
}