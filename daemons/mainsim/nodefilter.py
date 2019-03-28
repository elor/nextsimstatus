#!/usr/bin/env python

import json
import sys

allowed = [
    "NodeName",
    "Arch",
    "CoresPerSocket",
    "CPUAlloc",
    "CPUErr",
    "CPUTot",
    "CPULoad",
    "Gres",
    "NodeAddr",
    "NodeHostName",
    "Version",
    "OS",
    "RealMemory",
    "AllocMem",
    "FreeMem",
    "Sockets",
    "Boards",
    "State",
    "ThreadsPerCore",
    "Weight",
    "Partitions",
    "BootTime",
    "SlurmdStartTime",
    "CfgTRES",
    "AllocTRES"
]


def filterfunc(job):
    newjob = {}
    for key in job:
        if key in allowed and job[key]:
            newjob[key] = job[key]
    return newjob


jobs = json.load(sys.stdin)
newdata = [filterfunc(job) for job in jobs]

json.dump(newdata, sys.stdout)
