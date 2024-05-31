#!/bin/bash

# Set the variables for the source and destination brokers
SOURCE_BROKER="mainsimweb.etit.tu-chemnitz.de"
DEST_BROKER="nextsimstatus.etit.tu-chemnitz.de"

# Subscribe to all topics under "rack/#" from the source broker
mosquitto_sub -h $SOURCE_BROKER -t "racks/racks" | xargs -n1 mosquitto_pub -h $DEST_BROKER -t "racks/racks" -u mqtt -P mymqtt -m
