<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
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
                    :items="simpcstatus"
                    :search="search"
                    hide-actions>
        <template slot="items" slot-scope="props">
          <td>
            <router-link :to="`/simpc/${props.item.hostname}`">{{props.item.hostname}}</router-link>
          </td>
          <td>{{props.item.uptime}}</td>
          <td>
            <span v-for="user in props.item.users" :key="user">
              {{user}}
              <br>
            </span>
          </td>
          <td>
            <div v-if="props.item.mounts">
            <span v-for="mount in props.item.mounts" :key="mount.mount">
              {{mount.mount}} ({{mount.type}})
              <br>
            </span>
            </div>
          </td>
          <td>
            {{props.item.datetime}}
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      headers: [
        { text: "Name", value: "hostname" },
        { text: "Users", value: "users" },
        { text: "Mounts", value: "mounts" },
        { text: "Uptime", value: "uptime" },
        { text: "Last Update", value: "datetime" }
      ],
      search: "",
      tabledata: this.simpcstatus
    };
  },
  computed: {
    ...mapState(["simpcs"]),
    simpcstatus() {
      return Object.values(this.simpcs);
    }
  },
  created() {
    this.tabledata = this.simpcstatus;
  }
};
</script>
