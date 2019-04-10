<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn :color="color" fab small @click="control" v-on="on">
        <v-icon>{{icon}}</v-icon>
      </v-btn>
    </template>
    <span>{{action}}</span>
  </v-tooltip>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    node: String,
    action: String,
    icon: String,
    color: String
  },
  computed: {
    ...mapGetters(['is_admin'])
  },
  methods: {
    ...mapActions(['mainsimControl']),
    control () {
      if (this.is_admin && confirm(`Really ${this.action.toUpperCase()} node ${this.NodeName}?`)) {
        this.mainsimControl({
          action: this.action,
          nodes: this.node
        })
      }
    }
  }
}
</script>
