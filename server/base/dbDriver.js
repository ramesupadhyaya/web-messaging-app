const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');
class DatabaseConnection {
  constructor() {
    const url = process.env.MONGODB_URI;
    console.log('Establish new connection with url', url);
    // mongoose.Promise = global.Promise;
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(url);
    this.models = {};
    this._init();
  }


  _init() {
    // here we are requiring the models
    const modelFiles = glob.sync(
        `${path.join(__dirname, '..', 'model')}/*.model.js`,
    );

    modelFiles.forEach((file) => {
      const ModelClass = require(file);

      const obj = new ModelClass();

      this.models = {
        ...(this.models || {}),
        ...obj.getInstance(),
      };
    });
  }
}

module.exports = new DatabaseConnection();
