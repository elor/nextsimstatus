<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>SimPC{{number}}</h2>
      </v-card-title>

      <v-card-text>
        <pre v-if="SimPC">{{ SimPC }}</pre>
        <span v-else>Noch keine Daten empfangen</span>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["simpcstatus"]),
    number() {
      return Number(this.$route.params.id);
    },
    SimPC() {
      return this.simpcstatus.filter(simpc => simpc.number === this.number)[0];
    }
  }
};
</script>
