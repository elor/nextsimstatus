<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="!jobs.length || !can_control"
        :color="color"
        fab
        small
        @click="control"
        v-on="on"
      >
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
    color: String
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
    singular_owner () {
      const owners = uniq(this.jobusers)
      if (owners.length !== 1) return undefined
      return owners[0]
    },
    can_control () {
      return (
        this.is_admin || (this.user && this.singular_owner === this.user.login)
      )
    }
  },
  methods: {
    ...mapActions(['controlJobs']),
    control () {
      if (
        this.can_control &&
        confirm(`${this.action.toUpperCase()} job ${this.jobids}?`)
      ) {
        this.controlJobs({
          action: this.action,
          jobs: this.jobids
        })
      }
    }
  }
}
</script>
