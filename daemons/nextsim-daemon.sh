#!/bin/bash

set -e -u

cd "$(dirname "$0")"

if ((${#@} != 1)) && ((${#@} != 2)); then
	cat <<EOF >&2
Syntax: $(basename "$0") <DATASET> [MQTT password]

Where DATASET can be "nodes" or "jobs"
EOF
	exit 1
fi

function renew_tokens() {
	:
}

echo "Running as $(whoami)"
host=nextsimstatus.etit.tu-chemnitz.de
dataset="$1"
mqtt_password=""
kinit_password=""
if ((${#@} == 2)); then
	secrets_file="$2"
	if [ -s "$secrets_file" ]; then
		mqtt_password=$(jq -r .mqtt "$secrets_file")
		kinit_password=$(jq -r .kinit "$secrets_file")
	fi
else
	secrets_file=""
fi

runfile=""
topic=""
interval=10
case "$dataset" in
jobs | nodes)
	runfile="./slurm/$dataset.sh"
	topic="slurm/$dataset"
	interval=1
	hard_interval=0
	;;
racks) # unused on nextsim, need to plug cables into the PSU
	runfile="./racks/rackstatus.py"
	topic="racks/$dataset"
	interval=60
	hard_interval=0
	;;
quota)
	runfile="./lustre/quota.py"
	topic="lustre/quota"
	interval=60
	hard_interval=120

	function renew_tokens() {
		echo "renewing kinit token"
		klist -s || kinit >/dev/null <<<"$kinit_password"
	}
	;;
usernames)
	runfile="./usernames/usernames.sh"
	topic="usernames"
	interval=60
	hard_interval=120

	function renew_tokens() {
		echo "renewing kinit token"
		klist -s || kinit >/dev/null <<<"$kinit_password"
	}
	secrets_file=""
	;;
*)
	echo "DATASET must be one of 'nodes', 'jobs', 'racks' or 'quota', not \"$dataset\"" >&2
	exit 1
	;;
esac

mqtt_user=mqtt

while [ -z "$mqtt_password" ]; do
	read -rsp "password for $mqtt_user@$host: " mqtt_password
	echo
	[ -z "$mqtt_password" ] && {
		echo "you must provide a password to the mqtt host"
		exit 1
	}
done

old_data=""
last_data=0

while true; do
	renew_tokens
	data_json="$($runfile "$secrets_file" | gzip -c | base64)"

	now=$(date +%s)

	if ([ "$data_json" != "$old_data" ] && ((now != last_data))) || ((now >= last_data + interval)); then
		mosquitto_pub -h "$host" -u "$mqtt_user" -P "$mqtt_password" -q 0 -t "$topic" -s <<EOF
$data_json
EOF
		old_data="$data_json"
		last_data=$now
		echo "$dataset $(date) $(wc -c <<<"$data_json")B"
	fi

	if ((hard_interval > 0)); then
		sleep $((last_data + hard_interval - now))
	fi
done
