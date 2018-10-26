<template>
  <canvas ref="canvas" :height="height" :style="style"></canvas>
</template>

<script>
import { Pie, mixins } from "vue-chartjs";

export default {
  extends: Pie,
  props: {
    height: { default: 200 },
    hidelegend: Boolean
  },
  mixins: [mixins.reactiveProp],
  computed: {
    config() {
      return {
        legend: {
          position: "right",
          display: !this.hidelegend
        },
        animation: {
          animateRotate: false
        }
      };
    },
    style() {
      let style = {};

      if (this.inline) {
        style.display = "inline";
      }

      return style;
    }
  },
  watch: {
    hidelegend() {
      this.render();
    }
  },
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData, this.config);
  }
};
</script>
