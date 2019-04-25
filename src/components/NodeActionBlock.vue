<template>
  <div v-if="is_admin">
    <node-action :node="node" action="drain" color="light-blue" icon="lock"/>
    <node-action :node="node" action="resume" color="light-green" icon="play_arrow"/>
    <node-action :node="node" action="reboot" color="green" icon="update"/>

    <node-action :node="node" action="boot" color="warning" icon="refresh"/>
    <node-action :node="node" action="halt" color="warning" icon="power_settings_new"/>
    <node-action :node="node" action="kill" color="error" icon="power_off"/>
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
