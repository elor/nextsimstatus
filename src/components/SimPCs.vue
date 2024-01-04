<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-flex xs="12" md="4">
            <v-btn-toggle v-model="visibility" mandatory>
              <v-btn>all</v-btn>
              <v-btn>recent</v-btn>
              <v-btn>current</v-btn>
              <v-btn>login</v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs="12" md="8">
            <v-text-field append-icon="fa-search" label="Search" single-line hide-details v-model="search"></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-data-table :headers="headers" :items="simpcstatus" :search="search" hide-default-footer :items-per-page="-1">
        <template v-slot:item="props">
          <tr :class="{ 'grey--text': props.item.inactive }" v-if="visible(props.item)">
            <td>
              <router-link :class="{ 'grey--text': props.item.inactive }"
                :to="`/simpc${props.item.number}`">{{ props.item.hostname }}</router-link>
              <v-tooltip v-if="!props.item.inactive && props.item.mounts.length < 2" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="ml-1" color="error">fa-hdd</v-icon>
                </template>
                <span>Missing Mounts</span>
              </v-tooltip>
              <v-tooltip v-if="props.item.vpn" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="ml-1">fa-lock</v-icon>
                </template>
                <span>VPN running</span>
              </v-tooltip>
              <v-tooltip v-if="props.item.rebootrequired" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="ml-1" color="warning">fa-power-off</v-icon>
                </template>
                <span>Reboot Required</span>
              </v-tooltip>
            </td>
            <td>
              <span v-for="user in props.item.usernames" :key="user">
                <user-chip :login="user" :disabled="props.item.inactive"></user-chip>
                <br />
              </span>
            </td>
            <td>
              <cpu-load :load="props.item.load_1min" :cores="props.item.cores" precise></cpu-load>
              <cpu-load :load="props.item.load_5min" :cores="props.item.cores" precise></cpu-load>
              <cpu-load :load="props.item.load_15min" :cores="props.item.cores" precise></cpu-load>
              <v-tooltip v-if="props.item.load_1min > 5.0" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small color="warning">fa-burn</v-icon>
                </template>
                <span>High CPU Load</span>
              </v-tooltip>
              <v-tooltip v-if="props.item.load_1min > 10.0" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small color="error">fa-fire-extinguisher</v-icon>
                </template>
                <span>Excessive CPU Load. Did a Core lock up, e.g. due to BeeGFS/NFS Failure?</span>
              </v-tooltip>
            </td>
            <td>
              <duration :seconds="props.item.uptime" since />
              <v-tooltip v-if="props.item.uptime > FIVE_DAYS" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small color="warning">fa-hourglass-end</v-icon>
                </template>
                <span>Long uptime. Please reboot</span>
              </v-tooltip>
            </td>
            <td>
              <duration :seconds="props.item.lastupdate" since />
            </td>
            <td>
              {{ props.item.updates === undefined ? '???' : props.item.updates }}
              <v-tooltip v-if="props.item.updates > 10" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small color="warning">fa-exclamation-triangle</v-icon>
                </template>
                <span>Too many pending updates. Please update.</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from '../utils/time.js'
import CpuLoad from '@/components/CpuLoad'
import UserChip from '@/components/UserChip'
import Duration from '@/components/Duration'

export default {
  components: {
    CpuLoad,
    UserChip,
    Duration
  },
  data () {
    const VIS = {
      all: 0,
      recent: 1,
      current: 2,
      login: 3
    }

    return {
      headers: [
        { text: 'Name', value: 'hostname' },
        { text: 'Users', value: 'users' },
        { text: 'Load', value: 'load' },
        { text: 'Uptime', value: 'uptime' },
        { text: 'Heartbeat', value: 'lastupdate' },
        { text: 'Updates', value: 'updates' }
      ],
      search: '',
      tabledata: this.simpcstatus,
      FIVE_DAYS: 5 * 86400,
      VIS,
      visibility: VIS.all
    }
  },
  computed: {
    ...mapGetters(['simpcstatus'])
  },
  methods: {
    format,
    visible (pc) {
      switch (this.visibility) {
        case this.VIS.all:
          return true
        case this.VIS.recent:
          return !!pc.datetime
        case this.VIS.current:
          return !!pc.datetime && !pc.inactive
        case this.VIS.login:
          return !pc.inactive && pc.usernames.length > 0
        default:
          return true
      }
    }
  },
  created () {
    this.tabledata = this.simpcstatus
  }
}
</script>
