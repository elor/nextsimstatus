<template>
  <span>
    <v-icon small v-if="isnan" class="mr-3">fa-question</v-icon>
    <template v-else>
      <v-icon :color="color">fa-thermometer-{{icon}}</v-icon>
      <span class="mr-2" :class="{[`${color}--text`]:true}">{{Math.round(value)}}</span>
    </template>
  </span>
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
    icon () {
      if (this.value >= this.max) {
        return 'full'
      } else if (this.value >= this.high) {
        return 'three-quarters'
      } else if (this.value >= this.low) {
        return 'half'
      } else if (this.value >= this.min) {
        return 'quarter'
      } else {
        return 'empty'
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
    isnan () {
      return isNaN(this.value)
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
