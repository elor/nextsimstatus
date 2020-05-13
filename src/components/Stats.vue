<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <grid-card title="Core Allocation">
            <cores-pie-chart height="180" hidelegend></cores-pie-chart>
          </grid-card>

          <grid-card title="BeeGFS Usage">
            <quota-pie-chart height="180" hidelegend></quota-pie-chart>
          </grid-card>

          <grid-card title="BeeGFS Usage (Users only)">
            <quota-pie-chart height="180" hidelegend usersonly></quota-pie-chart>
          </grid-card>
        </v-layout>

        <v-layout row wrap>
          <grid-card
            :title="`CPU Usage (stacked, last ${period})`"
            v-for="period in ['hour', 'day', 'week', 'month', 'year']"
            :key="period"
          >
            <a :href="cpu_usage(period)">
              <v-img alt="cpu_usage" :src="cpu_usage(period)"></v-img>
            </a>
          </grid-card>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import GridCard from '@/components/GridCard'
import CoresPieChart from '@/components/CoresPieChart'
import QuotaPieChart from '@/components/QuotaPieChart'

export default {
  components: {
    GridCard,
    CoresPieChart,
    QuotaPieChart
  },
  methods: {
    cpu_usage (period) {
      return this.ganglia_chart_stacked('load_one', period)
    },
    ganglia_chart_stacked (dataset, period) {
      return `https://mainsim.etit.tu-chemnitz.de/ganglia/stacked.php?c=MainSim&m=${dataset}&r=${period}`
    }
  }
}
</script>
