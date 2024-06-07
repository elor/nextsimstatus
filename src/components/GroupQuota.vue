<template>
  <v-data-table :headers="headers" :items="quotas.group" :search="search" :items-per-page="-1" hide-default-footer>
    <template v-slot:item.group="props">
      <group-chip :group="props.item.group" />
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
import GroupChip from '@/components/GroupChip'
import formatSIbytes from '@/utils/formatsibytes'

export default {
  components: {
    GroupChip
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
          text: 'Group',
          align: 'left',
          sortable: true,
          value: 'group'
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
      ]
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
