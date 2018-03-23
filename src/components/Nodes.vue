<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field append-icon="search"
                      label="Search"
                      single-line
                      hide-details
                      v-model="search"></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers"
                    :items="fullNodes"
                    :search="search"
                    hide-actions>
        <template slot="items" slot-scope="props">
          <td>{{props.item.NodeName}}</td>
          <td>
            <v-progress-circular :value="100*props.item.CPUAlloc/props.item.CPUTot"
                                 :color="props.item.CPUAlloc == props.item.CPUTot ? 'light-blue' : 'green'" >
            {{props.item.CPUAlloc}}
            </v-progress-circular>
          </td>
          <td>{{props.item.jobs.join(' ')}}</td>
          <td>{{props.item.users.join(' ')}}</td>
          <td>
            <v-progress-circular :value="100*props.item.CPULoad"
                                 :color="props.item.CPULoad > 0.9 ? 'light-blue' : 'green'">
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
  import { mapState } from "vuex";

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
            text: "CPU",
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
      ...mapState(["nodes"]),
      }
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
        return warnstates.includes(state);
      },
      isFailState(state) {
        return failstates.includes(state);
      },
      jobs(nodeName) {
        return nodeName === "sim02" ? ["12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "12345", "97531"] : [];
      },
      users(jobs) {
        return jobs.map(job => "e.lorenz").sort().filter((value, index, users) => users[index + 1] !== value);
      }
    }
  };
</script>

<style scoped>
</style>
