<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-spacer></v-spacer>
          <v-flex xs="12" md="6">
            <v-text-field append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                          v-model="search"></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table :headers="headers"
                    :items="userstatus"
                    :search="search"
                    hide-actions>
        <template slot="items" slot-scope="props">
          <td><router-link :to="`/users/${props.item.UserName}`">{{props.item.UserName}}</router-link></td>
          <td>
            <span v-for="pc in props.item.PCs" :key="pc.number">
              <router-link :class="{'grey--text':pc.inactive}" :to="`/simpc${pc.number}`">{{pc.hostname}}</router-link>
              &nbsp;
            </span>
          </td>
          <td><router-link :to="`/users/${props.item.UserName}`">{{props.item.JobCount.Running}}</router-link></td>
          <td>{{props.item.NumCPUs}}</td>
          <td>
            <node-load v-for="node in nodes(props.item)" :key="node.NodeName" :node="node"></node-load>
          </td>
          <td><router-link :to="`/users/${props.item.UserName}`">{{props.item.JobCount.Other}}</router-link></td>
        </template>
      </v-data-table>
    </v-card>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NodeLoad from '@/components/NodeLoad'

export default {
  components: {
    NodeLoad
  },
  data () {
    return {
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'UserName'
        },
        {
          text: 'PCs',
          align: 'left',
          sortable: true,
          value: 'PCNames'
        },
        {
          text: 'Running',
          align: 'left',
          sortable: true,
          value: 'JobCount.Running'
        },
        {
          text: 'Cores',
          align: 'left',
          sortable: true,
          value: 'NumCPUs'
        },
        {
          text: 'Nodes',
          align: 'left',
          sortable: true,
          value: 'NodeNames'
        },
        {
          text: 'Other Jobs',
          align: 'left',
          sortable: true,
          value: 'JobCount.Other'
        }
      ],
      search: ''
    }
  },
  computed: {
    ...mapGetters(['userstatus', 'nodestatus'])
  },
  methods:{
    nodes(user){
      return this.nodestatus.filter(node => node.users.includes(user.UserName))
    }
  }
}
</script>
