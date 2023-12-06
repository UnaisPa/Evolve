const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const uri = 'mongodb+srv://unaismuhmed712:parammel321@evolvecluster.wxunp9m.mongodb.net/';
//const uri = 'mongodb://127.0.0.1:27017/e-commerce'
const connect = () => {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        tlsAllowInvalidCertificates: true,
    })
        .then(() => {
            console.log('Mongodb connected')
        }).catch((err) => {
            console.log('Connection error :' + err);
        })
}

module.exports = { connect }