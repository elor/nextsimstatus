<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>User {{username}}</h2>
      </v-card-title>

      <v-card-text>
        <pre v-if="User">{{ User }}</pre>
        <span v-else>Noch aktuellen Daten verfügbar</span>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userstatus"]),
    username() {
      return this.$route.params.id;
    },
    User() {
      return this.userstatus.filter(user => user.UserName === this.username)[0];
    }
  }
};
</script>
