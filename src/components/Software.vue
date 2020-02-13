<template>
  <v-container fluid>
    <h2>Werkzeuge für die Wissenschaft</h2>
    <v-layout wrap row>
      <SoftwareCard
        title="scholar"
        hidetitle
        href="https://scholar.google.com/"
      >Suche nach Publikationen und Autoren</SoftwareCard>
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
        title="TUC-Wiki"
        href="https://wiki.tu-chemnitz.de/"
        src="foswiki"
      >Tausche Wissen und Erfahrungen mit den anderen Simulanten aus</SoftwareCard>
    </v-layout>

    <h2>TUC, DFN & Co.</h2>
    <v-layout wrap row>
      <SoftwareCard
        usergroup="enas"
        title="ENAS-Intranet"
        src="enas"
        href="http://intranet.enas.fraunhofer.de"
      >
        Für ENAS-Angestellte:
        <br />Suche Vorlagen, gesetzliche Regelungen und Formulare.
      </SoftwareCard>

      <SoftwareCard
        usergroup="enas"
        title="FhG-Intranet"
        src="fraunhofer"
        href="https://info.fraunhofer.de"
      >
        Für Fraunhofer-Angestellte:
        <br />Das deutschlandweite Fraunhofer-Intranet. Für uns nur
        <b>via VPN</b> verfügbar.
      </SoftwareCard>

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
        usergroup="enas"
        title="FhG-Cloud"
        src="owncloud"
      >Tausche Dateien zwischen Geräten aus und teile sie mit Anderen. Ist ständig kaputt.</SoftwareCard>

      <SoftwareCard
        title="MAIN-Webseite"
        src="tuc"
        href="https://www.tu-chemnitz.de/main/"
      >Die offizielle Infoseite rund um unser MAIN-Gebäude</SoftwareCard>

      <SoftwareCard
        title="URZ IdM"
        href="https://idm.hrz.tu-chemnitz.de/"
        src="tuc"
      >Verwalte deinen Nutzer-Ressourcen am Universitätsrechenzentrum</SoftwareCard>

      <SoftwareCard
        title="Click2Dial"
        href="https://voip-service.hrz.tu-chemnitz.de/service/dial.html"
        src="tuc"
      >Wähle Rufnummern auf deinem Bürotelefon direkt über deinen Browser</SoftwareCard>
    </v-layout>

    <h2>Administrationswerkzeuge</h2>
    <v-layout wrap row>
      <SoftwareCard title="MainSimStatus" href="/">
        Überwache und steuere deine Rechnungen.
        <br />SimAdmins haben Superkräfte
      </SoftwareCard>

      <SoftwareCard title="Ganglia" hidetitle>Überwache CPU, RAM und Festplatten aller Rechenknoten</SoftwareCard>

      <SoftwareCard
        title="xcat-doc"
        src="xcat"
        usergroup="simadmin"
      >Dokumentation des XCAT-Clustermanagers (Manpages)</SoftwareCard>

      <SoftwareCard
        title="Nagios"
        hidetitle
        usergroup="simadmin"
      >Überwache den Systemzustand und die Daemons aller Knoten</SoftwareCard>
      <SoftwareCard title="GraphQL" usergroup="simadmin">Direktzugriff auf MainSimStatus-Datenbank</SoftwareCard>
    </v-layout>

    <h2>Spielereien</h2>
    <v-layout wrap row>
      <SoftwareCard
        title="Periodyfier"
        href="/#/apps/periodyfier"
      >Erstelle bunten Text aus Element-Symbolen</SoftwareCard>

      <SoftwareCard
        title="Vuetify"
        href="https://vuetifyjs.com/en/components/api-explorer"
        usergroup="simadmin"
      >Direktlink zur Dokumentation des Frameworks, auf dem MainSimStatus basiert</SoftwareCard>

      <SoftwareCard
        title="Deine Ergänzung"
        href="https://mainsim.etit.tu-chemnitz.de:4485/simadmin/mainsimstatus/blob/master/src/components/Software.vue"
        src="simcrew"
      >Du vermisst etwas? Dann füge deinen Beitrag hinzu</SoftwareCard>
    </v-layout>
  </v-container>
</template>

<script>
import SoftwareCard from '@/components/SoftwareCard'

export default {
  components: {
    SoftwareCard
  }
}
</script>

<style scoped>
</style>
