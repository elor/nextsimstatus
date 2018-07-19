<template>
  <v-container fluid>
    <v-expansion-panel v-model="panel"
                       expand
                       inset
                       focusable>

      <v-expansion-panel-content>
        <h3 slot="header">Über diese Anleitung</h3>
        <v-card>
          <v-card-text>
            Diese Seite stellt eine kleine Sammlung von Kurzanleitungen für den Umgang mit dem MainSim-Cluster dar.
            <br>
            Gewünschtes Thema bitte einfach per Klick ausklappen.
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>

      <v-expansion-panel-content>
        <h3 slot="header">Nutzer, Gruppen und Passwörter</h3>
        <v-card>
          <v-card-text>
            <p>
              Der <b>Nutzername</b> (Username, Login, ...) setzt sich aus dem Initialen des Rufnamen und dem vollständigen Nachnamen zusammen:
              <ul>
                <li><b>e.lorenz</b> für Erik E. Lorenz</li>
                <li><b>s.gemming</b> für Prof. Sibylle Gemming</li>
                <li>...</li>
              </ul>
              Er gilt für die SimPCs und den MainSim-Cluster, inklusive der Software (Chat, GitLab, MainSimStatus).
            </p>
            <p>
              Neben seiner eigenen <b>Gruppe</b> ist jeder Nutzer noch Mitglied seiner Ordnungseinheit 
              - <code>enas</code>, <code>simpc</code>, <code>mmt</code>, etc.
              Darüber erhält er Zugriff auf die Austauschverzeichnisse der jeweiligen Ordnungseinheit.
              Mehr dazu unten.
            </p>
            <p>
              Das <b>Passwort</b> wird beim Erstellen eures Nutzers erstmalig gesetzt.
              Ihr könnt euer Passwort jederzeit an jedem simpc sowie auf mainsim.etit.tu-chemnitz.de mit dem Befehl <code>passwd</code> zurücksetzen.
              Wenn ihr euer Passwort mal vergessen habt, können die MainSim-Admins es zurück setzen.
              Sag ihnen einfach, dass sie es per <i>Apache Directory Studio</i> ändern müssen.
            </p>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>

      <v-expansion-panel-content>
        <h3 slot="header">Nutzerverzeichnisse und Austauschverzeichnisse</h3>
        <v-card>
          <v-card-text>
            <p>
              Die <b>Nutzerverzeichnisse</b> liegen unter <code>/beegfs-home/users/{Nutzer}</code>.
              Sie stehen nur dem jeweiligen Nutzer zur Verfügung, stehen aber auf allen SimPCs und dem gesamten Cluster zur Verfügung.
            </p>
            <p>
              Die <b>Austauschverzeichnisse</b> findet ihr unter <code>/beegfs-home/share/{Gruppe}</code>.
              Hier können Nutzer der gleichen Gruppen Dateien austauschen und gemeinsam bearbeiten.
              <br>
              Sollten Dateien einmal nicht von den Anderen lesbar sein, wurden sie wahrscheinlich in den Austauschordner verschoben, nicht kopiert.
              Einfach 
            </p>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>

    </v-expansion-panel>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      panel: [true, false, true]
    };
  },
  computed: {}
};
</script>
