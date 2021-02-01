<template>
  <div class="full">
    <v-row class="full" no-gutters>
      <v-col cols="3">
        <Contacts
          :currentSelected="currentSelected"
          :notifications="notifications"
          @contactAdded="contactAdded"
          @activeUpdated="activeUpdated"
          :contacts="details"
        />
      </v-col>
      <v-col cols="9">
        <Messages
          @messageAdded="messageAdded"
          :messages="messages"
          :currentSelected="currentSelected"
        />
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import {
  fetchDetails,
  addNewSmsInStore,
  updateActiveAndFetchMessagesIfRequired,
  saveMessageList,
  sendNotification,
  getMessagesFromStore,
} from '../service/baseService';
import Messages from './Messages.vue';
import Contacts from './Contacts.vue';
import { getSocket } from '../service/socketHandler';
export default {
  components: { Messages, Contacts },
  name: 'main-screen',
  data() {
    return {
      clientId: 'static_user', // for now taking static client id
      details: [],
      messages: [],
      currentSelected: '',
      socket: null,
      notifications: new Set(),
      snackbar: null,
      text: null,
    };
  },
  created() {
    this.fetchClientDetails();
  },

  methods: {
    async fetchClientDetails() {
      this.fetching = true;
      this.makeSocketConnection();
      this.details = await fetchDetails(this.clientId);
      this.fetching = false;
    },
    contactAdded(contact) {
      this.details.push(contact);
    },
    async activeUpdated(number) {
      // set active in local storage also fetch details of active number
      // if required
      // for now we are storing fetched messages in local storage
      // if its used for very long conversations and with many people
      // we can think of pagination and only store last some messages in local storage
      // for now I am storing every message in localstorage so we dont need to fetch again
      const messages = await updateActiveAndFetchMessagesIfRequired(
        number,
        this.clientId
      );
      this.messages = messages;
      this.currentSelected = number;
      this.notifications.delete(number);
    },
    makeSocketConnection() {
      const socket = getSocket();
      socket.on('message', (data) => this.newSMSReceived(data));
      socket.on('error', (data) => this.errorWhileSendingMessage(data));
    },
    messageAdded({ number, message }) {
      const messages = getMessagesFromStore(number);
      this.messages = [message, ...messages];
      saveMessageList(number, this.messages);
    },

    async newSMSReceived({ from, message }) {
      const messages = addNewSmsInStore({ from, message });

      if (this.currentSelected === from) {
        // update messages
        this.messages = messages;
      } else {
        // show new message notification
        this.notifications = new Set([...this.notifications, from]);
        await sendNotification(from);
      }
    },

    errorWhileSendingMessage({ to }) {
      this.snackbar = true;
      this.text = `Message sending failed To: ${to}`;
    },
  },
};
</script>
<style scoped>
.full {
  height: 100%;
  max-height: 100%;
}
.border-right {
  border-right: 1px solid grey;
}
</style>
<style>
/* copied */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
