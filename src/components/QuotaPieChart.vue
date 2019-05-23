<template>
  <pie-chart :chart-data="quotaData" :tooltip="tooltip" :hidelegend="hidelegend" :height="height"></pie-chart>
</template>

<script>
import { mapState } from 'vuex'
import PieChart from '@/components/PieChart'
import usercolor from '../utils/usercolor'

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
    ...mapState(['beegfs']),
    quotaData () {
      return {
        labels: this.quotas.map(user => user.name),
        datasets: [
          {
            label: 'Bytes',
            data: this.quotas.map(user => user.bytes),
            backgroundColor: this.quotas.map(user =>
              usercolor(user.name)
            )
          }
        ]
      }
    },
    quotas () {
      const userBytesSum = Object.values(this.beegfs.quota).reduce((sum, user) => sum + Number(user.bytes), 0)

      return [
        ...sortBy(Object.values(this.beegfs.quota), a => -Number(a.bytes)),
        {
          name: 'System',
          bytes: Math.max(0, this.beegfs.total - this.beegfs.free - userBytesSum)
        },
        {
          name: 'Free',
          bytes: this.beegfs.free
        }
      ]
    }
  },
  methods: {
    tooltip ({ datasetIndex, index }, { labels, datasets }) {
      const username = labels[index]
      const bytes = datasets[datasetIndex].data[index]
      const gigabytes = Math.ceil(bytes / (1024 ** 3))
      return `${username}: ${gigabytes} GB`
    }
  }
}
</script>
