export default [{
  title: "Python auf dem Cluster",
  markdown: `
Sowohl \`python2\` als auch \`python3\` sind auf dem Cluster installiert.\
Ein Environment Module muss dafür nicht geladen werden.

Nicht alle Python-Module sind auf den Knoten vorinstalliert.
Nutzer können stattdessen die gewünschten Module per \`pip\` in ihr Homeverzeichnis installieren:

    pip install --user numpy scipy matplotlib

Damit ist auch garantiert, dass immer die vom Nutzer gewünschte Version installiert ist und es keine plötzlichen Probleme mit Updates gibt.

Für \`python3\` muss \`pip3\` verwendet werden.
`
}];
