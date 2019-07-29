<template>
  <v-tooltip top :disabled="!hovertext">
    <template v-slot:activator="{ on }">
      <span v-on="on">{{formatted_seconds}}</span>
    </template>
    <span>{{hovertext}}</span>
  </v-tooltip>
</template>

<script>
import { format } from '../utils/time.js'

const TIME_FORMAT = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
}

export default {
  props: {
    seconds: Number,
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
    milliseconds () {
      return this.seconds * 1000
    },
    formatted_seconds () {
      return format(this.seconds)
    },
    hovertext () {
      if (this.since) {
        return new Date(new Date() - this.milliseconds).toLocaleString('de-DE', TIME_FORMAT)
      }

      return undefined
    }
  }
}
</script>
