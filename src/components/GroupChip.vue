<template>
  <v-chip small :color="color" :dark="isDark">{{group}}</v-chip>
</template>

<script>
import groupcolor from '../utils/groupcolor'
import { isDark } from '../utils/color'

export default {
  props: {
    group: String
  },
  computed: {
    color () {
      return this.groupcolor(this.group)
    },
    isDark () {
      return isDark(this.color)
    }
  },
  methods: {
    groupcolor
  }
}
</script>
