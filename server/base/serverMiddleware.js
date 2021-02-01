const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
require('dotenv').config({path: '../server/config/.env'});

module.exports = function serverMiddleware(app) {
  app.use(bodyParser());
  app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
    // some legacy browsers (IE11, various SmartTVs) choke on 204
  }));
};
