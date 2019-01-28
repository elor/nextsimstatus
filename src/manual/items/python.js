export default [{
  title: 'Python auf dem Cluster',
  markdown: `
Python ist in drei Varianten auf dem Cluster installiert:
* Python 2, nativ (\`/usr/bin/python\`)
* Python 2, als module (Anaconda2): \`module load python2\`
* Python 3, als module (Anaconda3): \`module load python3\`

Die Anaconda-Installationen beinhalten eine große Bandbreite an wissenschaftlichen Paketen.
Wenn euch noch Python-Pakete fehlen, könnt ihr sie selbst für euren Nutzer installieren:
* \`pip2 install --user mypackage\` für python2
* \`pip3 install --user mypackage\` für python3

Um Python-Pakete in ein bestimmtes Verzeichnis zu installieren, könnt ihr die Option \`-t meinverzeichnis\` an pip, pip2 und pip3 übergeben.

Wenn wichtige Python-Pakete in den Anaconda-Installationen fehlen, die von vielen Nutzern benutzt werden, dann wendet euch bitte an einen Administrator.
Er kann die Pakete mittels \`conda\` in die Module-Verzeichnisse installieren.
`
}]
