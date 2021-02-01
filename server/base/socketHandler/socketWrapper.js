const {
  addNewMessageInDb,
  sendNewMessageToUser,
} = require('../../service/baseService');
class SocketWrapper {
  constructor(clientId, socket) {
    this._client = clientId;
    this._socket = socket;
    socket.on('message', this.messageHandler.bind(this));
  }

  disconnect() {
    this._socket.disconnect();
  }

  async messageHandler(message) {
    console.log(`New Message from ${this._client} to ${message.to}`);
    // send message and add in db
    const error = await sendNewMessageToUser(message);
    if (error) {
      this._socket.emit('error', {to: error.to, message: error.message});
    }
    await addNewMessageInDb({...message, clientId: this._client}, false);
  }

  sendReplyToBrowser(message) {
    this._socket.emit('message', message);
  }
}

module.exports = SocketWrapper;
