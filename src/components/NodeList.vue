<template>
  <v-container fluid>
    <v-alert type="info" value="true">
      This whole page is still under development.
      <br />
      Please report unexpected errors to Erik E. Lorenz.
      <br />
      Thank you!
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
