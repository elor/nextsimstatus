export default [{
  active: true,
  title: 'Erste Schritte',
  markdown: `
### Willkommen auf dem MainSim-Cluster
Hier findest du Anleitungen und Hilfestellungen im Umgang mit dem MainSim-Cluster.
Gewünschtes Thema einfach per Klick ausklappen.
Bitte auch die Suchfunktion benutzen.

### Erste Schritte

1. #### Anmeldung per SSH
   \`ssh {Nutzer}@mainsim.etit.tu-chemnitz.de\` unter Linux / Unix / MacOS\\
   Der Cluster ist innerhalb der TU Chemnitz erreichbar.\\
   Unter Windows könnt ihr mit [putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) oder [Git for Windows](https://gitforwindows.org/) eine SSH-Verbindung herzustellen.

2. #### Passwort ändern
   \`passwd\` auf MainSim ausführen\\
   Das Passwort sollte unverzüglich nach der ersten Anmeldung geändert werden.

3. #### Mit dem Cluster vertraut machen
   Lies dir diese Anleitung durch und suche nach den für dich relevanten Themen.
`
},

{
  title: 'Nutzer, Gruppen und Passwörter',
  markdown: `
Der **Nutzername** (Username, Login, ...) setzt sich aus dem Initialen des Rufnamen und dem vollständigen Nachnamen zusammen:

* **e.lorenz** für Erik E. Lorenz
* **s.gemming** für Prof. Sibylle Gemming
* ...

Er gilt für die SimPCs und den MainSim-Cluster, inklusive der Software (Chat, GitLab, MainSimStatus).

Neben seiner eigenen **Gruppe** ist jeder Nutzer noch Mitglied seiner Ordnungseinheit \`enas\`, \`simpc\`, \`mmt\`, etc.
Darüber erhält er Zugriff auf die Austauschverzeichnisse der jeweiligen Ordnungseinheit.
Mehr dazu unten. 

Das **Passwort** wird beim Erstellen eures Nutzers erstmalig gesetzt.\\
Ihr könnt euer Passwort jederzeit auf mainsim.etit.tu-chemnitz.de mit dem Befehl \`passwd\` zurücksetzen.
Wenn ihr euer Passwort mal vergessen habt, können es die MainSim-Admins zurücksetzen.
Sag ihnen einfach, dass sie es per *Apache Directory Studio* ändern müssen.
`
},

{
  title: 'Nutzerverzeichnisse und Austauschverzeichnisse',
  markdown: `
Die **Nutzerverzeichnisse** liegen unter \`/beegfs-home/users/{Nutzer}\`\\
Sie sind nur vom jeweiligen Nutzer einsehbar, stehen aber auf allen SimPCs und dem gesamten Cluster zur Verfügung.

Die **Austauschverzeichnisse** findet ihr unter \`/beegfs-home/share/{Gruppe}\`\\
Hier können Nutzer der gleichen Gruppen Dateien austauschen und gemeinsam bearbeiten.\\
Sollten Dateien einmal nicht von den Anderen lesbar sein, wurden sie wahrscheinlich in den Austauschordner verschoben, nicht kopiert.
In diesem Fall einfach die Dateien und Order nochmal *kopieren*, dann übernehmen sie die Zugriffsrechte des Austauschordners.
`
},

{
  title: 'Tägliches Backup',
  markdown: `
Es werden automatisch jede Nacht **Backups** aller Nutzerverzeichnisse und Austauschverzeichnisse unter \`/beegfs-home\` angelegt.

Die meisten Backups werden nach einer bestimmten Zeit automatisch wieder gelöscht.
Diese Aufbewahrungszeit unterscheidet sich für tägliche, wöchentliche (sonntägliche) und monatliche (1. des Monats) Backups, und umfasst in der Regel mehr als vier Zyklen.
Jährliche Backups (1. Januar) werden unbegrenzt aufgehoben.

Die Backups sind in der Regel auf \`mainsim.etit.tu-chemnitz.de\` unter \`beegfs-home/backup\` eingebunden.\\
Von dort könnt ihr verloren gedachte Dateien wieder in eure Ordner kopieren.

Temporäre Dateien und Caches sind vom Backup ausgeschlossen, um Platz zu sparen.\\
Ihr könnt Ordner auch selbst Backup ausschließen:
Dazu erstellt ihr Ordner namens \`NOBACKUP\`, oder der mit \`-NOBACKUP\` endet.
Alle darin enthaltenen Dateien werden nicht kopiert.

Ebenso werden alle Dateien und Verzeichnisse, die mit \`~\` enden, vom Backup ausgeschlossen, z.B. \`intermediate_results~\`, \`cache~\`, \`bigfile.txt~\`.
`
}
]
