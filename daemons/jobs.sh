#!/bin/bash

set -e -u

jobs=$(scontrol show jobs --oneliner)

grep "No jobs" <<< "$jobs" &>/dev/null && { echo '[]'; exit 0; }

sed -e 's/\(\S\+\)=\(\S*\)/"\1": "\2",/g' -e 's/^\(.\+\),\s*$/{\1},/' -e '1s/^/[/' -e '$s/},$/}]/' <<< "$jobs"

