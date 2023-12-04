const express = require('express');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session)
const uri = 'mongodb://127.0.0.1:27017/e-commerce'

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