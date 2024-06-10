<template>
  <v-data-table :headers="headers" :items="quotas.project" :search="search" :items-per-page="-1" :sort-by="sortBy"
    :sort-desc="sortDesc" hide-default-footer>
    <template v-slot:item.project="props">
      <project-chip :project="props.item.project" />
    </template>

    <template v-slot:item.kbytes="props">
      <span>{{ formatSIbytes(props.item.kbytes) }}</span>
    </template>

    <template v-slot:item.quota="props">
      <span>{{ formatSIbytes(props.item.quota) }}</span>
    </template>

  </v-data-table>
</template>

<script>
import { mapState } from 'vuex'
import ProjectChip from '@/components/ProjectChip'
import formatSIbytes from '@/utils/formatsibytes'

export default {
  components: {
    ProjectChip
  },
  props: {
    search: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headers: [
        {
          text: 'Project',
          align: 'left',
          sortable: true,
          value: 'project'
        },
        {
          text: 'Storage',
          align: 'left',
          sortable: true,
          value: 'kbytes'
        },
        {
          text: 'Quota',
          align: 'left',
          sortable: true,
          value: 'quota'
        }
      ],
      sortBy: ['kbytes'],
      sortDesc: [true]
    }
  },
  computed: {
    ...mapState(['quotas'])
  },
  methods: {
    formatSIbytes
  }
}
</script>
