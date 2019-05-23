<template>
  <div>
    <div v-if="can_control">
      <v-subheader v-if="logs && logs.StdOutFile">StdOut: {{logs.StdOutFile}}</v-subheader>
      <v-subheader v-else>StdOut</v-subheader>
      <pre>{{StdOut}}</pre>
      <v-subheader v-if="logs && logs.StdErrFile">StdErr: {{logs.StdErrFile}}</v-subheader>
      <v-subheader v-else>StdErr</v-subheader>
      <pre>{{StdErr}}</pre>
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
      interval: undefined
    }
  },
  computed: {
    ...mapState(['user', 'joblogs']),
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
        this.fetchLogs()
      }
    },
    can_control (after, before) {
      if (!before && after) {
        this.fetchLogs()
      }
    }
  },
  methods: {
    ...mapActions(['controlLogs']),
    fetchLogs () {
      if (!this.job) {
        return
      }
      if (!this.can_control) {
        console.log('cannot control')
        return
      }

      this.controlLogs({ jobs: [this.jobid] })
    }
  },
  mounted () {
    this.fetchLogs()
    this.interval = window.setInterval(() => this.fetchLogs(), 5000)
  },
  beforeDestroy () {
    window.clearInterval(this.interval)
  }
}
</script>
