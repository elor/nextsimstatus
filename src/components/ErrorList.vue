<template>
  <v-list>
    <template v-for="error in errors">
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title v-text="error.message"></v-list-tile-title>
          <v-list-tile-sub-title v-text="error.date.toLocaleString()"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </template>
    <v-list-tile>
      <v-list-tile-sub-title class="text-xs-center">
        {{errors.length}} errors captured
      </v-list-tile-sub-title>
    </v-list-tile>
  </v-list>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    data() {
      return {
      };
    },
    computed: {
      ...mapState(["errors"])
    }
  };
</script>
