<template>
  <div>
    <div v-if="can_control">
      <v-layout row wrap align-end>
        <v-subheader v-if="logs && logs.StdOutFile">StdOut: {{logs.StdOutFile}}</v-subheader>
        <v-subheader v-else>StdOut</v-subheader>
        <v-subheader>
          <v-scale-transition>
            <v-progress-circular
              size="20"
              width="2"
              v-if="refreshing"
              indeterminate
              color="primary"
            />
          </v-scale-transition>
        </v-subheader>
        <v-spacer></v-spacer>
        <v-flex md1 sm2 xs4>
          <v-subheader>
            <v-select
              label="Lines"
              :items="[20, 50, 200, 1000, { text: 'All', value: 987654321 }]"
              v-model="lines"
              @change="fetch"
            ></v-select>
          </v-subheader>
        </v-flex>
      </v-layout>
      <pre>{{StdOut}}</pre>
      <v-subheader v-if="logs && logs.StdErrFile">StdErr: {{logs.StdErrFile}}</v-subheader>
      <v-subheader v-else>StdErr</v-subheader>
      <pre>{{StdErr}}</pre>
      <v-subheader>JobScript: {{job ? sanitizePath(job.Command) : 'Retrieving...'}}</v-subheader>
      <pre @click="fetchScript">{{JobScript || 'Retrieving...'}}</pre>
    </div>
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
  data () {
    return {
      interval: undefined,
      lines: 20,
      refreshing: false
    }
  },
  computed: {
    ...mapState(['user', 'joblogs', 'jobscripts']),
    ...mapGetters(['is_admin']),
    jobid () {
      return this.job.JobId
    },
    owner () {
      return this.job.UserName
    },
    can_control () {
      return this.is_admin || (this.user && this.owner === this.user.login)
    },
    disabled () {
      return !this.jobs || !this.can_control
    },
    logs () {
      return this.joblogs.filter(logs => logs.JobId === this.jobid)[0]
    },
    JobScript () {
      const job = this.jobscripts.filter(jobscript => jobscript.JobId === this.jobid)[0]
      return job && job.JobScript
    },
    StdOut () {
      return this.logs ? this.logs.StdOut : 'Retrieving logs...'
    },
    StdErr () {
      return this.logs ? this.logs.StdErr : 'Retrieving logs...'
    }
  },
  watch: {
    job (after, before) {
      if (!before && after) {
        this.fetch()
      }
    },
    can_control (after, before) {
      if (!before && after) {
        this.fetch()
      }
    },
    logs () {
      this.refreshing = false
    }
  },
  methods: {
    ...mapActions(['controlLogs', 'controlJobScript']),
    sanitizePath (path, root = '') {
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
    fetchLogs () {
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
    fetchScript () {
      if (!this.job) {
        return
      }
      if (!this.can_control) {
        console.log('cannot control')
        return
      }

      this.controlJobScript({ jobs: [this.jobid], lines: this.lines })
    },
    fetch () {
      this.fetchLogs()

      if (!this.JobScript) {
        this.fetchScript()
      }
    }
  },
  mounted () {
    this.fetch()
    this.interval = window.setInterval(() => this.fetch(), 5000)
  },
  beforeDestroy () {
    window.clearInterval(this.interval)
  }
}
</script>
