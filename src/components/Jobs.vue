<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        {{jobstatus.length}} Jobs
        <v-spacer></v-spacer>
        <v-flex xs="12" md="6">
          <v-text-field append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                        v-model="search"></v-text-field>
        </v-flex>
      </v-card-title>
      <v-data-table :headers="headers"
                    :items="jobstatus"
                    :search="search"
                    hide-actions
                    disable-initial-sort>
        <template slot="items" slot-scope="props">
          <td><router-link :to="`/jobs`">{{props.item.JobId}}</router-link></td>
          <td><router-link :to="`/users`">{{props.item.UserName}}</router-link></td>
          <td>{{props.item.JobName}}</td>
          <td>{{capitalize(props.item.JobState)}}</td>
          <td>
            <span v-for="node in props.item.NodeNames" :key="node">
              <router-link :to="`/nodes`">{{node}}</router-link>
              &nbsp;
            </span>
          </td>
          <td>{{props.item.NumCPUs}}</td>
          <td>{{props.item.StartTime}}</td>
          <td><span v-if="props.item.JobState !== 'FINISHING'">{{props.item.EndTime}}</span></td>
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
            text: "JobID",
            align: "left",
            sortable: true,
            value: "JobId"
          },
          {
            text: "User",
            align: "left",
            sortable: true,
            value: "UserName"
          },
          {
            text: "Name",
            align: "left",
            sortable: true,
            value: "JobName"
          },
          {
            text: "State",
            align: "left",
            sortable: true,
            value: "JobState"
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
            text: "Start",
            align: "left",
            sortable: true,
            value: "StartTime"
          },
          {
            text: "End",
            align: "left",
            sortable: true,
            value: "EndTime"
          }
        ],
        search: ""
      };
    },
    computed: {
      ...mapGetters(["jobstatus"])
    },
    methods: {
      capitalize(word) {
        switch (word.length) {
          case 0:
            return "";
          case 1:
            return word.toUpperCase();
          default:
            return `${word[0].toUpperCase() + word.slice(1).toLowerCase()}`;
        }
      }
    }
  };
</script>

<style scoped>
</style>
