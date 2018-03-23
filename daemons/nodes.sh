#!/bin/bash

scontrol show node --oneliner | sed -e 's/\(\S\+\)=\(\S*\)/"\1": "\2",/g' -e 's/^\(.\+\),\s*$/{\1},/' -e '1s/^/[/' -e '$s/},$/}]/'

