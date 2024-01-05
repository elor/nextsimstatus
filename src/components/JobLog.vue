<template>
  <div>
    <v-expansion-panels v-model="logpanels" v-if="can_control" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Output<span v-if="logs && logs.StdOutFile">: {{logs.StdOutFile}}</span>
          <template v-slot:actions>
            <v-progress-circular
              size="20"
              width="2"
              v-if="refreshing"
              indeterminate
              color="primary"
            />
            <v-icon color="info">fa-file-alt</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-flex lg1 md2 sm3 xs4 style="float: right">
            <v-subheader>
              <v-select
                label="Lines"
                :items="[20, 50, 200, 1000, { text: 'All', value: 987654321 }]"
                v-model="lines"
                @change="fetch"
              ></v-select>
            </v-subheader>
          </v-flex>
          <pre>{{StdOut}}</pre>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel :disabled="logs && logs.StdOutFile == logs.StdErrFile">
        <v-expansion-panel-header>
          Error Output<span v-if="logs && logs.StdErrFile">: {{logs.StdErrFile}}</span>
          <template v-slot:actions>
            <v-progress-circular
              size="20"
              width="2"
              v-if="refreshing"
              indeterminate
              color="primary"
            />
            <v-icon color="error">fa-exclamation</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-flex lg1 md2 sm3 xs4 style="float: right">
            <v-subheader>
              <v-select
                label="Lines"
                :items="[20, 50, 200, 1000, { text: 'All', value: 987654321 }]"
                v-model="lines"
                @change="fetch"
              ></v-select>
            </v-subheader>
          </v-flex>
          <pre>{{StdErr}}</pre>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          JobScript: {{job ? sanitizePath(job.Command) : 'Retrieving...'}}
          <template v-slot:actions>
            <v-icon color="info">fa-scroll</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <pre @click="fetchScript">{{JobScript || 'Retrieving...'}}</pre>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <div v-else>
      Melde dich an, um deine Logs zu sehen:
      <login-menu light></login-menu>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import LoginMenu from '@/components/LoginMenu'

export default {
  props: {
    job: Object
  },
  components: {
    LoginMenu
  },
  data() {
    return {
      interval: undefined,
      lines: 20,
      refreshing: false,
      logpanels: [0]
    }
  },
  computed: {
    ...mapState(['user', 'joblogs', 'jobscripts']),
    ...mapGetters(['is_admin']),
    jobid() {
      return this.job && this.job.JobId
    },
    owner() {
      return this.job && this.job.UserName
    },
    can_control() {
      return this.is_admin || (this.user && this.owner === this.user.login)
    },
    logs() {
      return this.joblogs.filter(logs => logs.JobId === this.jobid)[0]
    },
    JobScript() {
      const job = this.jobscripts.filter(jobscript => jobscript.JobId === this.jobid)[0]
      return job && job.JobScript
    },
    StdOut() {
      return this.logs ? this.logs.StdOut : 'Retrieving logs...'
    },
    StdErr() {
      return this.logs ? this.logs.StdErr : 'Retrieving logs...'
    }
  },
  watch: {
    job(after, before) {
      if (!before && after) {
        this.fetch()
      }
    },
    can_control(after, before) {
      if (!before && after) {
        this.fetch()
      }
    },
    logs() {
      this.refreshing = false
    }
  },
  methods: {
    ...mapActions(['controlLogs', 'controlJobScript']),
    sanitizePath(path, root = '') {
      if (!path) {
        return root || 'undefined'
      }
      if (path.startsWith(root)) {
        path = path.substr(root.length)
      }
      const beegfshomeusers = '/beegfs-home/users/'
      if (path.startsWith(beegfshomeusers)) {
        path = `~${path.substr(beegfshomeusers.length)}`
      }

      return path
    },
    fetchLogs() {
      if (!this.job) {
        return
      }
      if (!this.can_control) {
        console.log('cannot control')
        return
      }

      this.refreshing = true
      this.controlLogs({ jobs: [this.jobid], lines: this.lines })
    },
    fetchScript() {
      if (!this.job) {
        return
      }
      if (!this.can_control) {
        console.log('cannot control')
        return
      }

      this.controlJobScript({ jobs: [this.jobid], lines: this.lines })
    },
    fetch() {
      this.fetchLogs()

      if (!this.JobScript) {
        this.fetchScript()
      }
    }
  },
  mounted() {
    this.fetch()
    this.interval = window.setInterval(() => this.fetch(), 5000)
  },
  beforeDestroy() {
    window.clearInterval(this.interval)
  }
}
</script>
