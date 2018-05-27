const dev = require('./webpack/webpack.dev.config');
const prod = require('./webpack/webpack.prod.config');

const env = process.env.NODE_ENV || 'development';

let conf;

switch (env) {
    case 'production':
        conf = prod;
        break;
    case 'development':
        conf = dev;
        break;
}

module.exports = conf;