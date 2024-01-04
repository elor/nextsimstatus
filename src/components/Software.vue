<template>
  <div>
    <h2>Werkzeuge für die Wissenschaft</h2>
    <v-container fluid>
      <v-layout wrap row>
        <SoftwareCard title="Gitlab" hidetitle>Lege deinen Quellcode ab, überwache deine Builds und tracke deine Bugs
        </SoftwareCard>

        <SoftwareCard title="Jupyter" hidetitle>Arbeite interaktiv mit Python an wissenschaftlichen Daten und visualisiere
          sie im Browser</SoftwareCard>

        <!--
        <SoftwareCard title="TUC-Wiki" href="https://wiki.tu-chemnitz.de/ENAS/BeolSimulation" src="foswiki">Tausche Wissen
          und Erfahrungen mit den anderen Simulanten aus</SoftwareCard>
        -->

        <SoftwareCard title="scholar" hidetitle href="https://scholar.google.com/">Suche nach Publikationen und Autoren
        </SoftwareCard>
      </v-layout>
    </v-container>

    <h2>TUC, DFN & Co.</h2>
    <v-container fluid>
      <v-layout wrap row>
        <SoftwareCard title="BigBlueButton" href="https://webroom.hrz.tu-chemnitz.de">Zuverlässige Videokonferenz- und
          Screensharing Lösung der Uni</SoftwareCard>

        <SoftwareCard usergroup="enas" title="ENAS-Intranet" src="enas" href="http://intranet.enas.fraunhofer.de">
          Für ENAS-Angestellte:
          <br />Suche Vorlagen, gesetzliche Regelungen und Formulare.
        </SoftwareCard>

        <SoftwareCard usergroup="enas" title="FhG-Intranet" src="fraunhofer" href="https://info.fraunhofer.de">
          Für Fraunhofer-Angestellte:
          <br />Das deutschlandweite Fraunhofer-Intranet. Für uns nur
          <b>via VPN</b> verfügbar.
        </SoftwareCard>

        <SoftwareCard title="Terminplaner" href="https://terminplaner4.dfn.de/">Stimme Termine ab - Doodle vom Deutschen
          Forschungsnetz</SoftwareCard>

        <SoftwareCard title="TUC-Cloud" href="https://tuc.cloud/">Tausche Dateien zwischen Geräten aus und teile sie mit
          Anderen</SoftwareCard>

        <SoftwareCard usergroup="enas" title="FhG-Cloud" src="owncloud" href="https://owncloud.fraunhofer.de/">Tausche
          Dateien zwischen Geräten aus und teile sie mit Anderen. Ist ständig kaputt.</SoftwareCard>

        <SoftwareCard title="MAIN-Webseite" src="tuc" href="https://www.tu-chemnitz.de/main/">Die offizielle Infoseite
          rund um unser MAIN-Gebäude</SoftwareCard>

        <SoftwareCard title="URZ IdM" href="https://idm.hrz.tu-chemnitz.de/" src="tuc">Verwalte deinen Nutzer-Ressourcen
          am Universitätsrechenzentrum</SoftwareCard>

        <SoftwareCard title="Click2Dial" href="https://voip-service.hrz.tu-chemnitz.de/service/dial.html" src="tuc">Wähle
          Rufnummern auf deinem Bürotelefon direkt über deinen Browser</SoftwareCard>
      </v-layout>
    </v-container>

    <h2>Administrationswerkzeuge</h2>
    <v-container fluid>
      <v-layout wrap row>
        <SoftwareCard title="Grafana" hidetitle href="https://mainsimweb.etit.tu-chemnitz.de/grafana">
          System-Monitorung und Zeitreihenanalyse.
          <br />Führt alle Sensordaten und Auslastungen zusammen
        </SoftwareCard>

        <SoftwareCard title="MainSimStatus" href="/">
          Überwache und steuere deine Rechnungen.
          <br />SimAdmins haben Superkräfte
        </SoftwareCard>

        <SoftwareCard title="xcat-doc" src="xcat" usergroup="simadmin">Dokumentation des XCAT-Clustermanagers (Manpages)
        </SoftwareCard>

        <SoftwareCard title="Ganglia" hidetitle usergroup="simadmin">
          Überwache CPU, RAM und Festplatten aller Rechenknoten.
          (deprecated)
        </SoftwareCard>

        <SoftwareCard title="Nagios" hidetitle usergroup="simadmin">Überwache den Systemzustand und die Daemons aller
          Knoten
          (deprecated)
        </SoftwareCard>
        <SoftwareCard title="GraphQL" usergroup="simadmin">Direktzugriff auf MainSimStatus-Datenbank</SoftwareCard>
      </v-layout>
    </v-container>

    <h2>Spielereien</h2>
    <v-container fluid>
      <v-layout wrap row>
        <SoftwareCard title="Periodyfier" href="/#/apps/periodyfier">Erstelle bunten Text aus Element-Symbolen
        </SoftwareCard>

        <SoftwareCard title="Vuetify" href="https://vuetifyjs.com/en/components/api-explorer" usergroup="simadmin">
          Direktlink zur Dokumentation des Frameworks, auf dem MainSimStatus basiert</SoftwareCard>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import SoftwareCard from '@/components/SoftwareCard'

export default {
  components: {
    SoftwareCard
  }
}
</script>

<style scoped></style>
