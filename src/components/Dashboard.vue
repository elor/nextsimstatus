<template>
  <v-container fluid>
    <v-card class="mb-3">
      <v-card-title>
        <v-btn to="/nodes">Nodes</v-btn>
        <v-btn to="/jobs">{{jobstatus.length}} Jobs</v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <grid-card title="Core Allocation">
            <cores-pie-chart height="180" hidelegend></cores-pie-chart>
          </grid-card>

          <grid-card title="Partitions">
            <div class="mb-3 mt-3" v-if="!partitionstatus || partitionstatus.length === 0">
              Couldn't load node partitions from SLURM
            </div>
            <div class="mb-3" v-for="partition in partitionstatus" :key="partition.PartitionName">
              <v-progress-circular
                slot="icon"
                :value="100*partition.CPUAlloc/partition.CPUTot"
                :color="partition.CPUAlloc == partition.CPUTot ? 'light-blue' : 'green'"
              >
                <b>
                  <router-link to="/nodes">{{partition.PartitionName}}</router-link>
                </b>
              </v-progress-circular>
              <node-load v-for="node in partition.Nodes" :key="node.NodeName" :node="node"></node-load>
            </div>
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
        <v-btn to="/simpcs">SimPCs</v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex lg3 md4 sm6 xs12 v-for="user in users_sorted" :key="user.UserName">
            <v-hover v-slot:default="{ hover }">
              <v-card
                class="ma-1 pa-1"
                height="70"
                :to="`/users/${user.UserName}`"
                :elevation="hover ? 8 : 2"
                v-ripple
              >
                <v-layout>
                  <v-flex xs4>
                    <user-chip :login="user.UserName" />
                  </v-flex>

                  <v-flex xs4>
                    <div>{{user.NumCPUs}} Cores</div>
                  </v-flex>

                  <v-flex xs4 v-if="user.PCs.length">
                    SimPC:
                    <router-link
                      v-for="pc in user.PCs"
                      :key="pc.hostname"
                      :to="`/simpc${pc.number}`">
                      <v-progress-circular
                        :value="100 * (pc.load_1min || 0.0) / pc.cores"
                        :color="pc.load_1min > pc.cores ? 'red' : 'green'"
                      >
                        {{pc.number}}
                      </v-progress-circular>
                    </router-link>
                  </v-flex>
                </v-layout>
                <div v-if="user.Jobs.length">
                  Jobs:
                  <span
                    v-for="[key, value] in Object.entries(user.JobCount).filter(a => a[1])"
                    :key="key"
                    class="mx-2"
                  >
                    <v-icon color="warning" v-if="key=='Failed'">fa-exclamation-triangle</v-icon>
                    {{value}}
                    {{key}}
                  </span>
                </div>
                <i v-else>Keine Jobs</i>
              </v-card>
            </v-hover>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-text>
        <router-link
          v-for="pc in simpcstatus"
          :key="pc.hostname"
          :to="pc.hostname">
          <v-progress-circular
            :value="100 * (pc.load_1min || 0.0) / pc.cores"
            :color="pc.load_1min > pc.cores ? 'red' : 'green'"
          >
            {{pc.number}}
          </v-progress-circular>
        </router-link>
      </v-card-text>
    </v-card>

    <v-card class="mb-3">
      <v-card-title>
        <v-btn to="/apps">Software</v-btn>
      </v-card-title>
      <v-card-text>
        <Software></Software>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Software from '@/components/Software'
import GridCard from '@/components/GridCard'
import CoresPieChart from '@/components/CoresPieChart'
import Rack from '@/components/Rack'
import NodeLoad from '@/components/NodeLoad'
import UserChip from '@/components/UserChip'

export default {
  components: {
    Software,
    GridCard,
    CoresPieChart,
    Rack,
    NodeLoad,
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
    users_sorted() {
      return this.userstatus
        .slice()
        .map(user => {
          return {
            ...user,
            PCs: user.PCs.filter(pc => !pc.inactive)
          }
        })
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
