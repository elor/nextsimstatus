<template>
  <v-flex lg3 sm6 xs12>
    <v-card class="gridcard" :class="{'wrap': wrap}" ma-2>
      <v-card-title v-if="title">
        <v-layout row>
          <v-subheader>{{title}}</v-subheader>
          <v-spacer></v-spacer>
          <slot name="icon"></slot>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  props: {
    title: String,
    wrap: Boolean
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.gridcard {
  min-height: 155px;
  max-height: 310px;
}

.gridcard.wrap {
  max-height: initial;
}
</style>