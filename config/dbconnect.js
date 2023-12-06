const mongoose = require('mongoose')
//const uri = 'mongodb://127.0.0.1:27017/e-commerce'
const uri = process.env.MONGODB_URL
const connect = () => {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Mongodb connected')
        }).catch((err) => {
            console.log('Connection error :' + err);
        })
}

module.exports={connect}
