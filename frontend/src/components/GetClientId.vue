<template>
  <v-dialog persistent v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Enter New Mobile Number
      </v-card-title>

      <v-card-text>
        <v-text-field
          autofocus
          class="mt-4"
          outlined
          v-model="number"
          hint="With Country Code"
          :rules="[existingChecker]"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text :disabled="!number" @click="numberUpdated">
          Submit
        </v-btn>

        <v-btn @click="closeDialog" text>Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'get-client-id',
  props: {
    currentAvailableNumbers: Array,
  },
  data() {
    return {
      dialog: true,
      number: null,
    };
  },
  methods: {
    numberUpdated() {
      this.closeDialog();
      this.$emit('myNumber', this.number);
    },
    closeDialog() {
      this.dialog = false;
      this.$emit('close');
    },
    existingChecker(value) {
      if (!/^\+[0-9]*$/.test(value)) {
        return 'Invalid Entry';
      }

      return value && this.currentAvailableNumbers.some((n) => n === value)
        ? 'Already Exists'
        : true;
    },
  },
};
</script>
