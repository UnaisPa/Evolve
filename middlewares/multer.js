const multer = require('multer');
const express = require('express');
const path = require('path')

const fileStorageEngine = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/productimages'))
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname)
    }
})

const bannerFileStorageEngine = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/bannerImages'))
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname)
    }
})

module.exports={fileStorageEngine,bannerFileStorageEngine}