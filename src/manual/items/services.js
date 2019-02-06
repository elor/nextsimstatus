export default [
  {
    title: 'Drucken im MAIN-Gebäude',
    markdown: `
**Studenten** steht in der C50.239 ("Schulungsraum") ein Drucker der Professur Skalenmodellierung (Prof. Gemming) zur Verfügung.
Dieser kann über die Linux-Druckdialoge ausgewählt werden: \`HP_Color_LaserJet_M552_C3C6BC_\`.
Die Installation durch einen Administrator ist nicht notwendig.

Im Netzwerk existieren noch weitere Drucker mit ähnlichen Namen.
Verwechslungen bitte vermeiden.

Für **Mitarbeiter** stehen die Etagendrucker zur Verfügung.
Auf diesen kann man sich direkt mit seiner TUC-Card oder seinem TUC-Nutzerkürzel anmelden.

Zur Nutzung der Etagendrucker ist die
[Einrichtung des PaperCut-Clients](https://www.tu-chemnitz.de/urz/mfp/papercut.html#papercutclient)
erforderlich.
Über den PaperCut-Client erfolgt auch die Anmeldung.

Alternativ kann man Dokumente auch direkt über die [PaperCut-Weboberfläche](https://pcserver.hrz.tu-chemnitz.de/user) zum Drucker schicken.
`
  },
  {
    title: 'Windows-Netzlaufwerke',
    markdown: `
Der Cluster kann zum Austausch von Dateien auch direkt als Netzlaufwerk in Windows eingebunden werden.
Der Windows-PC muss dafür im Uninetz sein (Kabelverbindung,
[eduroam](https://www.tu-chemnitz.de/urz/network/access/wlan.html) oder
[VPN](https://www.tu-chemnitz.de/urz/network/access/vpn.html)).

Für die Nutzung der Netzlaufwerke ist zuvor eine Freigabe des Benutzers bei einem SimAdmin notwendig.

Dieser muss (in dieser Reihenfolge):
* sicherstellen, dass der Nutzer in der \`users\`-Gruppe ist (Hinzufügen zur Gruppe per LDAP)
* dem Nutzer per \`sudo smbpasswd -a <Nutzer>\` ein Samba-Passwort auf dem MainSim einrichtet.


Danach kann der Benutzer die Verbindung testen, indem er im Windows Explorer (Dateimanager) die Adresse 
\`\\\\mainsim.etit.tu-chemnitz.de\\\`
 öffnet.
und sich als \`MAINSIM\\<Nutzer>\` mit dem eben eingerichteten Passwort anmeldet.
`
  }
]
