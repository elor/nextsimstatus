<template>
  <pie-chart
    :chart-data="allocData"
    :hidelegend="hidelegend"
    :height="height"
    :hrefs="allocData.hrefs"
  ></pie-chart>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import PieChart from '@/components/PieChart'
import usercolor from '../utils/usercolor'

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
    ...mapGetters(['userstatus']),
    ...mapState(['usercpus', 'nodecpus']),
    allocData () {
      const system = [
        { name: 'Free', cpus: this.nodecpus.free },
        { name: 'Drain', cpus: this.nodecpus.drain },
        { name: 'Reboot', cpus: this.nodecpus.reboot },
        { name: 'Error', cpus: this.nodecpus.error },
        { name: 'Failure', cpus: this.nodecpus.fail }
      ].filter(sys => sys.cpus)
      const labels = [
        ...this.usercpus.map(user => user.name),
        ...system.map(sys => sys.name)
      ]

      const hrefs = labels.map(name => {
        if (/^.\..*$/.test(name)) {
          return `/users/${name}`
        }
        return undefined
      })

      return {
        labels,
        hrefs,
        datasets: [
          {
            label: 'Core Allocations',
            data: [
              ...this.usercpus.map(user => user.cpus),
              ...system.map(sys => sys.cpus)
            ],
            backgroundColor: labels.map(usercolor)
          }
        ]
      }
    }
  }
}
</script>
