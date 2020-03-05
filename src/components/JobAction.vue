<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn :disabled="disabled" :color="color" fab small @click="control" v-on="on">
        <v-icon>{{icon}}</v-icon>
      </v-btn>
    </template>
    <span>{{action}}</span>
  </v-tooltip>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { uniq } from 'lodash'

export default {
  props: {
    jobs: Array,
    action: String,
    icon: String,
    color: String,
    numeric: {
      type: Boolean,
      default: false
    },
    array_only: {
      type: Boolean,
      default: false
    },
    admin_only: {
      type: Boolean,
      default: false
    },
    when: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['is_admin']),
    jobids () {
      return this.jobs.map(job => job.JobId).join(',')
    },
    jobusers () {
      return this.jobs.map(job => job.UserName)
    },
    JobStates () {
      return uniq(this.jobs.map(job => job.JobState))
    },
    singular_owner () {
      const owners = uniq(this.jobusers)
      if (owners.length !== 1) return undefined
      return owners[0]
    },
    can_control () {
      return (
        this.is_admin || (!this.admin_only && this.user && this.singular_owner === this.user.login)
      )
    },
    when_split () {
      return this.when.split(',').map(s => s.toUpperCase())
    },
    when_enabled () {
      return !this.when.length || this.when_split.some(when => this.JobStates.includes(when))
    },
    is_array () {
      return this.jobs.some(job => job.JobId === job.ArrayJobId)
    },
    array_enabled () {
      return !this.array_only || this.is_array
    },
    disabled () {
      return !this.jobs.length || !this.can_control || !this.array_enabled || !this.when_enabled
    }
  },
  methods: {
    ...mapActions(['controlJobs']),
    control () {
      if (!this.can_control) {
        return
      }

      let confirmation = false
      let payload
      if (this.numeric) {
        payload = prompt(
          `${this.action.toUpperCase()} job ${this.jobids} - how much?`
        )
        console.log(payload)
        confirmation = payload !== null && payload !== undefined
      } else {
        confirmation = confirm(
          `${this.action.toUpperCase()} job ${this.jobids}?`
        )
      }
      if (confirmation) {
        this.controlJobs({
          action: this.action,
          jobs: this.jobids,
          payload: payload
        })
      }
    }
  }
}
</script>
