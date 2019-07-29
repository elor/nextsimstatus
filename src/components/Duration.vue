<template>
  <v-tooltip top :disabled="!hovertext">
    <template v-slot:activator="{ on }">
      <span v-on="on">{{formatted}}</span>
    </template>
    <span>{{hovertext}}</span>
  </v-tooltip>
</template>

<script>
import { format } from '../utils/time.js'

const LOCALE = 'de-DE'
const LONG_TIME_FORMAT = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
}

const SHORT_TIME_FORMAT = {
  ...LONG_TIME_FORMAT,
  weekday: 'short',
  year: '2-digit',
  month: '2-digit'
}

export default {
  props: {
    seconds: {
      type: Number,
      default: undefined
    },
    iso: {
      type: String,
      default: undefined
    },
    since: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    formatted () {
      if (this.seconds) {
        return format(this.seconds)
      } else if (this.iso) {
        return new Date(this.iso).toLocaleString(LOCALE, SHORT_TIME_FORMAT)
      }
      return undefined
    },
    hovertext () {
      if (this.since) {
        if (this.seconds) {
          return new Date(new Date() - 1000 * this.seconds).toLocaleString(LOCALE, LONG_TIME_FORMAT)
        } else if (this.iso) {
          return new Date(this.iso).toLocaleString(LOCALE, LONG_TIME_FORMAT)
        }
      }

      return undefined
    }
  }
}
</script>
