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

        <v-btn-toggle v-model="period" mandatory>
          <v-btn v-for="text in available_periods" :key="text" flat :value="text">{{text}}</v-btn>
        </v-btn-toggle>

        <v-layout row wrap>
          <grid-card
            :title="`${title} ('${key}', last ${period})`"
            v-for="[key, title] in Object.entries(chart_titles)"
            :key="key"
            :href="ganglia_link(key, period)"
          >
            <v-img :alt="key" :src="ganglia_chart(key, period)" />
          </grid-card>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import GridCard from '@/components/GridCard'
import CoresPieChart from '@/components/CoresPieChart'
import QuotaPieChart from '@/components/QuotaPieChart'

export default {
  components: {
    GridCard,
    CoresPieChart,
    QuotaPieChart
  },
  data () {
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
  },
  methods: {
    ganglia_chart (dataset) {
      return `https://mainsim.etit.tu-chemnitz.de/ganglia/stacked.php?c=MainSim&m=${dataset}&r=${this.period}`
    },
    ganglia_link (dataset) {
      return this.is_admin ? `https://mainsim.etit.tu-chemnitz.de/ganglia/?c=MainSim&m=${dataset}&r=${this.period}` : this.ganglia_chart(dataset)
    }
  }
}
</script>
