<template>
  <v-container fluid>
    <v-alert type="info" value="true">
      This page is still under development.
      <br />
      Thank you for your patience.
    </v-alert>
  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    data() {
      return {
      };
    },
    computed: {
      ...mapGetters(["nodestatus", "queuestatus"])
    }
  };
</script>

<style scoped>
</style>
