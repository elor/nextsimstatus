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

const RUNTIME_REGEX = /^(?:(\d+)-)?(\d\d):(\d\d):(\d\d)$/

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
  data() {
    return {
    }
  },
  computed: {
    iso_seconds() {
      if (this.iso && RUNTIME_REGEX.test(this.iso)) {
        const [days, hours, minutes, seconds] = this.iso.match(RUNTIME_REGEX).slice(1).map(str => Number(str || 0))
        return seconds + 60 * (minutes + 60 * (hours + 24 * days))
      }
      return undefined
    },
    iso_date() {
      if (this.iso && this.iso_seconds === undefined) {
        return new Date(this.iso)
      }
      return undefined
    },
    formatted() {
      if (this.seconds !== undefined) {
        return format(this.seconds)
      } else if (this.iso_seconds !== undefined) {
        return this.iso
      } else if (this.iso_date) {
        return this.iso_date.toLocaleString(LOCALE, SHORT_TIME_FORMAT)
      }
      return undefined
    },
    hovertext() {
      if (this.since) {
        if (this.seconds !== undefined) {
          return new Date(new Date() - 1000 * this.seconds).toLocaleString(LOCALE, LONG_TIME_FORMAT)
        } else if (this.iso_seconds !== undefined) {
          return new Date(new Date() - 1000 * this.iso_seconds).toLocaleString(LOCALE, LONG_TIME_FORMAT)
        } else if (this.iso_date) {
          return this.iso_date.toLocaleString(LOCALE, LONG_TIME_FORMAT)
        }
      }

      return undefined
    }
  }
}
</script>
