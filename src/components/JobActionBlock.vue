<template>
  <div v-if="logged_in">
    <job-action :jobs="jobs" action="top" color="light-green" icon="vertical_align_top"/>
    <job-action :jobs="jobs" action="release" color="light-green" icon="play_arrow"/>
    <job-action :jobs="jobs" action="hold" color="warning" icon="lock"/>
    <job-action :jobs="jobs" action="abort" color="error" icon="cancel"/>
    <job-action :jobs="jobs" action="requeue" color="light-blue" icon="refresh"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import JobAction from '@/components/JobAction'

export default {
  components: {
    JobAction
  },
  props: {
    jobs: Array
  },
  computed: {
    ...mapGetters(['logged_in'])
  }
}
</script>
