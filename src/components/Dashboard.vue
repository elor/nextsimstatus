<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-btn to="/nodes">Nodes</v-btn>Overview
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <grid-card height="250" title="Core Allocation">
            <cores-pie-chart height="180" hidelegend></cores-pie-chart>
          </grid-card>

          <grid-card title="Partitions">
            <div class="mb-2" v-for="partition in partitionstatus" :key="partition.PartitionName">
              <v-progress-circular slot="icon" :value="100*partition.CPUAlloc/partition.CPUTot" :color="partition.CPUAlloc == partition.CPUTot ? 'light-blue' : 'green'">
                <b>
                  <router-link to="/nodes">{{partition.PartitionName}}</router-link>
                </b>
              </v-progress-circular>
              <v-progress-circular v-for="node in partition.Nodes" :key="node.NodeName" :value="100*node.CPUAlloc/node.CPUTot"
                :color="nodecolor(node)">
                <router-link :to="`/${node.NodeName}`">{{node.NodeName.replace(/\D/g,'')}}</router-link>
              </v-progress-circular>
            </div>
          </grid-card>

          <grid-card height="250" title="Racks">
            <rack v-for="rack in rackstatus" :key="rack.name" :rack="rack"></rack>
            <p v-if="rackstatus.length == 0">
              <v-progress-circular indeterminate color="light-blue"></v-progress-circular>
            </p>
          </grid-card>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>
        <v-btn to="/jobs">Jobs</v-btn>Overview
      </v-card-title>
      <v-card-text>{{jobstatus.length}} Jobs</v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-btn to="/users">Users</v-btn>Overview
      </v-card-title>
      <v-card-text>
        <p class="xs-6" v-for="user in users_sorted" :key="user.UserName">
          <router-link :to="`/users/${user.UserName}`">
            <v-chip class="ma-0" label small :style="{'background-color':user.color}"></v-chip>
          </router-link>
          <router-link :to="`/users/${user.UserName}`">{{user.UserName}}</router-link>
          :
          {{user.JobCount.Running}} running,
          {{user.JobCount.Pending}} pending,
          {{user.JobCount.Completed}} completed,
          {{user.JobCount.Other}} other,
          {{user.NumCPUs}} Cores
        </p>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-btn to="/simpcs">SimPCs</v-btn>Overview
      </v-card-title>
      <v-card-text>
        <v-progress-circular v-for="pc in simpcstatus" :key="pc.htname" :value="pc.load_1min !== undefined ? (10 + 90 * pc.load_1min / 5.0) : 0.0"
          :color="pc.load_1min > 5.0 ? 'red' : 'green'">
          <router-link :to="`/simpc${pc.number}`">{{pc.number}}</router-link>
        </v-progress-circular>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import GridCard from '@/components/GridCard'
import CoresPieChart from '@/components/CoresPieChart'
import Rack from '@/components/Rack'
import nodecolor from '../utils/nodecolor'

export default {
  components: {
    GridCard,
    CoresPieChart,
    Rack
  },
  computed: {
    ...mapGetters([
      'partitionstatus',
      'jobstatus',
      'userstatus',
      'simpcstatus',
      'rackstatus'
    ]),
    users_sorted () {
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
  methods: {
    nodecolor
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
      })
    })
  }
}
</script>
