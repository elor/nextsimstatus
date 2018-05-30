<template>
  <v-container fluid>
    <v-btn color="primary" to="apps/periodyctionary">Periodyctionary</v-btn>
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
