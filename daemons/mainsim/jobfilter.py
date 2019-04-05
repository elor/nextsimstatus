#!/usr/bin/env python

import json
import sys

ALLOWED = {
    "NodeList": str,
    "JobName": str,
    "EndTime": str,
    "NumTasks": int,
    "JobState": str,
    "SubmitTime": str,
    "NumNodes": str,
    "UserId": str,
    "JobId": int,
    "Reason": str,
    "NumCPUs": int,
    "WorkDir": str,
    "Gres": str,
    "Partition": str,
    "Dependency": str,
    "Command": str,
    "ArrayJobId": int,
    "ArrayTaskId": str,
    "EligibleTime": str,
    "TimeLimit": str,
    "StartTime": str,
    "BatchHost": str,
    "Licenses": str,
    "RunTime": str,
    "CPUs/Task": str,
    "ExitCode": str,
    "Features": str
}


def filterfunc(job):
    newjob = {}
    for key in job:
        if key in ALLOWED and job[key]:
            newjob[key] = ALLOWED[key](job[key])
    return newjob


jobs = json.load(sys.stdin)
newdata = [filterfunc(job) for job in jobs]

json.dump(newdata, sys.stdout)
