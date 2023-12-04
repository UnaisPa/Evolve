const Handlebars = require('handlebars');

// Register a custom helper to generate a sequence of numbers
Handlebars.registerHelper('range', function (from, to, block) {
  let result = '';
  for (let i = from; i <= to; i++) {
    result += block.fn(i);
  }
  return result;
});
