const mongoose = require('mongoose');
const db = require('../base/dbDriver');
const client = require('twilio')(
    process.env.TWL_ACCOUNT_SID,
    process.env.TWL_AUTH_TOKEN,
);

async function addNewMessageInDb({to, message, clientId}, isReply = false) {
  const [conversation] = await db.models.contacts.aggregate([
    {$match: {clientId: clientId}},
    {
      $project: {
        contacts: {
          $filter: {
            input: '$contacts',
            as: 'item',
            cond: {$eq: ['$$item.number', to]},
          },
        },
      },
    },
  ]);
  if (!conversation || !conversation.contacts.length) {
    const ObjectId = new mongoose.Types.ObjectId();
    await db.models.contacts.updateOne(
        {
          clientId,
        },
        {
          $push: {
            contacts: {
              number: to,
              conversationId: ObjectId,
            },
          },
        },
        {
          upsert: true,
        },
    );

    await db.models.conversation.create({
      body: message,
      isReply,
      conversationId: ObjectId,
    });
    return;
  }

  const [{conversationId}] = conversation.contacts;

  await db.models.conversation.create({
    body: message,
    isReply,
    conversationId,
  });
}

async function fetchContacts(clientId) {
  const conversation = await db.models.contacts.findOne({
    clientId: {$eq: clientId},
  });

  return conversation?.contacts?.map((contact) => ({
    number: contact.number,
    conversationId: contact.conversationId,
  })) || [];
}

async function fetchContactMessages(clientId, number) {
  const conversation = await db.models.contacts.aggregate([
    {$match: {clientId: clientId}},
    {
      $project: {
        contacts: {
          $filter: {
            input: '$contacts',
            as: 'item',
            cond: {$eq: ['$$item.number', number]},
          },
        },
      },
    },
  ]);

  if (!conversation[0] || !conversation[0]?.contacts[0]) {
    return [];
  }

  const conversations = await db.models.conversation
      .find({
        conversationId: {$eq: conversation[0].contacts[0].conversationId},
      })
      .sort({createdAt: -1});

  return conversations;
}

async function newMessageReceived(messageData) {
  const {From, Body} = messageData;

  // as twillio don't allow meta data with sms api and also
  // as we have designed this for demo purpose
  // We have used static_user otherwise we can use that
  // meta data and update that specific user conversation
  const clientId = 'static_user';
  await addNewMessageInDb(
      {
        to: From,
        message: Body,
        clientId,
      },
      true,
  );

  // send message
  const socketHandler = require('../base/socketHandler/socketHandler');

  const socket = socketHandler.connections[clientId];
  socket.sendReplyToBrowser({from: From, message: Body});
}

async function sendNewMessageToUser({to, message}) {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWL_PHONE_NUMBER,
      to: to,
    });
    return null;
    // added double tick logic here but we can use scheduler which
    // will check if the message sent and then update it in the socket
  } catch (err) {
    console.error(err);
    return {to: to, message: 'Not able to send Message'};
  }
}

module.exports = {
  addNewMessageInDb,
  fetchContacts,
  fetchContactMessages,
  newMessageReceived,
  sendNewMessageToUser,
};
