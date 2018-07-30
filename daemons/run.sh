#!/bin/bash

set -e -u

cd "$(dirname $(readlink -f "$0"))"

screen -dmS nodes ./mainsim-daemon.sh nodes mymqtt
screen -dmS jobs ./mainsim-daemon.sh jobs mymqtt

