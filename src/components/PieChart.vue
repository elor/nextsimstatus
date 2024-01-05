<template>
  <div class="pie-container" :style="containerstyle">
    <canvas ref="canvas" :style="style"></canvas>
  </div>
</template>

<script>
import { Pie, mixins } from 'vue-chartjs'
import 'chartjs-plugin-labels'

function isInt(string) {
  return /^\d+$/.test(string)
}

export default {
  extends: Pie,
  props: {
    height: String,
    width: String,
    hidelegend: Boolean,
    tooltip: Function,
    hrefs: {
      type: Array,
      default: () => []
    }
  },
  mixins: [mixins.reactiveProp],
  computed: {
    config() {
      const conf = {
        maintainAspectRatio: false,
        legend: {
          position: 'right',
          display: !this.hidelegend
        },
        tooltips: {
          callbacks: {
          }
        },
        plugins: {
          labels: {
            render: args => (args.percentage > 4 ? `${args.percentage}%` : ''),
            showZero: false,
            position: 'border',
            fontColor: '#fff',
            textShadow: true
          }
        },
        onClick: (event, elements) => {
          if (elements && elements.length && elements[0]) {
            this.onClick(elements[0]._index)
          }
        }
      }

      if (this.tooltip) {
        conf.tooltips.callbacks.label = this.tooltip
      }

      return conf
    },
    style() {
      const style = {}

      if (this.inline) {
        style.display = 'inline'
      }

      return style
    },
    containerstyle() {
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
  methods: {
    onClick(index) {
      const route = this.hrefs[index]
      if (route) {
        this.$router.push(route)
      }
    }
  },
  watch: {
    hidelegend() {
      this.render()
    }
  },
  mounted() {
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
