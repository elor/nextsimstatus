<template>
  <div v-if="logged_in">
    <job-action
      :jobs="jobs"
      when="PENDING,REQUEUED"
      action="top"
      color="light-green"
      icon="vertical_align_top"
    />

    <job-action
      :jobs="jobs"
      when="PENDING,REQUEUED"
      action="release"
      color="light-green"
      icon="play_arrow"
    />

    <job-action
      :jobs="jobs"
      when="PENDING,REQUEUED,BOOT_FAIL"
      action="hold"
      color="warning"
      icon="lock"
    />

    <job-action
      :jobs="jobs"
      when="RUNNING,SUSPENDED,STOPPED,PENDING,REQUEUED"
      action="abort"
      color="error"
      icon="cancel"
    />
    <job-action
      :jobs="jobs"
      when="COMPLETED,CANCELLED,FAILED,BOOT_FAIL,NODE_FAIL,PREEMPTED"
      action="requeue"
      color="light-blue"
      icon="refresh"
    />
    <job-action
      :jobs="jobs"
      when="PENDING,REQUEUED"
      array_only
      action="throttle"
      color="primary"
      icon="list"
      numeric
    />
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
