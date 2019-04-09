<template>
<v-chip small :class="{'grey--text': inactive}" :to="`/users/${login}`" :color="color" :dark="isDark">
{{login}}
</v-chip>
</template>

<script>
import usercolor from '../utils/usercolor'
import { isDark } from '../utils/color'

export default {
  props: {
    login: String,
    inactive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    color () {
      return usercolor(this.login, this.inactive)
    },
    isDark () {
      return isDark(this.color)
    },
    background_color () {
      return usercolor(this.login, true)
    },
    initials () {
      return this.login.replace(/[^a-z]/g, '').substr(0, 2)
    }
  }
}
</script>
