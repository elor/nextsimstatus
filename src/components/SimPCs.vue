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
            <router-link :to="`/simpc/${props.item.hostname}`">{{props.item.hostname}}</router-link>
          </td>
          <td>
            {{props.item.release}}
            <v-icon color="warning" v-if="props.item.isoldrelease">warning</v-icon>
          </td>
          <td>{{props.item.load_1min}}</td>
          <td>
            <span v-for="user in props.item.usernames" :key="user">
              {{user}}
              <br>
            </span>
          </td>
          <td>
            <div v-if="props.item.mounts">
            <span v-for="mount in props.item.mounts" :key="mount.mount">
              {{mount.mount}} ({{mount.source.replace(".etit.tu-chemnitz.de", "")}})
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
        { text: "Load", value: "load" },
        { text: "Users", value: "users" },
        { text: "Mounts", value: "mounts" },
        { text: "Uptime", value: "uptime" },
        { text: "Last Update", value: "datetime" }
      ],
      search: "",
      visibility: "recent",
      tabledata: this.simpcstatus
    };
  },
  computed: {
    ...mapGetters(["simpcstatus"])
  },
  methods: {
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
