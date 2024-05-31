#!/usr/bin/python3

import json
import sys

ALLOWED = {
    "NodeName": str,
    "Arch": str,
    "CoresPerSocket": int,
    "CPUAlloc": int,
    "CPUErr": int,
    "CPUTot": int,
    "CPULoad": float,
    "Gres": str,
    "NodeAddr": str,
    "NodeHostName": str,
    "Version": str,
    "OS": str,
    "Reason": str,
    "RealMemory": int,
    "AllocMem": int,
    "FreeMem": int,
    "Sockets": int,
    "Boards": int,
    "State": str,
    "ThreadsPerCore": int,
    "Weight": int,
    "Partitions": str,
    "BootTime": str,
    "SlurmdStartTime": str,
    "CfgTRES": str,
    "AllocTRES": str
}


def filterfunc(node):
    newnode = {}
    for key in node:
        if key in ALLOWED and node[key]:
            try:
                newnode[key] = ALLOWED[key](node[key])
            except:
                newnode[key] = ALLOWED[key](0)
    return newnode


nodes = json.load(sys.stdin)
newdata = [filterfunc(node) for node in nodes if node['NodeName'] != 'nextsim']

json.dump(newdata, sys.stdout)
