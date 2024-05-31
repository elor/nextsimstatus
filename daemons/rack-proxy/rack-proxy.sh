#!/bin/bash

set -e -u

# Set the variables for the source and destination brokers
SOURCE_BROKER="mainsimweb.etit.tu-chemnitz.de"
DEST_BROKER="nextsimstatus.etit.tu-chemnitz.de"

if ((${#@} == 2)); then
	secrets_file="$2"
	if [ -s "$secrets_file" ]; then
		mqtt_password=$(jq -r .mqtt "$secrets_file")
	fi
else
	echo "no secrets file given. Must specify it as the second (and only) argument to rack-proxy.sh"
	exit 1
fi

# Subscribe to all topics under "rack/#" from the source broker
while true; do
	mosquitto_sub -C 1 -h $SOURCE_BROKER -t racks/racks | mosquitto_pub -h $DEST_BROKER -t racks/racks -u mqtt -P "$mqtt_password" -s
	date
done
