<template>
  <div>
    <QuotaPieChart height="300" width="300" :hidelegend="false" />

    <pre>
      {{ quotas }}
    </pre>
  </div>
</template>

<script>
import QuotaPieChart from '@/components/QuotaPieChart'
import { mapState } from 'vuex'

export default {
  components: {
    QuotaPieChart
  },
  computed: {
    ...mapState(['quotas'])
  }
}
</script>
