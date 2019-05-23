<template>
  <div>
    <h3>StdOut</h3>
    <pre>{{StdOut}}</pre>
    <h3>StdErr</h3>
    <pre>{{StdErr}}</pre>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  props: {
    job: Object
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
