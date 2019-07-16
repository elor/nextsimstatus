<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-flex xs="12" md="4">
            <v-radio-group v-model="visibility">
              <v-layout row wrap>
                <v-radio label="all" value="all" />
                <v-radio label="recent" value="recent" />
                <v-radio label="current" value="current" />
                <v-radio label="login" value="login" />
              </v-layout>
            </v-radio-group>
          </v-flex>
          <v-flex xs="12" md="8">
            <v-text-field
              append-icon="fa-search"
              label="Search"
              single-line
              hide-details
              v-model="search"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table :headers="headers" :items="simpcstatus" :search="search" hide-actions>
        <tr
          slot="items"
          slot-scope="props"
          :class="{'grey--text':props.item.inactive}"
          v-if="visible(props.item)"
        >
          <td>
            <router-link
              :class="{'grey--text':props.item.inactive}"
              :to="`/simpc${props.item.number}`"
            >{{props.item.hostname}}</router-link>
            <v-tooltip v-if="!props.item.inactive && props.item.mounts.length < 2" bottom>
              <v-icon small class="ml-1" color="error" slot="activator">fa-hdd</v-icon>
              <span>Missing Mounts</span>
            </v-tooltip>
            <v-tooltip v-if="props.item.vpn" bottom>
              <v-icon small class="ml-1" slot="activator">fa-lock</v-icon>
              <span>VPN running</span>
            </v-tooltip>
            <v-tooltip v-if="props.item.rebootrequired" bottom>
              <v-icon small class="ml-1" color="warning" slot="activator">fa-power-off</v-icon>
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
              <v-icon color="warning" slot="activator">fa-burn</v-icon>
              <span>High CPU Load</span>
            </v-tooltip>
            <v-tooltip v-if="props.item.load_1min > 10.0" bottom>
              <v-icon color="error" slot="activator">fa-fire-extinguisher</v-icon>
              <span>Excessive CPU Load. Did a Core lock up, e.g. due to BeeGFS/NFS Failure?</span>
            </v-tooltip>
          </td>
          <td>
            {{format(props.item.uptime)}}
            <v-tooltip v-if="props.item.uptime > FIVE_DAYS" bottom>
              <v-icon color="warning" slot="activator">fa-hourglass-end</v-icon>
              <span>Long uptime. Please reboot</span>
            </v-tooltip>
          </td>
          <td>{{format(props.item.lastupdate)}}</td>
          <td>
            {{props.item.updates === undefined ? '???' : props.item.updates}}
            <v-tooltip v-if="props.item.updates > 10" bottom>
              <v-icon color="warning" slot="activator">fa-exclamation-triangle</v-icon>
              <span>Too many pending updates. Please update.</span>
            </v-tooltip>
          </td>
        </tr>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from '../utils/time.js'
import CpuLoad from '@/components/CpuLoad'
import UserChip from '@/components/UserChip'

export default {
  components: {
    CpuLoad,
    UserChip
  },
  data () {
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
      visibility: 'recent',
      tabledata: this.simpcstatus,
      FIVE_DAYS: 5 * 86400
    }
  },
  computed: {
    ...mapGetters(['simpcstatus'])
  },
  methods: {
    format,
    visible (pc) {
      switch (this.visibility) {
        case 'all':
          return true
        case 'recent':
          return !!pc.datetime
        case 'current':
          return !!pc.datetime && !pc.inactive
        case 'login':
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
