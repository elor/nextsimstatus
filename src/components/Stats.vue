<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <grid-card title="Core Allocation">
            <cores-pie-chart height="180" hidelegend></cores-pie-chart>
          </grid-card>
        </v-layout>

        <v-container>
          <v-btn-toggle v-model="period" mandatory>
            <v-btn v-for="text in available_periods" :key="text" text :value="text">{{text}}</v-btn>
          </v-btn-toggle>
        </v-container>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import GridCard from '@/components/GridCard'
import CoresPieChart from '@/components/CoresPieChart'

export default {
  components: {
    GridCard,
    CoresPieChart
  },
  data() {
    return {
      period: 'day',
      available_periods: ['hour', '2hr', '4hr', 'day', 'week', 'month', 'year'],
      chart_titles: {
        load_one: 'CPU Load',
        proc_run: 'Running Processes',
        mem_free: 'Free RAM',
        bytes_in: 'Bytes Received',
        bytes_out: 'Bytes Sent'
      }
    }
  },
  computed: {
    ...mapGetters(['is_admin'])
  }
}
</script>
