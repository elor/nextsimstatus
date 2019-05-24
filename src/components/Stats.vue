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
  }
}
</script>
