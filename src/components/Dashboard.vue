<template>
  <v-container fluid>
    <v-card>
      <v-card-title><v-btn to="/nodes">Nodes</v-btn> Overview</v-card-title>
      <v-card-text v-for="partition in partitionstatus" :key="partition.PartitionName">
        <v-progress-circular :value="100*partition.CPUAlloc/partition.CPUTot"
                             :color="partition.CPUAlloc == partition.CPUTot ? 'light-blue' : 'green'">
          <b><router-link to="/nodes">{{partition.PartitionName}}</router-link></b>
        </v-progress-circular>
        &nbsp;
        <v-progress-circular v-for="node in partition.Nodes" :key="node.NodeName"
                             :value="100*node.CPUAlloc/node.CPUTot"
                             :color="node.CPUAlloc == node.CPUTot ? 'light-blue' : 'green'">
          <router-link to="/nodes">{{node.NodeName.replace(/\D/g,'')}}</router-link>
        </v-progress-circular>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title><v-btn to="/jobs">Jobs</v-btn> Overview</v-card-title>
      <v-card-text>{{jobstatus.length}} Jobs</v-card-text>
    </v-card>

    <v-card>
      <v-card-title><v-btn to="/users">Users</v-btn> Overview</v-card-title>
      <v-card-text v-for="user in userstatus" :key="user.UserName">
        {{user.UserName}}: {{user.RunningJobs.length}} running, {{user.OtherJobs.length}} pending or completed, {{user.NumCPUs}} Cores
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["partitionstatus", "jobstatus", "userstatus"])
  }
};
</script>
