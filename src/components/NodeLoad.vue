<template>
    <router-link :to="`/${name}`">
    <v-progress-circular :value="percent" :color="color">
      {{number}}
    </v-progress-circular>
  </router-link>
</template>

<script>
import nodecolor from '../utils/nodecolor'

export default {
  props: {
    node: Object
  },
  computed: {
    percent () {
      return 100 * this.node.CPUAlloc / this.node.CPUTot
    },
    color () {
      return nodecolor(this.node)
    },
    name () {
      return this.node.NodeName
    },
    number () {
      return Number(this.name.replace(/\D/g, ''))
    }
  }
}
</script>
