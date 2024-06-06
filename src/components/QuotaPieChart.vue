<template>
  <pie-chart :chart-data="quotaData" :tooltip="tooltip" :hidelegend="hidelegend" :height="height"
    :hrefs="quotaData.hrefs"></pie-chart>
</template>

<script>
import { mapState } from 'vuex'
import PieChart from '@/components/PieChart'
import usercolor from '@/utils/usercolor'
import formatSIbytes from '@/utils/formatsibytes'

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

      const labels = dataset.map(o => o.name)
      const hrefs = labels.map(name => `/users/${name}`)

      return {
        labels,
        hrefs,
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
      const kbytes = datasets[datasetIndex].data[index]

      const username = labels[index]
      return `${username}: ${formatSIbytes(kbytes)}`
    }
  }
}
</script>
