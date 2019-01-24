#!/bin/bash

set -e -u

filter() {
  python -c 'import sys, json; arr=[[line.strip().split(":") for line in set.split("\n") if line] for set in sys.stdin.read().split("\n\n\n\n") if set]; arr=[[[v[0],":".join(v[1:]).strip()] for v in set] for set in arr]; json.dump({"data":[dict(set) for set in arr]}, sys.stdout)'
}

host=simstorage2
sudo ssh $host /opt/MegaRAID/MegaCli/MegaCli64 -PdList -aALL | filter

