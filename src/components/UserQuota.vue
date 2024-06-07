<template>
  <v-data-table :headers="headers" :items="userstatus" :search="search" :items-per-page="-1" hide-default-footer>
    <template v-slot:item.UserName="props">
      <user-chip :login="props.item.UserName" />
    </template>

    <template v-slot:item.Storage.kbytes="props">
      <span>{{ formatSIbytes(props.item.Storage.kbytes) }}</span>
    </template>

    <template v-slot:item.Storage.quota="props">
      <span>{{ formatSIbytes(props.item.Storage.quota) }}</span>
    </template>

  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
import UserChip from '@/components/UserChip'
import formatSIbytes from '@/utils/formatsibytes'

export default {
  components: {
    UserChip
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
          text: 'User',
          align: 'left',
          sortable: true,
          value: 'UserName'
        },
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'FullName'
        },
        {
          text: 'Storage',
          align: 'left',
          sortable: true,
          value: 'Storage.kbytes'
        },
        {
          text: 'Quota',
          align: 'left',
          sortable: true,
          value: 'Storage.quota'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userstatus'])
  },
  methods: {
    formatSIbytes
  }
}
</script>
