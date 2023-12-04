const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const app=express();

const PORT = process.env.PORT || 4000

//connect to mongodb
const {connect} = require('./config/dbconnect')
connect();

app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','hbs')
app.set('views','./views');

//user
const userRouter = require('./routes/userRouter')
app.use('/',userRouter);

//admin
const adminRouter = require('./routes/adminRouter')
app.use('/admin',adminRouter);

//product

//catch 404 and forward to error handler
 app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

  
  
app.listen(PORT,()=>{
    console.log(`Server running at PORT ${PORT}`);
})


