<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout wrap>
          <v-spacer></v-spacer>
          <v-flex xs="12" md="6">
            <v-text-field
              append-icon="fa-search"
              label="Search"
              single-line
              hide-details
              v-model="search"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table :headers="headers" :items="userstatus" :search="search" :items-per-page="-1" hide-default-footer>

        <template v-slot:item.UserName="props">
          <user-chip :login="props.item.UserName" />
        </template>

        <template v-slot:item.PCNames="props">
          <span v-for="pc in props.item.PCs" :key="pc.number">
            <router-link
              :class="{'grey--text':pc.inactive}"
              :to="`/simpc${pc.number}`"
            >{{pc.hostname}}</router-link>&nbsp;
          </span>
        </template>

        <template v-slot:item.JobCount.Running="props">
          <router-link :to="`/users/${props.item.UserName}`">{{props.item.JobCount.Running}}</router-link>
        </template>

        <template v-slot:item.NodeNames="props">
          <node-load v-for="node in nodes(props.item)" :key="node.NodeName" :node="node"></node-load>
        </template>

        <template v-slot:item.JobCount.Other="props">
          <router-link :to="`/users/${props.item.UserName}`">{{props.item.JobCount.Other}}</router-link>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NodeLoad from '@/components/NodeLoad'
import UserChip from '@/components/UserChip'

export default {
  components: {
    NodeLoad,
    UserChip
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
  methods: {
    nodes (user) {
      return this.nodestatus.filter(node => node.users.includes(user.UserName))
    }
  }
}
</script>
