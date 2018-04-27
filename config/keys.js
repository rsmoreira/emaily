if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prd.js');
} else {
    module.exports = require('./dev.js');
}