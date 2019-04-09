<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>User {{username}}</h2>
        <v-spacer></v-spacer>
        <source-view v-if="User" :title="`User ${username}`" :value="User"></source-view>
      </v-card-title>

      <v-card-text>
        <v-layout row wrap v-if="User">
          <grid-card title="User">
            {{User.UserName}}
          </grid-card>

          <grid-card title="Job Stats">
            <p>
              <span v-for="[key, value] in Object.entries(User.JobCount).filter(a => a[1])" :key="key" class="mx-2">
                {{value}} {{key}}
              </span>
            </p>
            <p>
            {{User.NumCPUs}} Cores
            </p>
          </grid-card>

          <grid-card title="Nodes">
            <template v-if="User.NodeNames.length">
              <node-load v-for="node in nodes" :key="node.NodeName" :node="node"></node-load>
            </template>
            <template v-else>Keine reservierten Knoten</template>
          </grid-card>

          <grid-card title="SimPCs">
            <span v-for="pc in User.PCs" :key="pc.number">
              <router-link :class="{'grey--text':pc.inactive}" :to="`/simpc${pc.number}`">{{pc.hostname}}</router-link>
              &nbsp;
            </span>
          </grid-card>
        </v-layout>
        <span v-else>Keine Daten verfügbar</span>
      </v-card-text>
    </v-card>

    <JobList v-if="User" :title="`${User.Jobs.length} Jobs`"
             :items="User.Jobs">
    </JobList>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import GridCard from '@/components/GridCard'
import JobList from '@/components/JobList'
import SourceView from '@/components/SourceView'
import NodeLoad from '@/components/NodeLoad'

export default {
  components: {
    JobList,
    GridCard,
    SourceView,
    NodeLoad
  },
  computed: {
    ...mapGetters(['userstatus', 'nodestatus']),
    username () {
      return this.$route.params.id
    },
    User () {
      return this.userstatus.filter(
        user => user.UserName === this.username || user.UserID === this.username
      )[0]
    },
    nodes () {
      return this.nodestatus.filter(node => node.users.includes(this.User.UserName))
    }
  }
}
</script>
