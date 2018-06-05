<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-spacer></v-spacer>
          <v-flex xs="12" md="6">
            <v-text-field append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                          v-model="search"></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table :headers="headers"
                    :items="userstatus"
                    :search="search"
                    hide-actions>
        <template slot="items" slot-scope="props">
          <td><router-link :to="`/users`">{{props.item.UserName}}</router-link></td>
          <td>
            <span v-for="job in props.item.RunningPureJobs" :key="job.JobId">
              <router-link :to="`/jobs/${job.JobId}`">{{job.JobId}}</router-link>
              &nbsp;
            </span>
            <span v-for="array in props.item.RunningArrays" :key="array.JobId">
              {{array.jobs.length}}x&nbsp;<router-link :to="`/jobs/${array.ArrayJobId}`">{{array.ArrayJobId}}</router-link>
              &nbsp;
            </span>
          </td>
          <td>
            <span v-for="node in props.item.NodeNames" :key="node">
              <router-link :to="`/nodes`">{{node}}</router-link>
              &nbsp;
            </span>
          </td>
          <td>{{props.item.NumCPUs}}</td>
          <td>
            <span v-for="job in props.item.OtherPureJobs" :key="job.JobId">
              <router-link :to="`/jobs/${job.JobId}`">{{job.JobId}}</router-link>
              &nbsp;
            </span>
            <span v-for="array in props.item.OtherArrays" :key="array.JobId">
              {{array.jobs.length}}x&nbsp;<router-link :to="`/jobs/${array.ArrayJobId}`">{{array.ArrayJobId}}</router-link>
              &nbsp;
            </span>
          </td>
        </template>
      </v-data-table>
    </v-card>

  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    data() {
      return {
        headers: [
          {
            text: "Name",
            align: "left",
            sortable: true,
            value: "UserName"
          },
          {
            text: "Running",
            align: "left",
            sortable: true,
            value: "RunningJobs"
          },
          {
            text: "Nodes",
            align: "left",
            sortable: true,
            value: "NodeNames"
          },
          {
            text: "Cores",
            align: "left",
            sortable: true,
            value: "NumCPUs"
          },
          {
            text: "Other Jobs",
            align: "left",
            sortable: true,
            value: "Jobs"
          }
        ],
        search: ""
      };
    },
    computed: {
      ...mapGetters(["userstatus"])
    }
  };
</script>
