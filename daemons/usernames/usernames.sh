#!/bin/bash
cat <<EOF
{
$(/usr/local/sbin/nextsim user names | sed -e 's/^\(\S\+\) \(.*\)$/"\1": "\2",/')
"_":"_" }
EOF
