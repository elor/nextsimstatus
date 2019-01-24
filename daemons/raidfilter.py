#!/usr/bin/env python

import json
import sys

allowed = [
    "ArrayJobId",
    "ArrayTaskId",
    "BatchHost",
    "Command",
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
    "NodeList",
    "NumCPUs",
    "NumNodes",
    "NumTasks",
    "Partition",
    "Reason",
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
        if key in allowed and job[key]:
            newjob[key] = job[key]
    return newjob


jobs = json.load(sys.stdin)
newdata = [filterfunc(job) for job in jobs]

json.dump(newdata, sys.stdout)
