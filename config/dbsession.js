const express = require('express');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session)
const uri = process.env.MONGODB_URL

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
