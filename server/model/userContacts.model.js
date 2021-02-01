const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  number: String,
  conversationId: mongoose.Types.ObjectId,
});


class UserContacts {
  _init() {
    const schema = new mongoose.Schema(
        {
          clientId: {
            type: String,
            required: true,
          },
          contacts: {
            type: [contactSchema],
            required: false,
          },
        },
        {timestamps: true},
    );

    mongoose.model('contacts', schema);
  }

  getInstance() {
    this._init();
    return {contacts: mongoose.model('contacts')};
  }
}

module.exports = UserContacts;
