<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <h2>{{ title }}</h2>
        <v-spacer></v-spacer>
        <job-action-block v-if="Job" :jobs="[Job]" />
        <v-spacer></v-spacer>
        <source-view v-if="Job && can_control" :title="title" :value="Job"></source-view>
      </v-card-title>

      <v-card-text>
        <v-layout v-if="Job" row wrap>
          <grid-card :title="`Job (${Job.Partition} Partition)`">
            <user-chip :login="Job.UserName" slot="icon" />
            <div>State: {{ Job.JobState }}</div>
            <div>Reason: {{ Job.Reason }}</div>
            <div>
              Cores: {{ Job.NumCPUs }}
              <span class="ml-2" v-if="SubJobs && SubJobs.length">(currently {{ SubJobCores }} in JobArray)</span>
            </div>
            <div v-if="Job.Dependency && Job.Dependency !== '(null)'">{{ Job.Dependency }}</div>
            <div v-if="Job.Gres && Job.Gres !== '(null)'">{{ Job.Gres }}</div>
            <div v-if="Job.Features && Job.Features !== '(null)'">{{ Job.Features }}</div>
            <div v-if="Job.ArrayJobId">
              <span class="mr-2" v-if="Job === ParentJob">{{ SubJobs.length }} Children</span>
              <span v-else>
                Parent:
                <job-chip :job="ParentJob" />
              </span>
              <span v-if="Job.ArrayTaskId">(Task {{ Job.ArrayTaskId }})</span>
            </div>
            <div v-else></div>
          </grid-card>

          <grid-card title="Nodes">
            <template v-if="BatchHostNode" slot="icon">
              <v-subheader>BatchHost:</v-subheader>
              <node-load :node="BatchHostNode" class="text-body-2 text-no-wrap"></node-load>
            </template>
            <div v-if="Job.NodeNames">
              <node-load v-for="node in nodes" :key="node.NodeName" :node="node"></node-load>
            </div>
            <div v-if="SubNodeNames && SubNodeNames.length">
              <b>SubJobs:</b>
              <br />
              <node-load v-for="node in subnodes" :key="node.NodeName" :node="node"></node-load>
            </div>
          </grid-card>

          <grid-card title="Script">
            <div v-if="can_control">
              <div>ExitCode: {{ Job.ExitCode }}</div>
              <div class="long-path">WorkDir: {{ sanitizePath(Job.WorkDir) }}</div>
              <div class="long-path">Command: {{ sanitizePath(Job.Command, `${Job.WorkDir}/`) }}</div>
            </div>
            <div v-else>
              Melde dich an, um deinen Jobscript, sein Verzeichnis und seinen ExitCode zu sehen.
            </div>
          </grid-card>

          <grid-card title="Time">
            <div v-for="time in times" :key="time">
              <span v-if="isValidTime(Job[time])">
                {{ time }}:
                <duration :iso="Job[time]" :since="time !== 'TimeLimit'" />
              </span>
            </div>
          </grid-card>
        </v-layout>
        <p v-else>Keine Daten</p>
      </v-card-text>

      <v-card-text>
        <job-log :job="Job"></job-log>
      </v-card-text>
    </v-card>

    <JobList v-if="SubJobs.length" :title="`${SubJobs.length} Array Jobs`" :items="SubJobs"></JobList>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { uniq, flatten, sum } from 'lodash'
import JobList from '@/components/JobList'
import SourceView from '@/components/SourceView'
import JobActionBlock from '@/components/JobActionBlock'
import GridCard from '@/components/GridCard'
import UserChip from '@/components/UserChip'
import JobChip from '@/components/JobChip'
import JobLog from '@/components/JobLog'
import NodeLoad from '@/components/NodeLoad'
import Duration from '@/components/Duration'

export default {
  components: {
    JobList,
    JobLog,
    SourceView,
    JobActionBlock,
    GridCard,
    UserChip,
    JobChip,
    NodeLoad,
    Duration
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['jobstatus', 'nodestatus', 'is_admin']),
    owner() {
      return this.Job && this.Job.UserName
    },
    can_control() {
      return this.is_admin || (this.user && this.owner === this.user.login)
    },
    JobId() {
      return Number(this.$route.params.id)
    },
    Job() {
      return this.jobstatus.filter(job => Number(job.JobId) === this.JobId)[0]
    },
    SubJobs() {
      return this.jobstatus.filter(
        job => Number(job.ArrayJobId) === this.JobId
      )
    },
    SubJobCores() {
      return sum(this.SubJobs.map(job => job.NumCPUs))
    },
    ParentJob() {
      return this.jobstatus.filter(job => job.JobId === this.Job.ArrayJobId)[0]
    },
    title() {
      return `Job #${this.JobId}${this.Job ? `: ${this.Job.JobName}` : ''}`
    },
    SubNodeNames() {
      return uniq(flatten(this.SubJobs.map(job => job.NodeNames)))
    },
    BatchHostNode() {
      return this.nodestatus.filter(node => this.Job.BatchHost === node.NodeName)[0]
    },
    nodes() {
      return this.nodestatus.filter(node => this.Job.NodeNames.includes(node.NodeName))
    },
    subnodes() {
      return this.nodestatus.filter(node => this.SubNodeNames.includes(node.NodeName))
    },
    times() {
      return Object.keys(this.Job).filter(key => key.endsWith('Time') || key.startsWith('Time')).sort()
    }
  },
  methods: {
    sanitizePath(path, root = '') {
      if (!path) {
        return root || 'undefined'
      }
      if (path.startsWith(root)) {
        path = path.substr(root.length)
      }
      const homeusers = '/home/'
      if (path.startsWith(homeusers)) {
        path = `~${path.substr(homeusers.length)}`
      }
      const tildeuser = `~${this.Job.UserName}/`
      if (path.startsWith(tildeuser)) {
        path = `~/${path.substr(tildeuser.length)}`
      }
      return path
    },
    isValidTime(time) {
      return time && time !== 'Unknown' && time !== '00:00:00'
    }
  }
}
</script>

<style scoped>
.long-path {
  word-wrap: break-word;
}
</style>
