export default [{
  title: "Python auf dem Cluster",
  markdown: `
\`python2\` ist auf dem Cluster installiert.\
Ein Environment Module muss dafür nicht geladen werden.

Nicht alle Python-Module sind auf den Knoten vorinstalliert.
Nutzer können stattdessen die gewünschten Module per \`pip\` in ihr Homeverzeichnis installieren:

    pip install --user numpy scipy matplotlib

Damit ist auch garantiert, dass immer die vom Nutzer gewünschte Version installiert ist und es keine plötzlichen Probleme mit Updates gibt.

\`python3\` und \`pip3\` müssen noch auf dem Cluster installiert werden.\
Bei dringendem Bedarf bitte an den Admin wenden.
`
}];
