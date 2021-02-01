<template>
  <v-app>
    <v-main>
      <MainScreen />
    </v-main>
  </v-app>
</template>

<script>
import MainScreen from './components/MainScreen';

export default {
  name: 'App',

  components: {
    MainScreen,
  },
};
</script>
