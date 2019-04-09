<template>
  <v-chip
    small
    :color="color"
    :disabled="disabled"
    :dark="isDark"
    @click="$router.push(`/users/${login}`)"
  >{{login}}</v-chip>
</template>

<script>
import usercolor from '../utils/usercolor'
import { isDark } from '../utils/color'

export default {
  props: {
    login: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    color () {
      return usercolor(this.login)
    },
    isDark () {
      return isDark(this.color)
    }
  }
}
</script>
