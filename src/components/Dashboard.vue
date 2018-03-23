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
        headers: [
          { text: "Name", value: "name" },
          { text: "Usage", value: "usage" },
          { text: "Status", value: "state" },
          { text: "Queue", value: "properties" }
        ],
        search: "",
        tabledata: this.nodestatus
      };
    },
    computed: {
      ...mapGetters(["nodestatus", "queuestatus"])
    }
  };
</script>

<style scoped>
</style>
