<template>
  <v-container fluid>
    <h2>Werkzeuge für die Wissenschaft</h2>
    <v-layout wrap row>
      <SoftwareCard
        title="Gitlab"
        hidetitle
      >Lege deinen Quellcode ab, überwache deine Builds und tracke deine Bugs</SoftwareCard>

      <SoftwareCard
        title="Jupyter"
        hidetitle
      >Arbeite interaktiv mit Python an wissenschaftlichen Daten und visualisiere sie im Browser</SoftwareCard>

      <SoftwareCard
        title="CKAN"
        hidetitle
      >Lege Forschungsdaten ab, suche nach Dateien, ordne sie Projekten zu und teile sie mit anderen.</SoftwareCard>

      <SoftwareCard
        title="Periodyfier"
        href="/#/apps/periodyfier"
      >Erstelle bunten Text aus Element-Symbolen</SoftwareCard>
    </v-layout>

    <h2>TUC, DFN, FhG & Co.</h2>
    <v-layout wrap row>
      <SoftwareCard
        title="Terminplaner"
        href="https://terminplaner4.dfn.de/"
      >Stimme Termine ab - Doodle vom Deutschen Forschungsnetz</SoftwareCard>
      <SoftwareCard
        title="dfnconf"
        hidetitle
        href="http://www.conf.dfn.de/"
      >DFN Konferenztelefonie - Der Konferenzdienst im Deutschen Forschungsnetz</SoftwareCard>

      <SoftwareCard title="TUC-Cloud">Tausche Dateien zwischen Geräten aus und teile sie mit Anderen</SoftwareCard>
      <SoftwareCard
        title="FhG-Cloud"
        src="owncloud"
      >Tausche Dateien zwischen Geräten aus und teile sie mit Anderen. Ist ständig kaputt.</SoftwareCard>

      <SoftwareCard
        title="MAIN-Webseite"
        href="https://www.tu-chemnitz.de/main/"
      >Die offizielle Infoseite rund um unser MAIN-Gebäude</SoftwareCard>

      <SoftwareCard title="ENAS-Intranet" src="enas" href="http://intranet.enas.fraunhofer.de">
        Für ENAS-Angestellte:
        <br />Suche Vorlagen, gesetzliche Regelungen und Formulare.
      </SoftwareCard>
    </v-layout>

    <h2>Administrationswerkzeuge</h2>
    <v-layout wrap row>
      <SoftwareCard title="MainSimStatus" href="/">
        Überwache und steuere deine Rechnungen.
        <br />SimAdmins haben Superkräfte
      </SoftwareCard>

      <SoftwareCard title="Ganglia" hidetitle>Überwache CPU, RAM und Festplatten aller Rechenknoten</SoftwareCard>

      <SoftwareCard title="xcat-doc" src="xcat">Dokumentation des XCAT-Clustermanagers (Manpages)</SoftwareCard>

      <SoftwareCard
        title="Nagios"
        hidetitle
      >Überwache den Systemzustand und die Daemons aller Knoten</SoftwareCard>
      <SoftwareCard title="GraphQL">Direktzugriff auf MainSimStatus-Datenbank</SoftwareCard>
    </v-layout>
  </v-container>
</template>

<script>
import SoftwareCard from '@/components/SoftwareCard'

import { mapGetters } from 'vuex'

export default {
  components: {
    SoftwareCard
  },
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
