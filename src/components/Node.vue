<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>Node {{NodeName}}{{Node ? `: ${Node.NodeName}` : ''}}</h2>
      </v-card-title>

      <v-card-text>
        <pre v-if="Node">{{Node}}</pre>
        <span v-else>Noch keine Daten empfangen</span>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["nodestatus"]),
    NodeName() {
      return this.$route.params.id;
    },
    Node() {
      return this.nodestatus.filter(node => node.NodeName === this.NodeName)[0];
    }
  }
};
</script>
