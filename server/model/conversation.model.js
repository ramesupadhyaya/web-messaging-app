const mongoose = require('mongoose');

class Conversation {
  _init() {
    const schema = new mongoose.Schema(
        {
          body: {
            type: String,
            required: true,
          },
          isReply: {
            type: Boolean,
            required: false,
          },
          conversationId: {
            type: mongoose.Types.ObjectId,
            required: true,
          },
        },
        {timestamps: true},
    );

    mongoose.model('conversation', schema);
  }

  getInstance() {
    this._init();
    return {conversation: mongoose.model('conversation')};
  }
}

module.exports = Conversation;
