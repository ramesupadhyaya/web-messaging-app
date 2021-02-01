const Router = require('@koa/router');
const appRouter = new Router();
const baseController = require('./controller/baseController');

// keeping all the routes here as app is expected to have less routes
// otherwise we could have used divided routes structure

appRouter.get('/api/fetch-contact-details/:id', baseController.fetchContacts);

appRouter.get(
    '/api/fetch-contact-messages/:clientId/:id',
    baseController.fetchContactMessages,
);

appRouter.post('/api/sms/reply', baseController.newMessage);

module.exports = {
  routes: appRouter.routes(),
  allowedMethods: appRouter.allowedMethods(),
};
