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
              @change="fetchLogs"
            ></v-select>
          </v-subheader>
        </v-flex>
      </v-layout>
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
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
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
    ...mapState(['user', 'joblogs', 'errors']),
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
    },
    logs () {
      this.refreshing = false
    },
    errors () {
      this.errors
        .filter(error => error.message.startswith(`Job #${this.jobid}:`))
        .foreach(error => {
          this.removeError(error)
          this.logs = { StdOut: error.message, StdErr: error.message }
        })
    }
  },
  methods: {
    ...mapMutations(['removeError']),
    ...mapActions(['controlLogs']),
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
