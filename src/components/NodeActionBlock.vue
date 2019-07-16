<template>
  <div v-if="is_admin">
    <node-action :node="node" action="drain" color="light-blue" icon="fa-hand-paper" />
    <node-action :node="node" action="resume" color="light-green" icon="fa-play" />
    <node-action :node="node" action="reboot" color="green" icon="fa-clock" />

    <node-action :node="node" action="boot" color="warning" icon="fa-bolt" />
    <node-action :node="node" action="halt" color="warning" icon="fa-power-off" />
    <node-action :node="node" action="kill" color="error" icon="fa-plug" />
  </div>
  <div v-else>
    Melde dich als Admin an, um Knoten zu steuern:
    <login-menu light></login-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NodeAction from '@/components/NodeAction'
import LoginMenu from '@/components/LoginMenu'

export default {
  components: {
    NodeAction,
    LoginMenu
  },
  props: {
    node: String
  },
  computed: {
    ...mapGetters(['is_admin', 'logged_in'])
  }
}
</script>
