<template>
  <div class="pie-container" :style="containerstyle">
    <canvas ref="canvas" :style="style"></canvas>
  </div>
</template>

<script>
import { Pie, mixins } from 'vue-chartjs'
import 'chartjs-plugin-labels'

function isInt (string) {
  return /^\d+$/.test(string)
}

export default {
  extends: Pie,
  props: {
    height: String,
    width: String,
    hidelegend: Boolean
  },
  mixins: [mixins.reactiveProp],
  computed: {
    config () {
      return {
        maintainAspectRatio: false,
        legend: {
          position: 'right',
          display: !this.hidelegend
        },
        plugins: {
          labels: {
            render: args => (args.percentage > 4 ? `${args.percentage}%` : ''),
            showZero: false,
            position: 'border',
            fontColor: '#fff',
            textShadow: true
          }
        }
      }
    },
    style () {
      let style = {}

      if (this.inline) {
        style.display = 'inline'
      }

      return style
    },
    containerstyle () {
      let style = {}
      style = {}

      if (this.width) {
        style.width = isInt(this.width) ? `${this.width}px` : this.width
      }

      if (this.height) {
        style.height = isInt(this.height) ? `${this.height}px` : this.height
      }

      return style
    }
  },
  watch: {
    hidelegend () {
      this.render()
    }
  },
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData, this.config)
  }
}
</script>

<style scoped>
.pie-container {
  position: relative;
  padding: 0;
  margin: 0;
}
</style>
