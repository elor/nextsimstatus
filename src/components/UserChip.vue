<template>
<v-chip :class="{'grey--text': inactive}" :to="`/users/${login}`" :color="background_color">
    <v-avatar size="16" :color="color">{{initials}}</v-avatar>
    {{login}}
</v-chip>
</template>

<script>
import usercolor from '../utils/usercolor'

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
    background_color () {
      return usercolor(this.login, true)
    },
    initials () {
      return this.login.replace(/[^a-z]/g, '').substr(0, 2).toUpperCase()
    }
  }
}
</script>
