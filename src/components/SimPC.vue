<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>SimPC{{number}}</h2>
        <v-spacer></v-spacer>
        <source-view v-if="SimPC" :title="`SimPC${number}`" :value="SimPC"></source-view>
      </v-card-title>

      <v-card-text>
        <v-layout v-if="SimPC" row wrap>
          <grid-card title="CPU/RAM">
            <template slot="icon">
              <cpu-load precise :load="SimPC.load_1min" :cores="SimPC.cores" />
              <cpu-load precise :load="SimPC.load_5min" :cores="SimPC.cores" />
              <cpu-load precise :load="SimPC.load_15min" :cores="SimPC.cores" />
            </template>
            <a href="https://en.wikipedia.org/wiki/Load_(computing)">Load</a>
            1min:
            {{SimPC.load_1min}} ({{percent_1min}}%)
            <br />
            <a href="https://en.wikipedia.org/wiki/Load_(computing)">Load</a>
            5min:
            {{SimPC.load_5min}} ({{percent_5min}}%)
            <br />
            <a href="https://en.wikipedia.org/wiki/Load_(computing)">Load</a>
            15min:
            {{SimPC.load_15min}} ({{percent_15min}}%)
            <br />
          </grid-card>

          <grid-card title="Users">
            <user-chip v-for="user in SimPC.usernames" :key="user" :login="user" />
          </grid-card>

          <grid-card title="Devices">
            <b>Mounts:</b>
            <br />
            <div v-for="mount in SimPC.mounts" :key="mount.mount">
              <v-tooltip right>
                <template v-slot:activator="{on}">
                  <span v-on="on">{{mount.mount}}</span>
                </template>
                <span>{{mount.type}}@{{mount.source}}</span>
              </v-tooltip>
            </div>
            <b>{{SimPC.printers ? SimPC.printers.length : 'Keine'}} Drucker</b>
          </grid-card>

          <grid-card :title="`Ubuntu ${SimPC.release}`">
            <v-icon slot="icon" v-if="SimPC.isoldrelease" color="warning">fa-exclamation-triangle</v-icon>
            <div>
              Updates:
              <v-tooltip v-if="SimPC.updates > 10" bottom>
                <v-icon color="warning" slot="activator">fa-exclamation-triangle</v-icon>
                <span>Reboot Required</span>
              </v-tooltip>
              <span v-if="SimPC.updates">{{SimPC.updates}} available</span>
              <span v-else>up-to-date</span>
              <v-tooltip v-if="SimPC.rebootrequired" bottom>
                <v-icon color="warning" slot="activator">fa-fire</v-icon>
                <span>Reboot Required</span>
              </v-tooltip>
            </div>
            <div>
              Uptime:
              <duration :seconds="SimPC.uptime" since />
            </div>
            <div>
              Heartbeat:
              <v-icon v-if="SimPC.inactive" color="warning">fa-exclamation-triangle</v-icon>
              <duration :seconds="SimPC.lastupdate" since />
            </div>
            VPN: {{SimPC.vpn ? 'ACTIVE' : 'off'}}
            <div v-if="is_admin && SimPC.mac">MAC: {{SimPC.mac}}</div>
          </grid-card>
        </v-layout>
        <span v-else>Keine Daten empfangen</span>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import SourceView from '@/components/SourceView'
import GridCard from '@/components/GridCard'
import UserChip from '@/components/UserChip'
import CpuLoad from '@/components/CpuLoad'
import Duration from '@/components/Duration'
import { format } from '@/utils/time'

export default {
  components: {
    SourceView,
    GridCard,
    UserChip,
    CpuLoad,
    Duration
  },
  computed: {
    ...mapGetters(['simpcstatus', 'is_admin']),
    number () {
      return Number(this.$route.params.id)
    },
    SimPC () {
      return this.simpcstatus.filter(simpc => simpc.number === this.number)[0]
    },
    percent_1min () {
      return Math.ceil((100 * this.SimPC.load_1min) / this.SimPC.cores)
    },
    percent_5min () {
      return Math.ceil((100 * this.SimPC.load_5min) / this.SimPC.cores)
    },
    percent_15min () {
      return Math.ceil((100 * this.SimPC.load_15min) / this.SimPC.cores)
    }
  },
  methods: {
    format
  }
}
</script>
