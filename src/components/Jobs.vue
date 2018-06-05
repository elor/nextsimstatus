<template>
  <v-container fluid>
    <JobList :title="`${jobstatus.length} Jobs`"
             :items="jobstatus">
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
    ...mapGetters(["jobstatus"])
  }
};
</script>
