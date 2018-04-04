#!/bin/bash

set -e -u

cd "$(dirname "$0")"

host=mainsimweb.etit.tu-chemnitz.de

echo "preparing to connect to mqtt host $host"
read -p "mqtt user [mqtt]: " mqtt_user
read -sp "mqtt password: " mqtt_password
echo

[ -z "$mqtt_user" ] && mqtt_user=mqtt
[ -z "$mqtt_password" ] && { echo "you must provide a password to the mqtt host"; exit 1; }

old_nodes=""
old_jobs=""
last_jobs=0
last_nodes=0
interval=1

while true; do
    nodes_json="$(./slurm/nodes.sh)"
    jobs_json="$(./slurm/jobs.sh)"

    now=$(date +%s)

    if [ "$nodes_json" != "$old_nodes" ] || (( now >= last_nodes + interval )); then
        mosquitto_pub -h "$host" -u "$mqtt_user" -P "$mqtt_password" -t "slurm/nodes" -s << EOF
$nodes_json
EOF
        old_nodes="$nodes_json"
        last_nodes=$now
        echo "nodes $(date)"
    fi

    if [ "$jobs_json" != "$old_jobs" ] || (( now >= last_jobs + interval)); then
        mosquitto_pub -h "$host" -u "$mqtt_user" -P "$mqtt_password" -t "slurm/jobs" -s << EOF
$jobs_json
EOF
        old_jobs="$jobs_json"
        last_jobs=$now
        echo "jobs $(date)"
    fi

done

