<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn :disabled="!node" :color="color" fab small @click="control" v-on="on">
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
    ...mapActions(['controlNodes']),
    control() {
      if (
        this.is_admin &&
        confirm(`${this.action.toUpperCase()} node ${this.node}?`)
      ) {
        this.controlNodes({
          action: this.action,
          nodes: this.node
        })
      }
    }
  }
}
</script>
