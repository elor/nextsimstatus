<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-flex xs="12" md="6">
            <NodeList></NodeList>
          </v-flex>
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
                    :items="nodestatus"
                    :search="search"
                    hide-actions>
        <template slot="items" slot-scope="props">
          <td>
            <router-link :to="`/nodes`">{{props.item.NodeName}}</router-link>
          </td>
          <td>
            <v-progress-circular :value="100*props.item.CPUAlloc/props.item.CPUTot"
                                 :color="props.item.CPUAlloc == props.item.CPUTot ? 'light-blue' : 'green'">
              {{props.item.CPUAlloc}}
            </v-progress-circular>
          </td>
          <td>
            <span v-for="job in props.item.jobs" :key="job.JobId">
              <router-link :to="`/jobs`">{{job.JobId}}</router-link>
              &nbsp;
            </span>
          </td>
          <td>
            <span v-for="user in props.item.users" :key="user">
              <router-link :to="`/users`">{{user}}</router-link>
              &nbsp;
            </span>
          </td>
          <td>
            <v-progress-circular :value="100*props.item.CPULoad/props.item.CPUTot"
                                 :color="props.item.CPULoad > 0.9*props.item.CPUTot ? 'light-blue' : 'green'">
            </v-progress-circular>
            <v-progress-circular :value="100*(1 - props.item.FreeMem/props.item.RealMemory)"
                                 :color="props.item.FreeMem < 0.1*props.item.RealMemory ? 'red' : 'light-blue'">
            </v-progress-circular>
          </td>
          <td>{{props.item.Partitions}}</td>
          <td>
            {{capitalize(props.item.State)}}
            <v-icon color="warning" v-if="isWarningState(props.item.State)">warning</v-icon>
            <v-icon color="error" v-if="isFailState(props.item.State)">error</v-icon>
          </td>
          <td>{{props.item.BootTime}}</td>
        </template>
      </v-data-table>
    </v-card>

  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";
  import NodeList from "./NodeList";

  const warnstates = ["NoResp", "DRAIN", "FAILING", "MAINT", "POWER_UP"];
  const failstates = ["DOWN", "ERROR", "FAIL", "POWER_DOWN"];

  export default {
    data() {
      return {
        headers: [
          {
            text: "Node",
            align: "left",
            sortable: true,
            value: "NodeName"
          },
          {
            text: "Usage",
            align: "left",
            sortable: true,
            value: "CPUAlloc"
          },
          {
            text: "Jobs",
            align: "left",
            sortable: false,
            value: "jobs"
          },
          {
            text: "Users",
            align: "left",
            sortable: false,
            value: "users"
          },
          {
            text: "CPU/Mem",
            align: "left",
            sortable: true,
            value: "CPULoad"
          },
          {
            text: "Partitions",
            align: "left",
            sortable: true,
            value: "Partitions"
          },
          {
            text: "State",
            align: "left",
            sortable: true,
            value: "State"
          },
          {
            text: "BootTime",
            align: "left",
            sortable: true,
            value: "BootTime"
          }
        ],
        search: ""
      };
    },
    computed: {
      ...mapGetters(["nodestatus"])
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
      },
      isWarningState(state) {
        return warnstates.includes(state) || warnstates.map(state => `${state}*`).includes(state);
      },
      isFailState(state) {
        return failstates.includes(state) || failstates.map(state => `${state}*`).includes(state);
      }
    },
    components: {
      NodeList
    }
  };
</script>

<style scoped>
</style>
