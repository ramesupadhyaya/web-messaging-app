<template>
  <v-card color="#276657" class="full">
    <v-card-title class="white--text align-top top-content">
      Contacts
    </v-card-title>
    <v-list color="#276657" subheader>
      <div v-for="contact in contacts" :key="contact.number">
        <v-hover v-slot="{ hover }">
          <v-list-item
            :class="
              `${hover ? 'hovered' : ''} ${
                currentSelected === contact.number ? 'active' : ''
              }`
            "
            @click="setActiveItem(contact.number)"
            class="pointer"
            ripple
          >
            <v-list-item-avatar>
              <v-icon>mdi-chat</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                class="white--text text-xl "
                v-text="contact.number"
              ></v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon>
              <v-badge
                v-if="notifications.has(contact.number)"
                bordered
                color="primary"
                icon="mdi-plus"
                overlap
              >
                <v-icon color="grey">
                  mdi-message-outline
                </v-icon>
              </v-badge>
              <v-icon v-else color="grey">
                mdi-message-outline
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-hover>
        <v-divider :key="contact.number" />
      </div>
    </v-list>

    <v-btn
      @click="newContact = true"
      color="pink"
      class="bottom"
      dark
      absolute
      right
      fab
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <GetClientId
      v-if="newContact"
      :current-available-numbers="contacts.map((item) => item.number)"
      @myNumber="numberAdded"
      @close="newContact = null"
    />
  </v-card>
</template>
<script>
import GetClientId from './GetClientId.vue';
export default {
  components: { GetClientId },
  name: 'contacts',
  props: {
    contacts: Array,
    currentSelected: String,
    notifications: Set,
  },
  data() {
    return {
      newContact: false,
    };
  },
  methods: {
    numberAdded(number) {
      // number added here
      this.$emit('contactAdded', { number });
    },
    setActiveItem(number) {
      this.$emit('activeUpdated', number);
    },
  },
};
</script>
<style scoped>
.full {
  height: 100%;
  max-height: 100% !important;
  overflow: hidden;
  border-right: 5px solid #07261e !important;
}

.top-content {
  background: #07261e;
}

.pointer {
  cursor: pointer;
  min-height: 70px;
}

.hovered {
  background-color: rgba(7, 38, 30, 0.5);
}

.active {
  background-color: rgba(7, 38, 30, 0.2);
}

.bottom {
  bottom: 45px;
}
</style>
