<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <grid-card title="Allocations" wrap>
            <cores-pie-chart></cores-pie-chart>
          </grid-card>
          <grid-card title="Allocations" wrap>
            <pie-chart :chart-data="allocData" hidelegend height="200"></pie-chart>
          </grid-card>

          <grid-card wrap title="Partitions">
            <pie-chart :chart-data="partitionData"></pie-chart>
          </grid-card>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-text>
        <pie-chart :chart-data="quotaData" hidelegend :tooltip="tooltip"></pie-chart>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import GridCard from '@/components/GridCard'
import CoresPieChart from '@/components/CoresPieChart'
import PieChart from '@/components/PieChart'
import usercolor from '../utils/usercolor'

import { sortBy } from 'lodash'

const colors = {
  blue: '#03a9f4',
  green: '#4caf50',
  red: '#f44336'
}

function sum (array) {
  return array.reduce((a, b) => a + b, 0)
}

function cpudata (nodes) {
  const allocCPUs = sum(nodes.map(node => Number(node.CPUAlloc)))
  const errCPUs = sum(nodes.map(node => Number(node.CPUErr)))
  const totalCPUs = sum(nodes.map(node => Number(node.CPUTot)))
  const freeCPUs = totalCPUs - allocCPUs - errCPUs

  return [allocCPUs, freeCPUs, errCPUs]
}

export default {
  components: {
    PieChart,
    GridCard,
    CoresPieChart
  },
  computed: {
    ...mapState(['beegfs']),
    ...mapGetters(['nodestatus', 'userstatus', 'partitionstatus']),
    nodeData () {
      return {
        labels: this.nodestatus.map(node => node.NodeName),
        datasets: [
          {
            label: 'CPUAlloc',
            data: this.nodestatus.map(node => node.CPUAlloc),
            backgroundColor: this.nodestatus.map(node =>
              usercolor(node.NodeName)
            )
          }
        ]
      }
    },
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
    },
    userData () {
      const users = this.userstatus
        .filter(user => user.NumCPUs)
        .map(user => ({
          name: user.UserName,
          cpus: user.NumCPUs,
          color: usercolor(user.UserName)
        }))
        .sort((a, b) => b.cpus - a.cpus)

      return {
        labels: users.map(user => user.name),
        datasets: [
          {
            label: 'Jobs',
            data: users.map(user => user.cpus),
            backgroundColor: users.map(user => user.color)
          }
        ]
      }
    },
    allocData () {
      const allocations = cpudata(this.nodestatus)
      const users = this.userData

      return {
        labels: [...users.labels, 'Free', 'Err'],
        datasets: [
          {
            label: 'Allocations',
            data: [...users.datasets[0].data, allocations[1], allocations[2]],
            backgroundColor: [
              ...users.datasets[0].backgroundColor,
              colors.green,
              colors.red
            ]
          }
        ]
      }
    },
    partitionData () {
      return {
        labels: ['Alloc', 'Free', 'Err'],
        datasets: this.partitionstatus.map(partition => ({
          label: partition.PartitionName,
          data: cpudata(partition.Nodes),
          backgroundColor: [colors.blue, colors.green, colors.red]
        }))
      }
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
