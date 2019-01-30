<template>
  <v-progress-circular :value="percent" :color="color">
    {{text}}
  </v-progress-circular>
</template>

<script>
export default {
  props: {
    values: Object
  },
  computed: {
    color () {
      if (this.value >= this.high) {
        return 'red'
      } else if (this.value <= this.low) {
        return 'light-blue'
      } else {
        return 'green'
      }
    },
    value () {
      return this.values.val
    },
    min () {
      return this.values.min
    },
    max () {
      return this.values.max
    },
    percent () {
      return 100 * (this.value - this.min) / (this.max - this.min)
    },
    text () {
      return Math.round(this.value)
    }
  }
}
</script>
