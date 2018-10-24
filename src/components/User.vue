<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>User {{username}}</h2>
      </v-card-title>

      <v-card-text>
        <pre v-if="User_short">{{ User_short }}</pre>
        <span v-else>Noch aktuellen Daten verfügbar</span>
      </v-card-text>
    </v-card>

    <JobList v-if="User" :title="`${User.Jobs.length} Jobs`"
             :items="User.Jobs">
    </JobList>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import JobList from "@/components/JobList";
import { cloneDeep } from "lodash";

export default {
  components: {
    JobList
  },
  computed: {
    ...mapGetters(["userstatus"]),
    username() {
      return this.$route.params.id;
    },
    User() {
      return this.userstatus.filter(
        user => user.UserName === this.username || user.UserID === this.username
      )[0];
    },
    User_short() {
      if (!this.User) {
        return undefined;
      }
      const User = cloneDeep(this.User);
      delete User.PCs;
      delete User.Jobs;
      delete User.RunningJobs;
      delete User.OtherJobs;
      delete User.RunningArrays;
      delete User.RunningPureJobs;
      delete User.OtherArrays;
      delete User.OtherPureJobs;
      return User;
    },
    Jobs() {
      return this.User.Jobs;
    }
  }
};
</script>
