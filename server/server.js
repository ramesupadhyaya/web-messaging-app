const Koa = require('koa');
const serverMiddleware = require('./base/serverMiddleware');
const app = new Koa();

// init uncaught exception handler
require('./base/uncaughtExceptionHandler');
serverMiddleware(app);
// require cors middleware

// require all routes here
const {routes, allowedMethods} = require('./routes');
app.use(routes).use(allowedMethods);

// attach app with socket
const server = require('http').createServer(app.callback());
require('./base/socketConnector')(server);

server.listen(8081);


