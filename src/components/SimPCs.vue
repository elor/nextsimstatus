<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-flex xs="12" md="4">
            <v-radio-group v-model="visibility">
              <v-layout row wrap>
                <v-radio label="all" value="all"/>
                <v-radio label="recent" value="recent"/>
                <v-radio label="current" value="current"/>
                <v-radio label="login" value="login"/>
              </v-layout>
            </v-radio-group>
          </v-flex>
          <v-flex xs="12" md="8">
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
            v-if="visible(props.item)"
            >
          <td>
            <router-link :to="`/simpc${props.item.number}`">{{props.item.hostname}}</router-link>
          </td>
          <td>
            <span v-for="user in props.item.usernames" :key="user">
              {{user}}
              <br>
            </span>
          </td>
          <td>
            {{props.item.load_1min}}
            <v-tooltip v-if="props.item.load_1min > 5.0" bottom>
              <v-icon color="warning" slot="activator">warning</v-icon>
              <v-text>High CPU Load</v-text>
            </v-tooltip>
            <v-tooltip v-if="props.item.load_1min > 10.0" bottom>
              <v-icon color="error" slot="activator">error</v-icon>
              <v-text>Excessive CPU Load. Did a Core lock up, e.g. due to BeeGFS/NFS Failure?</v-text>
            </v-tooltip>
          </td>
          <td>
            {{props.item.release}}
            <v-tooltip v-if="props.item.isoldrelease" bottom>
              <v-icon slot="activator" color="warning">warning</v-icon>
              <v-text>Deprecated OS version. Please upgrade</v-text>
            </v-tooltip>
          </td>
          <td>
            {{format(props.item.lastupdate)}}
          </td>
          <td>
            {{format(props.item.uptime)}}
            <v-tooltip v-if="props.item.uptime > FIVE_DAYS" bottom>
              <v-icon color="warning" slot="activator">warning</v-icon>
              <v-text>Long uptime. Please reboot</v-text>
            </v-tooltip>
          </td>
        </tr>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { format } from "../utils/time.js";

export default {
  data() {
    return {
      headers: [
        { text: "Name", value: "hostname" },
        { text: "Users", value: "users" },
        { text: "Load", value: "load" },
        { text: "Release", value: "release" },
        { text: "Heartbeat", value: "lastupdate" },
        { text: "Uptime", value: "uptime" }
      ],
      search: "",
      visibility: "recent",
      tabledata: this.simpcstatus,
      FIVE_DAYS: 5 * 86400
    };
  },
  computed: {
    ...mapGetters(["simpcstatus"])
  },
  methods: {
    format,
    visible(pc) {
      switch (this.visibility) {
        case "all":
          return true;
        case "recent":
          return !!pc.datetime;
        case "current":
          return !!pc.datetime && !pc.inactive;
        case "login":
          return !pc.inactive && pc.usernames.length > 0;
        default:
          return true;
      }
    }
  },
  created() {
    this.tabledata = this.simpcstatus;
  }
};
</script>
