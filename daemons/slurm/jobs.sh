#!/bin/bash

set -e -u

jobs=$(scontrol show jobs --oneliner)

grep "No jobs" <<< "$jobs" &>/dev/null && { echo '[]'; exit 0; }

perl -pe 's/(\S+)=(.*?)(?= \S+=|$)/"\1": "\2", /g'  <<< "$jobs" \
    | sed -r -e 's/^(.+),\s*$/{\1},/' -e '1s/^/[/' -e '$s/},$/}]/' \
    | ./jobfilter.py
