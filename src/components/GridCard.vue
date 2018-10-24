<template>
  <v-flex lg3 sm6 xs12>
    <v-card class="gridcard" ma-2>
      <v-layout row>
        <v-subheader>{{title}}</v-subheader>
      </v-layout>
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  props: ["title"],
  data() {
    return {};
  }
};
</script>

<style scoped>
.gridcard {
  min-height: 155px;
  max-height: 170px;
}
</style>