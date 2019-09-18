<template>
  <pie-chart
    :chart-data="quotaData"
    :tooltip="tooltip"
    :hidelegend="hidelegend"
    :height="height"
    :hrefs="quotaData.hrefs"
  ></pie-chart>
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
    hidelegend: Boolean,
    usersonly: {
      type: Boolean,
      default: false
    }
  },
  components: {
    PieChart
  },
  computed: {
    ...mapState(['beegfs']),
    quotaData () {
      let dataset = this.usersonly ? this.users : this.quotas

      if (!dataset.length) {
        dataset = [{
          name: 'Retrieving data...',
          bytes: this.beegfs.total
        }]
      }

      const hrefs = dataset.map(user => {
        if (/^.\..*$/.test(user.name)) {
          return `/users/${user.name}`
        }
        return undefined
      })

      return {
        labels: dataset.map(user => user.name),
        hrefs: hrefs,
        datasets: [
          {
            label: 'Bytes',
            data: dataset.map(user => user.bytes),
            backgroundColor: dataset.map(user =>
              usercolor(user.name)
            )
          }
        ]
      }
    },
    system () {
      const userBytesSum = Object.values(this.beegfs.quota).reduce((sum, user) => sum + Number(user.bytes), 0)

      return {
        name: 'System',
        bytes: Math.max(0, this.beegfs.total - this.beegfs.free - userBytesSum)
      }
    },
    free () {
      return {
        name: 'Free',
        bytes: this.beegfs.free
      }
    },
    users () {
      return sortBy(Object.values(this.beegfs.quota), a => -Number(a.bytes))
    },
    quotas () {
      return [
        ...this.users,
        this.system,
        this.free
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
