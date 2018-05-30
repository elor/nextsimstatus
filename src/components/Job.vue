<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>Job #{{JobId}}{{Job ? `: ${Job.JobName}` : ''}}</h2>
      </v-card-title>

      <v-card-text>
        <pre v-if="Job">{{Job}}</pre>
        <span v-else>Keine Daten gefunden</span>
      </v-card-text>

    </v-card>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["jobstatus"]),
    JobId() {
      return this.$route.params.id;
    },
    Job() {
      return this.jobstatus.filter(job => job.JobId === this.JobId)[0];
    }
  }
};
</script>
