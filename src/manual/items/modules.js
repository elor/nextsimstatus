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
}];
