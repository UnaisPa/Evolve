const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

// Register a custom Handlebars helper function
const hbs = exphbs.create({
    helpers: {
        formatDate: function(date) {
            return new Date(date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        },
    },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
module.exports = {hbs}
