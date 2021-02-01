const baseService = require('../service/baseService');

async function fetchContacts(ctx, next) {
  try {
    ctx.body = await baseService.fetchContacts(ctx.params.id);
  } catch (err) {
    console.error(err);
  }
  next();
}

async function fetchContactMessages(ctx, next) {
  try {
    ctx.body = await baseService.fetchContactMessages(
        ctx.params.clientId,
        ctx.params.id,
    );
  } catch (err) {
    console.error(err);
  }
  next();
}

async function newMessage(ctx, next) {
  // update body here and next
  try {
    await baseService.newMessageReceived(ctx.request.body);
  } catch (err) {
    console.error(err);
  }

  next();
}

module.exports = {
  fetchContacts,
  fetchContactMessages,
  newMessage,
};
