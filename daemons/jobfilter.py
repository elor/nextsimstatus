#!/usr/bin/env python

import json
import sys

allowed = [
    "Account",
    "ArrayJobId",
    "ArrayTaskId",
    "BatchFlag",
    "BatchHost",
    "Command",
    "Contiguous",
    "CPUs/Task",
    "Dependency",
    "EligibleTime",
    "EndTime",
    "ExitCode"
    "Features",
    "Gres",
    "JobId",
    "JobName",
    "JobState",
    "Licenses",
    "Network",
    "NodeList",
    "NumCPUs",
    "NumNodes",
    "NumTasks",
    "Partition",
    "Power",
    "QOS",
    "Reason",
    "Reservation",
    "RunTime",
    "StartTime",
    "SubmitTime",
    "TimeLimit",
    "UserId",
    "WorkDir",
]


def filterfunc(job):
    newjob = {}
    for key in job:
        if key in allowed and job[key] and job[key] != '(null)':
            newjob[key] = job[key]
    return newjob


jobs = json.load(sys.stdin)
newdata = [filterfunc(job) for job in jobs]

json.dump(newdata, sys.stdout)
