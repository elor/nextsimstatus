<template>
  <v-container fluid>
    <v-layout>
      <v-btn href="https://mainsim.etit.tu-chemnitz.de/gitlab">GitLab</v-btn>
      <v-btn href="https://mainsim.etit.tu-chemnitz.de/jupyter">Jupyter</v-btn>
      <v-btn to="apps/periodyfier">Periodyfier</v-btn>
      <v-btn href="https://www.tu-chemnitz.de/main/">MAIN-Webseite</v-btn>
    </v-layout>
    <v-layout>
      <v-btn href="https://mainsim.etit.tu-chemnitz.de/ganglia">Ganglia CPU-Monitoring</v-btn>
      <v-btn href="https://mainsim.etit.tu-chemnitz.de/xcat-doc">xCAT Documentation (Manpages)</v-btn>
      <v-btn href="https://mainsim.etit.tu-chemnitz.de/nagios">Nagios Host-Monitoring</v-btn>
      <v-btn href="https://mainsimweb.etit.tu-chemnitz.de/graphql">GraphQL Backend</v-btn>
    </v-layout>
    <v-layout>
      <v-btn href="https://tuc.cloud">TUC-Cloud</v-btn>
      <v-btn href="https://terminplaner4.dfn.de/">DFN Terminplaner</v-btn>
      <v-btn href="http://www.conf.dfn.de/">DFN Konferenztelefonie</v-btn>
    </v-layout>
    <v-layout>
      <v-btn href="https://owncloud.fraunhofer.de">Fraunhofer-Cloud</v-btn>
      <v-btn href="http://intranet.intern.enas.fraunhofer.de">ENAS-Intranet</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['nodestatus', 'queuestatus'])
  }
}
</script>

<style scoped>
</style>
