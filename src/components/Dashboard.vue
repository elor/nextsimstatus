<template>
  <v-container fluid>
    <v-alert type="info" value="true">
      Explore this page by opening the menu, or by jumping straight to <br />
      <v-btn to="/nodes">Nodes</v-btn>, <v-btn to="/jobs">Jobs</v-btn> or <v-btn to="/users">Users</v-btn>.
    </v-alert>

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
