<template>
  <div v-if="logged_in">
    <job-action
      :jobs="jobs"
      when="PENDING,REQUEUED"
      action="top"
      color="light-green"
      icon="fa-angle-double-up"
    />

    <job-action
      :jobs="jobs"
      when="PENDING,REQUEUED"
      action="release"
      color="light-green"
      icon="fa-play"
    />

    <job-action
      :jobs="jobs"
      when="PENDING,REQUEUED,BOOT_FAIL"
      action="hold"
      color="warning"
      icon="fa-hand-paper"
    />

    <job-action
      :jobs="jobs"
      when="RUNNING,SUSPENDED,STOPPED,PENDING,REQUEUED"
      action="abort"
      color="error"
      icon="fa-ban"
    />
    <job-action
      :jobs="jobs"
      when="COMPLETED,CANCELLED,FAILED,BOOT_FAIL,NODE_FAIL,PREEMPTED"
      action="requeue"
      color="light-blue"
      icon="fa-redo"
    />
    <job-action
      :jobs="jobs"
      when="PENDING,REQUEUED"
      array_only
      action="throttle"
      color="primary"
      icon="fa-percentage"
      numeric
    />
    <job-action
      :jobs="jobs"
      when="RUNNING,PENDING,REQUEUED"
      admin_only
      action="increase_timelimit"
      color="primary"
      icon="fa-hourglass-end"
    />
  </div>
  <div v-else>
    Melde dich an, um deine Jobs zu steuern:
    <login-menu light></login-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import JobAction from '@/components/JobAction'
import LoginMenu from '@/components/LoginMenu'

export default {
  components: {
    JobAction,
    LoginMenu
  },
  props: {
    jobs: Array
  },
  computed: {
    ...mapGetters(['logged_in'])
  }
}
</script>
