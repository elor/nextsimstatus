<template>
  <v-progress-circular :value="percent" :color="color">
    {{value}}
  </v-progress-circular>
</template>

<script>
  export default {
    props: {
      load: Number,
      cores: Number,
      precise: Boolean
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
      percent() {
        return 100 * this.load / this.cores;
      },
      value() {
        return this.precise ? this.load : Math.round(this.load);
      }
    }
  };
</script>