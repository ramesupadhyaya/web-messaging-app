const SocketWrapper = require('./socketWrapper');

/**
 * Here we have designed the architecture for 2 way multiple communication
 * for now we have static client but in future if required we can update this
 * logic and add multiple client in frontend as well
 */
class SocketHandler {
  constructor() {
    this.connections = {};
  }

  connection(socket) {
    const handshakeData = socket.request;

    const clientId = handshakeData._query['client'];

    if (this.connections[clientId]) {
      this.dropConnection(clientId);
    }

    this.connections[clientId] = new SocketWrapper(clientId, socket);
  }

  getConnection(id) {
    return this.connections[id];
  }

  dropConnection(id) {
    return this.connections[id].disconnect();
  }
}

module.exports = new SocketHandler();
