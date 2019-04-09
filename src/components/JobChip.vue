<template>
  <v-chip
    small
    :color="color"
    :disabled="disabled"
    :dark="isDark"
    @click="$router.push(`/job/${job.JobId}`)"
  >{{job.JobId}}</v-chip>
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
    color () {
      return usercolor(this.job.UserName)
    },
    isDark () {
      return isDark(this.color)
    }
  }
}
</script>
