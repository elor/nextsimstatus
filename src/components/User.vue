<template>
  <v-container grid-list-xl fluid>
    <v-card>
      <v-card-title>
        <h2>User {{username}}</h2>
      </v-card-title>

      <v-card-text>
        <v-layout row wrap v-if="User">
          <grid-card title="User">
            {{User.UserName}}
          </grid-card>
          
          <grid-card title="Job Stats">
            <p>
            {{User.JobCount.Running}} Running,
            {{User.JobCount.Pending}} Pending,
            {{User.JobCount.Completed}} Completed,
            {{User.JobCount.Other}} Other
            </p>
            <p>
            {{User.NumCPUs}} Cores
            </p>
          </grid-card>
          
          <grid-card title="Nodes">
            <template v-if="User.NodeNames.length">
              <span v-for="node in User.NodeNames" :key="node">
                <router-link :to="`/${node}`">{{node}}</router-link>
                &nbsp;
              </span>
            </template>
            <template v-else>Keine reservierten Knoten</template>
          </grid-card>

          <grid-card title="SimPCs">
            <span v-for="pc in User.PCs" :key="pc.number">
              <router-link :class="{'grey--text':pc.inactive}" :to="`/simpc${pc.number}`">{{pc.hostname}}</router-link>
              &nbsp;
            </span>
          </grid-card>
        </v-layout>
        <span v-else>Keine Daten verfügbar</span>
      </v-card-text>
    </v-card>

    <JobList v-if="User" :title="`${User.Jobs.length} Jobs`"
             :items="User.Jobs">
    </JobList>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import GridCard from "@/components/GridCard";
import JobList from "@/components/JobList";

export default {
  components: {
    JobList,
    GridCard
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
    }
  }
};
</script>
