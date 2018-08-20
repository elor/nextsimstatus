#!/bin/bash

set -e -u

cd "$(dirname "$0")"

if (( ${#@} != 1 )) && (( ${#@} != 2 )); then
    cat <<EOF >&2
Syntax: $(basename "$0") <DATASET> [MQTT password]

Where DATASET can be "nodes" or "jobs"
EOF
    exit 1
fi

host=mainsimweb.etit.tu-chemnitz.de
dataset="$1"
mqtt_password=""
if (( ${#@} == 2 )); then
    mqtt_password="$2"
    if [ -s "$mqtt_password" ]; then
        mqtt_password=$(cat "$mqtt_password")
    fi
fi

case "$dataset" in
    jobs|nodes)
        ;;
    *)
        echo "DATASET must be one of \"nodes\" or \"jobs\", not \"$dataset\"" >&2
        exit 1
        ;;
esac

mqtt_user=mqtt

while [ -z "$mqtt_password" ]; do
    read -sp "password for $mqtt_user@$host: " mqtt_password
    echo
    [ -z "$mqtt_password" ] && { echo "you must provide a password to the mqtt host"; exit 1; }
done

old_data=""
last_data=0
interval=1

while true; do
    data_json="$(./slurm/$dataset.sh | gzip -c | base64)"

    now=$(date +%s)

    if ( [ "$data_json" != "$old_data" ] && (( now != last_data )) ) || (( now >= last_data + interval )); then
        mosquitto_pub -h "$host" -u "$mqtt_user" -P "$mqtt_password" -q 0 -t "slurm/$dataset" -s << EOF
$data_json
EOF
        old_data="$data_json"
        last_data=$now
        echo "$dataset $(date) $(wc -c <<< "$data_json")B"
    fi
done

