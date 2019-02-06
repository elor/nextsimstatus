export default [
  {
    title: 'Linux-Workstations - "SimPCs"',
    markdown: `
Unsere Linux-Workstations (SimPCs) sind eng mit dem MainSim-Cluster verzahnt.
Mit ihm teilen sie sich die Benutzer, Passwörter, Netzlaufwerke und Simulationssoftware.

Damit ist ein nahtloses Arbeiten zwischen SimPCs und MainSim möglich.

Außerdem verfügen die SimPCs über eine umfassende Softwareinstallation für das Vorbereiten, Visualisieren und Auswerten von Simulationen.
Nicht-parallele Rechnungen sind durch die schnellen Intel i7-7700-CPUs sogar schneller als auf dem MainSim-Cluster.
Ihre eingebauten Nvidia GTX 1050Ti-Grafikkarten ermöglichen zudem hochparalleles Grafikkarten-Rechnen, sollten unsere GPU-Rechenknoten einmal voll oder die zu simulierenden Systeme klein sein.

Testrechnungen sind auf den SimPCs auszuführen, **nicht** auf dem MainSim-Headnode (mainsim.etit.tu-chemnitz.de)
`
  },
  {
    title: 'VPN auf dem SimPCs',
    markdown: `
Gelegentlich ist die Nutzung eines [VPN-Zugangs](https://www.tu-chemnitz.de/urz/network/access/vpn.html) nötig, um auf externe Ressourcen wie etwas andere Forschungsinstitute zugreifen zu können.

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
]
