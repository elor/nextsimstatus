<template>
  <v-chip
    v-ripple
    small
    :color="color"
    :disabled="disabled"
    :dark="isDark"
    @click="$router.push(`/jobs/${JobId}`)"
  >{{multiplicity}}{{JobId}}</v-chip>
</template>

<script>
import usercolor from '../utils/usercolor'
import { isDark } from '../utils/color'

export default {
  props: {
    job: {
      type: Object,
      default () {
        return {
          JobId: 0,
          UserName: 'error'
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    JobId () {
      return this.job.JobId || this.job.ArrayJobId
    },
    color () {
      return this.job.UserName ? usercolor(this.job.UserName) : 'grey'
    },
    isDark () {
      return isDark(this.color)
    },
    multiplicity () {
      if (this.job.jobs) {
        return `${this.job.jobs.length}x `
      } else {
        return ''
      }
    }
  }
}
</script>
