<template>
  <v-chip small :color="color" :dark="isDark">
    <v-icon size="100%" v-if="is_admin_group">fa-star</v-icon>
    {{group}}
  </v-chip>
</template>

<script>
import groupcolor from '../utils/groupcolor'
import { isDark } from '../utils/color'
import { ADMIN_GROUP } from '../config'

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
    },
    is_admin_group () {
      return this.group === ADMIN_GROUP
    }
  },
  methods: {
    groupcolor
  }
}
</script>
