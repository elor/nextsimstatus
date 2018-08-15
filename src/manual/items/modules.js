export default [{
  title: "Environment Modules",
  markdown: `
Die meiste Simulationssoftware ist als Environment Module nutzbar.\
Das ermöglicht eine komfortable Installation mehrerer Versionen und Varianten derselben Software.
Dabei wird dem Nutzer die Wahl überlassen, welche Version er nutzen möchte.

Eine Liste der verfügbaren Pakete erhältst du mit den Befehlen \`module avail\` sowie \`module spider\`.

Module kannst du mit \`module load {module}\` laden, z.B. \`module load lammps/latest/serial\`.\\
Dann kannst du die darüber geladene Software direkt nutzen.

Mehr erfährst du über \`module --help\` sowie \`man module\`.
`
}, {
  title: "Gruppeneigene Modules",
  markdown: `
Du kannst eigene Software gezielt für dich oder deine Gruppe als Module installieren.
Dafür musst du eine Modulefile erstellen und in dem entsprechenden \`modulefiles\`-Verzeichnis ablegen.

Schau dir für einen Überblick, am besten \`/beegfs-home/modules/modulefiles\` an und vergleiche es mit dem Output von \`module spider\` und \`module avail\`.

Die gruppeneigenen Modules sind in den Austauschverzeichnissen der Nutzergruppen in den vorhandenen \`modules\`-Ordner zu installieren.
Um sie nach der Installation zu nutzen, füge deiner \`.bashrc\`-Datei in deinem Home-Verzeichnis folgende Zeile hinzu:

    module use /beegfs-home/share/{Gruppe}/modules/modulefiles

    z.B.
    module use /beegfs-home/share/skalmod/modules/modulefiles

Auf diese Art kannst du auch nutzereigene Modules erstellen.
`
}];
