<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>Node {{NodeName}}</h2>
        <v-spacer></v-spacer>
        <node-action-block :node="NodeName" />
        <v-spacer></v-spacer>
        <source-view v-if="Node" :title="`Node ${NodeName}`" :value="Node"></source-view>
      </v-card-title>

      <v-card-text>
        <v-layout v-if="Node" row wrap>
          <grid-card title="CPU/RAM">
            <template slot="icon">
              <v-progress-circular
                :value="100*Node.CPUAlloc/Node.CPUTot"
                :color="Node.CPUAlloc == Node.CPUTot ? 'light-blue' : 'green'"
                class="text-body-2 text-no-wrap"
              >{{Node.CPUAlloc}}</v-progress-circular>
              <cpu-load :load="Number(Node.CPULoad)" :cores="Number(Node.CPUTot)" class="text-body-2 text-no-wrap"></cpu-load>
              <v-progress-circular
                :value="MemPercent"
                :color="MemPercent > 90 ? 'red' : 'light-blue'"
                class="text-body-2 text-no-wrap"
              >{{MemGig}}</v-progress-circular>
              <v-progress-circular
                v-for="gres in Gres"
                :key="gres.ressource"
                :value="gres.percent"
                color="light-blue"
                class="text-body-2 text-no-wrap"
              >{{gres.jobs}}/{{gres.total}}</v-progress-circular>
            </template>
            {{Node.CPUAlloc}} / {{Node.CPUTot}} allocated
            <span
              v-if="Node.CPUErr != 0"
            >({{Node.CPUErr}} Err)</span>
            <span
              v-for="gres in Gres"
              :key="gres.ressource"
            >, {{gres.ressource}}: {{gres.jobs}}/{{gres.total}}</span>
            <br />
            <a href="https://en.wikipedia.org/wiki/Load_(computing)">Load</a>
            : {{Node.CPULoad}} ({{CPULoadPercent}}%)
            <br />
            RAM: {{MemGig}}/{{Node.RealMemory / 1000}} GB ({{MemPercent}}%)
          </grid-card>

          <grid-card title="Users">
            <span v-for="user in Node.users" :key="user">
              <user-chip :login="user" />
            </span>
          </grid-card>

          <grid-card :title="`SLURM ${Node.Version || ''}`">
            Partitions: {{Node.Partitions}}
            <br />
            State: {{Node.States.join(", ")}}
            <br />
            <span>
              Reason: {{Node.Reason}}
              <br />
            </span>
            Ressources: {{Node.Gres}}
          </grid-card>

          <grid-card title="Host">
            Boot Time:
            <duration :iso="Node.BootTime" since />
            <br />Slurmd Start:
            <duration :iso="Node.SlurmdStartTime" since />
          </grid-card>
        </v-layout>
        <span v-else>Keine Daten empfangen</span>
      </v-card-text>
    </v-card>

    <JobList v-if="Node" :title="`${Jobs.length} Jobs`" :items="Jobs"></JobList>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import JobList from '@/components/JobList'
import GridCard from '@/components/GridCard'
import SourceView from '@/components/SourceView'
import CpuLoad from '@/components/CpuLoad'
import UserChip from '@/components/UserChip'
import NodeActionBlock from '@/components/NodeActionBlock'
import Duration from '@/components/Duration'
import { uniq, concat } from 'lodash'

function deGres(Gres) {
  const [type, count] = Gres.split(':')
  return { [type]: Number(count) }
}

export default {
  components: {
    JobList,
    GridCard,
    SourceView,
    CpuLoad,
    NodeActionBlock,
    UserChip,
    Duration
  },
  computed: {
    ...mapGetters(['nodestatus', 'is_admin']),
    NodeName() {
      return this.$route.params.id
    },
    Node() {
      return this.nodestatus.filter(node => node.NodeName === this.NodeName)[0]
    },
    Gres() {
      if (!this.Node.Gres || this.Node.Gres === '(null)') {
        return undefined
      }

      const nodeGres = deGres(this.Node.Gres)
      const jobGres = this.Jobs.filter(job => job.Gres)
        .map(job => job.Gres)
        .map(deGres)
        .reduce((a, b) => {
          for (const key in b) {
            a[key] = b[key] + (a[key] || 0)
          }
          return a
        }, {})

      const allKeys = uniq(concat(Object.keys(nodeGres), Object.keys(jobGres)))

      if (!allKeys) {
        return undefined
      }

      return allKeys
        .map(key => ({
          jobs: jobGres[key] || 0,
          total: nodeGres[key] || 0,
          ressource: key
        }))
        .map(gres => ({
          ...gres,
          percent: Math.round((100 * gres.jobs) / (gres.total || 1))
        }))
    },
    MemPercent() {
      return 100 - Math.round((100 * this.Node.FreeMem) / this.Node.RealMemory)
    },
    MemGig() {
      return Math.ceil((this.Node.RealMemory - this.Node.FreeMem) / 1000)
    },
    CPULoadPercent() {
      return Math.round((100 * this.Node.CPULoad) / this.Node.CPUTot)
    },
    Jobs() {
      return this.Node.jobs || []
    }
  }
}
</script>
