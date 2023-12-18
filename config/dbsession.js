const express = require('express');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session)

const uri = 'mongodb+srv://unaismuhmed712:parammel321@evolvecluster.wxunp9m.mongodb.net/e-commerce';


const adminStore = new mongodbSession({
    uri:uri,
    collection:"adminSession"
})

const userStore =  new mongodbSession({
    uri:uri,
    collection:"userSession",
    
})

const Store = new mongodbSession({
    uri:uri,
    collection:"store"
})

module.exports={adminStore,userStore,Store};
