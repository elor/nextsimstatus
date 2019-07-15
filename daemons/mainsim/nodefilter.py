#!/usr/bin/env python

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


def filterfunc(job):
    newjob = {}
    for key in job:
        if key in ALLOWED and job[key]:
            try:
                newjob[key] = ALLOWED[key](job[key])
            except:
                newjob[key] = ALLOWED[key](0)
    return newjob


jobs = json.load(sys.stdin)
newdata = [filterfunc(job) for job in jobs]

json.dump(newdata, sys.stdout)
