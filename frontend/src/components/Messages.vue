<template>
  <v-card class="no-border">
    <v-card-title class="white--text align-top top-content">
      {{ currentSelected || 'Start Conversation' }}
    </v-card-title>
    <v-img
      max-height="91vh"
      class="white--text align-end messages"
      src="../assets/char-background.jpg"
    >
      <v-list ref="scroller" class="message-list" color="transperent">
        <v-list-item
          style="display: contents"
          :key="index"
          v-for="(message, index) of messages"
        >
          <div :class="message.isReply ? '' : 'myMessageWrapper'">
            <span :class="message.isReply ? 'reply' : 'myMessage'">
              {{ message.body }}
              <span class="timeClass">{{ formatDate(message.createdAt) }}</span>
            </span>
          </div>
        </v-list-item>
      </v-list>
      <v-text-field
        rounded
        v-if="currentSelected"
        class="mx-1 mt-6 main-box"
        hide-details
        autofocus
        clear-icon
        dark
        outlined
        v-model="message"
        @keydown.enter="sendMessage"
      >
        <template #append>
          <v-btn @click="sendMessage" class="send-icon" fab dark small>
            <v-icon dark>mdi-send</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-img>
  </v-card>
</template>
<script>
import { getSocket } from '../service/socketHandler';
export default {
  name: 'messages',
  props: {
    currentSelected: { type: String, required: true },
    messages: { type: Array, required: true },
  },
  computed: {
    conversationId() {
      return this.messages[0]?.conversationId || null;
    },
  },
  data() {
    return {
      message: null,
    };
  },
  created() {
    this.scrollToBottom();
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleTimeString();
    },
    scrollToBottom() {
      // scrolling to last message here
      // this.$refs.scroller
      if (this.$refs.scroller) {
        this.$refs.scroller.$el.scrollTop =
          this.$refs.scroller.$el.scrollHeight -
          this.$refs.scroller.$el.clientHeight +
          100;
      }
    },
    sendMessage() {
      // scroll to bottom
      this.scrollToBottom();
      const socket = getSocket();

      socket.emit('message', {
        to: this.currentSelected,
        message: this.message,
      });

      // also update the messages
      this.$emit('messageAdded', {
        number: this.currentSelected,
        message: {
          body: this.message,
          conversationId: this.conversationId,
          createdAt: new Date().toJSON(),
        },
      });
      this.message = null;
    },
  },
};
</script>
<style scoped>
.full {
  height: 100%;
  max-height: 100% !important;
  overflow: hidden;
}
.main-box {
  background-color: rgba(6, 14, 12, 0.8);
  border-color: rgb(6, 14, 12);
}
.top-content {
  background: #07261e;
}
.send-icon {
  margin-top: -10px;
}
.no-border {
  border-radius: 0 !important;
}
.myMessage {
  background-color: lightblue;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  display: inline-grid;
}
.reply {
  background-color: lightpink;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  display: inline-grid;
}
.timeClass {
  text-align: right;
  font-size: 12px;
}

.myMessageWrapper {
  text-align: end;
}

.messages {
  overflow: auto;
}

.message-list {
  max-height: 600px !important;
  height: 50% !important;
  background: transparent !important;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}

/* copied */
::-webkit-scrollbar {
  width: 1px;
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

.v-list-item::after {
  display: none;
}
</style>
