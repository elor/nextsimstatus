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
        <tr slot="items"
            slot-scope="props"
            :class="{'grey--text':props.item.inactive}"
            >
          <td>
            <router-link :to="`/simpc/${props.item.hostname}`">{{props.item.hostname}}</router-link>
          </td>
          <td>{{props.item.release}}</td>
          <td>
            <span v-for="user in props.item.usernames" :key="user">
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
          <td>{{props.item.uptime}}</td>
          <td>{{props.item.datetime}}</td>
        </tr>
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
        { text: "Name", value: "hostname" },
        { text: "Release", value: "release" },
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
    ...mapGetters(["simpcstatus"])
  },
  created() {
    this.tabledata = this.simpcstatus;
  }
};
</script>
