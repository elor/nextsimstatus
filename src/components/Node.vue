<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>Node {{NodeName}}</h2>
      </v-card-title>

      <v-card-text>
        <pre v-if="NodeShort">{{ NodeShort }}</pre>
        <span v-else>Keine Daten empfangen</span>
      </v-card-text>
    </v-card>

    <JobList :title="`${Jobs.length} Jobs`"
             :items="Jobs">
    </JobList>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import JobList from "@/components/JobList";

export default {
  components: {
    JobList
  },
  computed: {
    ...mapGetters(["nodestatus"]),
    NodeName() {
      return this.$route.params.id;
    },
    Node() {
      return this.nodestatus.filter(node => node.NodeName === this.NodeName)[0];
    },
    NodeShort() {
      let node = { ...this.Node };

      delete node.jobs;
      delete node.pureJobs;
      delete node.jobArrays;

      return node;
    },
    Jobs() {
      return this.Node.jobs || [];
    }
  }
};
</script>
