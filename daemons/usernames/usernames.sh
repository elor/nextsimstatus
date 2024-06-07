#!/bin/bash
cat <<EOF | jq 'to_entries | map_values({key: .key, value: {Login: .key, FullName: .value}}) | from_entries'
{
$(/usr/local/sbin/nextsim user names | sed -e 's/^\(\S\+\) \(.*\)$/"\1": "\2",/')
"_":"_" }
EOF
