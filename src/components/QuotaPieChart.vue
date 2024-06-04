<template>
  <pie-chart :chart-data="quotaData" :tooltip="tooltip" :hidelegend="hidelegend" :height="height"
    :hrefs="quotaData.hrefs"></pie-chart>
</template>

<script>
import { mapState } from 'vuex'
import PieChart from '@/components/PieChart'
import usercolor from '@/utils/usercolor'

import { sortBy } from 'lodash'

export default {
  props: {
    height: String,
    width: String,
    hidelegend: Boolean
  },
  components: {
    PieChart
  },
  computed: {
    ...mapState(['quotas']),
    quotaData() {
      const raw = this.quotas.user.map(u => ({ ...u, name: u.user }))
      const dataset = sortBy(raw, u => -Number(u.kbytes))
      dataset.push(this.free)

      return {
        labels: dataset.map(o => o.name),
        datasets: [
          {
            label: 'kB',
            data: dataset.map(o => o.kbytes),
            backgroundColor: dataset.map(o => usercolor(o.name))
          }
        ]
      }
    },
    free() {
      return {
        name: 'Free',
        kbytes: this.quotas.df.filter(o => o.mounted === '/home')[0].available
      }
    }
  },
  methods: {
    tooltip({ datasetIndex, index }, { labels, datasets }) {
      let suffix = 'kB'
      let count = datasets[datasetIndex].data[index]
      if (count > 1024 ** 3) {
        count /= 1024 ** 3
        suffix = 'TB'
      } else if (count > 1024 ** 2) {
        count /= 1024 ** 2
        suffix = 'GB'
      } else if (count > 1024) {
        count /= 1024
        suffix = 'MB'
      }

      const username = labels[index]
      return `${username}: ${count.toFixed(2)} ${suffix}`
    }
  }
}
</script>
