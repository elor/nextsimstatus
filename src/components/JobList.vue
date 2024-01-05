<template>
  <v-card>
    <v-card-title>
      {{title}}
      <span v-if="can_select_anything">({{selected.length}} selected)</span>
      <v-spacer></v-spacer>

      <job-action-block :jobs="selected" />
      <v-spacer></v-spacer>
      <v-flex xs="12" md="6" lg="4">
        <v-text-field
          append-icon="fa-search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-flex>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="JobId"
      :search="search"
      :show-select="can_select_anything"
      v-model="selected"
    >
      <template v-slot:item.JobId="props">
        <job-chip :job="props.item" />
      </template>

      <template v-slot:item.UserName="props">
        <user-chip :login="props.item.UserName" />
      </template>

      <template v-slot:item.JobState="props">
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <span v-on="on">{{capitalize(props.item.JobState)}}</span>
          </template>
          Reason: {{props.item.Reason}}
        </v-tooltip>
      </template>

      <template v-slot:item.NodeNames="props">
        <span v-for="node in props.item.NodeNames" :key="node">
          <router-link :to="`/${node}`">{{node}}</router-link>&nbsp;
        </span>
      </template>

      <template v-slot:item.RunTime="props">
        <duration :iso="props.item.RunTime" since />
      </template>

      <template v-slot:item.StartTime="props">
        <duration :iso="props.item.StartTime === 'Unknown' ? props.item.SubmitTime : props.item.StartTime" since />
      </template>

      <template slot="no-data">There are no jobs here.</template>
    </v-data-table>
  </v-card>
</template>

<script>
import { capitalize } from '../utils/capitalize'
import UserChip from '@/components/UserChip'
import JobChip from '@/components/JobChip'
import JobActionBlock from '@/components/JobActionBlock'
import Duration from '@/components/Duration'
import { mapGetters, mapState } from 'vuex'

export default {
  props: ['items', 'title'],
  components: {
    UserChip,
    JobChip,
    JobActionBlock,
    Duration
  },
  data() {
    return {
      headers: [
        {
          text: 'JobID',
          align: 'left',
          sortable: true,
          value: 'JobId'
        },
        {
          text: 'User',
          align: 'left',
          sortable: true,
          value: 'UserName'
        },
        {
          text: 'ArrayTaskId',
          align: 'left',
          sortable: true,
          value: 'ArrayTaskId'
        },
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'JobName'
        },
        {
          text: 'State',
          align: 'left',
          sortable: true,
          value: 'JobState'
        },
        {
          text: 'Nodes',
          align: 'left',
          sortable: true,
          value: 'NodeNames'
        },
        {
          text: 'Cores',
          align: 'left',
          sortable: true,
          value: 'NumCPUs'
        },
        {
          text: 'Runtime',
          align: 'left',
          sortable: true,
          value: 'RunTime'
        },
        {
          text: 'Submit / Start',
          align: 'left',
          sortable: true,
          value: 'StartTime'
        }
      ],
      search: '',
      selected: []
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['logged_in', 'is_admin']),
    can_select_anything() {
      return this.items.some(this.can_select)
    }
  },
  methods: {
    capitalize,
    can_select(job) {
      return (
        this.is_admin || (this.logged_in && job.UserName === this.user.login)
      )
    }
  },
  watch: {
    selected() {
      const allowed = this.selected.filter(job => this.can_select(job))
      if (allowed.length !== this.selected.length) {
        this.selected = allowed
      }
    }
  }
}
</script>
