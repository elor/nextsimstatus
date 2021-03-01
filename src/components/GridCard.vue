<template>
  <v-flex lg3 md4 sm6 xs12>
    <v-card class="gridcard ma-2" :class="{'wrap': wrap}" :style="style" :href="href">
      <v-card-title v-if="title">
        <v-layout row>
          <v-subheader>{{title}}</v-subheader>
          <v-spacer></v-spacer>
          <slot name="icon"></slot>
        </v-layout>
      </v-card-title>
      <v-card-text class="pt-0">
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
function isInt (string) {
  return /^\d+$/.test(string)
}

export default {
  props: {
    title: String,
    height: String,
    wrap: Boolean,
    href: {
      type: String,
      default: undefined
    }
  },
  computed: {
    style () {
      const style = {}

      if (this.height) {
        style.height = isInt(this.height) ? `${this.height}px` : this.height
      }

      return style
    }
  },
  data () {
    return {}
  }
}
</script>

<style>
.gridcard {
  min-height: 155px;
  max-height: 310px;
}

.gridcard.wrap {
  max-height: initial;
}

.gridcard .v-subheader {
  height: 24px;
  padding-left: 0px;
}
</style>
