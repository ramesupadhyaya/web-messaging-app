const socketIo = require('socket.io');
const SocketHandler = require('./socketHandler/socketHandler');


module.exports = function(app) {
  const options = {cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }};
  const io = socketIo(app, options);

  io.on('connection', SocketHandler.connection.bind(SocketHandler));
};
