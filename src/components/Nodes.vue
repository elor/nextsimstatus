<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          </v-flex>
          <v-flex xs="12" md="6" lg="4">
            <node-action-block :node="selected_nodenames"></node-action-block>
          </v-flex>

          <v-flex xs="12" md="6" lg="4">
            <NodeList />
          </v-flex>

          <v-flex xs="12" md="6" lg="4">
            <v-text-field
              append-icon="search"
              label="Search"
              single-line
              hide-details
              v-model="search"
            />
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table :headers="headers"
        :items="nodestatus"
        item-key="NodeName"
        :search="search"
        hide-actions
        :select-all="is_admin"
        v-model="selected">
        <template v-slot:items="props">
          <tr @click="props.selected = !props.selected" :active="props.selected">
            <td v-if="is_admin">
              <v-checkbox
                :input-value="props.selected"
                primary
                hide-details
              />
            </td>
            <td>
              <router-link :to="`/${props.item.NodeName}`">{{props.item.NodeName}}</router-link>
            </td>
            <td>
              <v-progress-circular
                :value="100*props.item.CPUAlloc/props.item.CPUTot"
                :color="props.item.CPUAlloc == props.item.CPUTot ? 'light-blue' : 'green'"
              >{{props.item.CPUAlloc}}</v-progress-circular>
            </td>
            <td>
              <span v-for="job in props.item.pureJobs" :key="job.JobId">
                <job-chip :job="job"/>
              </span>
              <span v-for="array in props.item.jobArrays" :key="array.JobId">
                <job-chip :job="array"/>
              </span>
            </td>
            <td>
              <user-chip v-for="user in props.item.users" :key="user" :login="user"/>
            </td>
            <td>
              <cpu-load :load="Number(props.item.CPULoad)" :cores="Number(props.item.CPUTot)"></cpu-load>
              <v-progress-circular
                :value="100*(1 - props.item.FreeMem/props.item.RealMemory)"
                :color="props.item.FreeMem < 0.1*props.item.RealMemory ? 'red' : 'light-blue'"
              ></v-progress-circular>
            </td>
            <td>{{props.item.Partitions}}</td>
            <td>
              <span v-for="state in props.item.States" :key="state">
                <v-icon color="warning" v-if="isWarningState(state)">warning</v-icon>
                <v-icon color="error" v-if="isFailState(state)">error</v-icon>
                {{capitalize(state)}}
                <span v-if="!props.item.State.endsWith(state)">&nbsp;</span>
              </span>
            </td>
            <td>{{props.item.BootTime}}</td>
          </tr>
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

import { warnstates, failstates } from '../utils/nodeStates'

export default {
  components: {
    NodeList,
    CpuLoad,
    UserChip,
    JobChip,
    NodeActionBlock
  },
  data () {
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
      search: '',
      selected: []
    }
  },
  computed: {
    ...mapGetters(['nodestatus', 'is_admin']),
    selected_nodenames () {
      return this.selected.map(node => node.NodeName).join(',')
    }
  },
  methods: {
    capitalize,
    isWarningState (state) {
      return warnstates.includes(state)
    },
    isFailState (state) {
      return failstates.includes(state)
    }
  }
}
</script>
