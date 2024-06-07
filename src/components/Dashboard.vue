<template>
  <v-container fluid>
    <v-alert type="warning" dismissible v-if="motd">/etc/motd:<pre>{{ motd }}</pre></v-alert>

    <v-card class="mb-3">
      <v-card-title>
        <v-btn to="/nodes">Nodes</v-btn>
        <v-btn to="/jobs">{{ jobstatus.length }} Jobs</v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <grid-card title="Core Allocation">
            <cores-pie-chart height="200" hidelegend></cores-pie-chart>
          </grid-card>

          <grid-card title="Partitions">
            <div class="mb-3 mt-3" v-if="!partitionstatus || partitionstatus.length === 0">
              Couldn't load node partitions from SLURM
            </div>
            <div class="mb-3 mr-3" v-for="partition in partitionstatus" :key="partition.PartitionName"
              style="float:left">
              <v-progress-circular slot="icon" :value="100 * partition.CPUAlloc / partition.CPUTot"
                :color="partition.CPUAlloc == partition.CPUTot ? 'light-blue' : 'green'">
                <b>{{ partition.PartitionName }}</b>
              </v-progress-circular>
              <node-load v-for="node in partition.Nodes" :key="node.NodeName" :node="node"></node-load>
            </div>
            <div style="clear:both"></div>
          </grid-card>

          <grid-card title="Racks">
            <rack v-for="rack in rackstatus" :key="rack.name" :rack="rack"></rack>
            <p v-if="rackstatus.length == 0">
              <v-progress-circular indeterminate color="light-blue"></v-progress-circular>
            </p>
          </grid-card>
        </v-layout>
      </v-card-text>
    </v-card>

    <v-card class="mb-3">
      <v-card-title>
        <v-btn to="/users">Users</v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex lg3 md4 sm6 xs12 v-for="user in users_sorted" :key="user.UserName">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-card class="ma-1 pa-1" height="70" :to="`/users/${user.UserName}`" v-ripple v-on="on">
                  <v-layout>
                    <v-flex xs4>
                      <user-chip :login="user.UserName" />
                    </v-flex>

                    <v-flex xs4>
                      <div>{{ user.NumCPUs }} Cores</div>
                    </v-flex>
                  </v-layout>
                  <div v-if="user.Jobs.length">
                    Jobs:
                    <span v-for="[key, value] in Object.entries(user.JobCount).filter(a => a[1])" :key="key"
                      class="mx-2">
                      <v-icon color="warning" v-if="key == 'Failed'">fa-exclamation-triangle</v-icon>
                      {{ value }}
                      {{ key }}
                    </span>
                  </div>
                  <i v-else>Keine Jobs</i>
                </v-card>
              </template>
              <span>{{ user.FullName }}</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

    <v-card class="mb-3">
      <v-card-title>
        <v-btn>Storage</v-btn>
      </v-card-title>
      <v-card-text>
        <QuotaPieChart height="240" :hidelegend="false" />
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import GridCard from '@/components/GridCard'
import CoresPieChart from '@/components/CoresPieChart'
import Rack from '@/components/Rack'
import NodeLoad from '@/components/NodeLoad'
import UserChip from '@/components/UserChip'
import QuotaPieChart from '@/components/QuotaPieChart'

export default {
  components: {
    GridCard,
    CoresPieChart,
    Rack,
    NodeLoad,
    QuotaPieChart,
    UserChip
  },
  computed: {
    ...mapGetters([
      'partitionstatus',
      'jobstatus',
      'userstatus',
      'simpcstatus',
      'rackstatus'
    ]),
    ...mapState(['motd']),
    users_sorted() {
      return this.userstatus
        .slice()
        .sort(
          (a, b) =>
            b.NumCPUs - a.NumCPUs ||
            b.JobCount.Running - a.JobCount.Running ||
            b.JobCount.Pending - a.JobCount.Pending ||
            a.UserName.localeCompare(b.UserName)
        )
    }
  },
  methods: {}
}
</script>
