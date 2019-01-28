export default [
  {
    title: "SimPC-Workstations",
    markdown: `
Unsere Workstations (SimPCs) teilen die Benutzer, Benutzerverzeichnisse und Gruppenverzeichnisse mit dem MainSim-Cluster.

Somit werden alle Nutzerdateien automatisch synchronisiert und in das tägliche Backup eingebunden.
`
  },
  {
    title: "VPN",
    markdown: `
Gelegentlich ist die Nutzung eines VPN-Zugangs nötig, um auf externe Ressourcen wie etwas andere Forschungsinstitute zugreifen zu können.

Zu diesen Zweck ist auf den SimPCs der Cisco Anyconnect-Client installiert.
Somit könnt ihr auf die VPN-Endpoints von Fraunhofer, TU Chemnitz, und vielen weiteren Einrichtungen zugreifen.

Anleitung:
1. Startet \`anyconnect\` in einem Terminal
2. Gebt euren Endpoint ein (Beispiel: \`remote.fraunhofer.de\`)
3. Öffnet die Einstellungen und aktiviert "**Alloc local LAN**" - ansonsten blockiert euer SimPC!
4. Drückt "Verbinden", wählt eure Gruppe und gebt Benutzername und Passwort ein
5. Auch, wenn ihr das Anyconnect-Fenster schließt, bleibt die Verbindung im Hintergrund bestehen.

Zum Beenden der VPN-Verbindung müsst ihr Anyconnect öffnen und auf "Disconnect" drücken.

`
  }
];
