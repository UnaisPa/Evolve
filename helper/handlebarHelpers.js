const handlebars = require('handlebars');
const moment = require('moment');
const chekEqual = ()=>{
    handlebars.registerHelper('eq', function(a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
}

const chekGreater = ()=>{
    handlebars.registerHelper('gt', function(a, b, options) {
        if (a > b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
}

const chekLess = ()=>{
    handlebars.registerHelper('lt', function(a, b, options) {
        if (a > b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
}
let count=0;
const looping = ()=>{

    handlebars.registerHelper('loop', function(a, options) {
        if (a) {
            count+=1
            return options.fn(count);
        }
        return options.inverse(this);
    });
}
  
const formatDate = ()=>{
    handlebars.registerHelper('formatDate', function (dateString) {
        // Parse the input date string using Moment.js
        const date = moment(dateString);
      
        // Format the date in the desired format
        const formattedDate = date.format('ddd MMM DD YYYY');
      
        // Return the formatted date
        return formattedDate;
      });
}

module.exports = {
    chekEqual,
    chekGreater,
    chekLess,
    looping,
    formatDate
}