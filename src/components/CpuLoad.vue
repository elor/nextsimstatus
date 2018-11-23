<template>
  <v-progress-circular :value="percent"
                      :color="color">
                      {{Math.round(load)}}
  </v-progress-circular>
</template>

<script>
export default {
  props: {
    load: Number,
    cores: Number
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
    },
    percent(){
      return 100 * this.load / this.cores
    }
  }
};
</script>
