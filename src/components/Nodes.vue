<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-flex xs="12" md="6" lg="4">
            <node-action-block :node="selected_nodenames" />
          </v-flex>

          <v-flex xs="12" md="6" lg="4">
            <NodeList />
          </v-flex>

          <v-flex xs="12" md="6" lg="4">
            <v-text-field
              append-icon="fa-search"
              label="Search"
              single-line
              hide-details
              :value="searchterm"
              @input="search"
            />
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="nodestatus"
        item-key="NodeName"
        :search="searchterm"
        hide-default-footer
        :items-per-page="-1"
        :show-select="is_admin"
        v-model="selected"
      >
        <template v-slot:item.NodeName="props">
          <router-link :to="`/${props.item.NodeName}`">{{props.item.NodeName}}</router-link>
        </template>

        <template v-slot:item.CPUAlloc="props">
          <v-progress-circular
            :value="100*props.item.CPUAlloc/props.item.CPUTot"
            :color="props.item.CPUAlloc == props.item.CPUTot ? 'light-blue' : 'green'"
          >{{props.item.CPUAlloc}}</v-progress-circular>
        </template>

        <template v-slot:item.jobs="props">
          <span v-for="job in props.item.pureJobs" :key="job.JobId">
            <JobChip :job="job" />
          </span>
          <span v-for="array in props.item.jobArrays" :key="array.JobId">
            <JobChip :job="array" />
          </span>
        </template>

        <template v-slot:item.users="props">
          <UserChip v-for="user in props.item.users" :key="user" :login="user" />
        </template>

        <template v-slot:item.CPULoad="props">
          <cpu-load :load="Number(props.item.CPULoad)" :cores="Number(props.item.CPUTot)"></cpu-load>
          <v-progress-circular
            :value="100*(1 - props.item.FreeMem/props.item.RealMemory)"
            :color="props.item.FreeMem < 0.1*props.item.RealMemory ? 'red' : 'light-blue'"
          >{{Math.ceil((props.item.RealMemory-props.item.FreeMem)/1000)}}</v-progress-circular>
        </template>

        <template v-slot:item.State="props">
          <span v-for="state in props.item.States" :key="state">
            <v-icon color="warning" v-if="isWarningState(state)" small>fa-exclamation-triangle</v-icon>
            <v-icon color="error" v-if="isFailState(state)">fa-skull-crossbones</v-icon>
            {{capitalize(state)}}
            <span v-if="!props.item.State.endsWith(state)">&nbsp;</span>
          </span>
        </template>

        <template v-slot:item.BootTime="props">
          <duration :iso="props.item.BootTime" since />
        </template>

      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NodeList from '@/components/NodeList'
import CpuLoad from '@/components/CpuLoad'
import { capitalize } from '../utils/capitalize'
import UserChip from '@/components/UserChip'
import JobChip from '@/components/JobChip'
import NodeActionBlock from '@/components/NodeActionBlock'
import Duration from '@/components/Duration'

import { warnstates, failstates } from '../utils/nodeStates'

export default {
  components: {
    NodeList,
    CpuLoad,
    UserChip,
    JobChip,
    NodeActionBlock,
    Duration
  },
  data() {
    return {
      headers: [
        {
          text: 'Node',
          align: 'left',
          sortable: true,
          value: 'NodeName'
        },
        {
          text: 'Usage',
          align: 'left',
          sortable: true,
          value: 'CPUAlloc'
        },
        {
          text: 'Jobs',
          align: 'left',
          sortable: false,
          value: 'jobs'
        },
        {
          text: 'Users',
          align: 'left',
          sortable: false,
          value: 'users'
        },
        {
          text: 'CPU/Mem',
          align: 'left',
          sortable: true,
          value: 'CPULoad'
        },
        {
          text: 'Partitions',
          align: 'left',
          sortable: true,
          value: 'Partitions'
        },
        {
          text: 'State',
          align: 'left',
          sortable: true,
          value: 'State'
        },
        {
          text: 'BootTime',
          align: 'left',
          sortable: true,
          value: 'BootTime'
        }
      ],
      selected: []
    }
  },
  computed: {
    ...mapGetters(['nodestatus', 'is_admin']),
    selected_nodenames() {
      return this.selected.map(node => node.NodeName).join(',')
    },
    searchterm() {
      return this.$route.params.search || ''
    }
  },
  methods: {
    capitalize,
    isWarningState(state) {
      return warnstates.includes(state)
    },
    isFailState(state) {
      return failstates.includes(state)
    },
    search(term) {
      console.log(arguments)

      if (term === this.searchterm) {
        return
      }

      if (!term) {
        this.$router.push('/nodes')
      } else if (!this.searchterm) {
        this.$router.push(`/nodes/${term}`)
      } else {
        this.$router.replace(`/nodes/${term}`)
      }
    }
  }
}
</script>
