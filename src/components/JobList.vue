<template>
  <v-card>
    <v-card-title>
      {{title}}
      <v-spacer></v-spacer>
      <v-flex xs="12" md="6">
        <v-text-field append-icon="search"
                      label="Search"
                      single-line
                      hide-details
                      v-model="search"></v-text-field>
      </v-flex>
    </v-card-title>
    <v-data-table :headers="headers"
                  :items="items"
                  :search="search"
                  :rows-per-page-items="[15,50,100, {text:'All', value:-1}]"
                  disable-initial-sort>
      <template slot="items" slot-scope="props">
        <td><router-link :to="`/jobs/${props.item.JobId}`">{{props.item.JobId}}</router-link></td>
        <td><router-link :to="`/users/${props.item.UserName}`">{{props.item.UserName}}</router-link></td>
        <td>{{props.item.ArrayTaskId}}</td>
        <td>{{props.item.JobName}}</td>
        <td>{{capitalize(props.item.JobState)}}</td>
        <td>
          <span v-for="node in props.item.NodeNames" :key="node">
            <router-link :to="`/${node}`">{{node}}</router-link>
            &nbsp;
          </span>
        </td>
        <td>{{props.item.NumCPUs}}</td>
        <td>{{props.item.RunTime}}</td>
        <td>
          <time :datetime="props.item.StartTime === 'Unknown' ? props.item.SubmitTime : props.item.StartTime">
            {{(props.item.StartTime === "Unknown" ? props.item.SubmitTime : props.item.StartTime).replace("T", " ")}}
          </time>
        </td>
      </template>
      <template slot="no-data">
        There are no jobs here.
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { capitalize } from '../utils/capitalize'

export default {
  props: ['items', 'title'],
  data () {
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
      search: ''
    }
  },
  methods: {
    capitalize
  }
}
</script>
