<template>
  <v-container fluid>
    <v-layout>
      <v-btn color="primary" to="apps/periodyfier">Periodyfier</v-btn>
    </v-layout>
    <v-layout>
      <v-btn color="primary" href="https://mainsim.etit.tu-chemnitz.de/gitlab">GitLab</v-btn>
    </v-layout>
    <v-layout>
      <v-btn color="primary" href="https://www.tu-chemnitz.de/main/">MAIN-Webseite</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["nodestatus", "queuestatus"])
  }
};
</script>

<style scoped>
</style>
