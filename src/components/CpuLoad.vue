<template>
  <v-progress-circular :value="percent"
                      :color="color">
                      {{Math.round(percent)}}
  </v-progress-circular>
</template>

<script>
export default {
  props: {
    percent: Number
  },
  computed: {
    color() {
      if (this.percent >= 110) {
        return "red";
      } else if (this.percent >= 90) {
        return "light-blue";
      } else {
        return "green";
      }
    }
  }
};
</script>
