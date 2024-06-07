<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-chip v-ripple small :color="color" :disabled="disabled" :dark="isDark" @click="$router.push(`/users/${login}`)"
        v-on="on">{{ login }}</v-chip>
    </template>
    <span>{{ fullname }}</span>
  </v-tooltip>
</template>

<script>
import usercolor from '../utils/usercolor'
import { isDark } from '../utils/color'
import { mapState } from 'vuex'

export default {
  props: {
    login: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['users']),
    color() {
      return usercolor(this.login)
    },
    isDark() {
      return isDark(this.color)
    },
    fullname() {
      console.log(this.users)
      return this.users[this.login]?.FullName || `${this.login} (cannot find full name)`
    }
  }
}
</script>
