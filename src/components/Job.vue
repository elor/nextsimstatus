<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>{{title}}</h2>
        <v-spacer></v-spacer>
        <job-action-block v-if="Job" :jobs="[Job]"/>
        <v-spacer></v-spacer>
        <source-view v-if="Job" :title="title" :value="Job"></source-view>
      </v-card-title>

      <v-card-text>
        <pre v-if="Job">{{Job}}</pre>
        <span v-else>Keine Daten gefunden</span>
      </v-card-text>
    </v-card>

    <JobList v-if="SubJobs.length" :title="`${SubJobs.length} Array Jobs`" :items="SubJobs"></JobList>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import JobList from '@/components/JobList'
import SourceView from '@/components/SourceView'
import JobActionBlock from '@/components/JobActionBlock'

export default {
  components: {
    JobList,
    SourceView,
    JobActionBlock
  },
  computed: {
    ...mapGetters(['jobstatus']),
    JobId () {
      return Number(this.$route.params.id)
    },
    Job () {
      return this.jobstatus.filter(job => Number(job.JobId) === this.JobId)[0]
    },
    SubJobs () {
      return this.jobstatus.filter(
        job => Number(job.ArrayJobId) === this.JobId
      )
    },
    title () {
      return `Job #${this.JobId}${this.Job ? `: ${this.Job.JobName}` : ''}`
    }
  }
}
</script>
