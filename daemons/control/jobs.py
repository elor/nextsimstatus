from run_command import run_command
import config

COMMAND_BY_ACTION = {
    "test": lambda jobs, _=None: [
        "squeue",
        "--jobs",
        jobs,
        "--format=%i\t%u",
        "--noheader",
        "--states=PENDING,RUNNING,SUSPENDED,COMPLETED,CANCELLED,FAILED,TIMEOUT,NODE_FAIL,PREEMPTED,BOOT_FAIL,DEADLINE,OUT_OF_MEMORY,COMPLETING,CONFIGURING,RESIZING,REVOKED,SPECIAL_EXIT",
    ],
    "abort": lambda jobs, _=None: ["scancel", jobs],
    "hold": lambda jobs, _=None: ["scontrol", "hold", jobs],
    "release": lambda jobs, _=None: ["scontrol", "release", jobs],
    "requeue": lambda jobs, _=None: ["scontrol", "requeue", jobs],
    "top": lambda jobs, _=None: ["scontrol", "top", jobs],
    "throttle": lambda jobs, count: [
        "scontrol",
        "update",
        "JobId={}".format(jobs),
        "ArrayTaskThrottle={}".format(count),
    ],
    "increase_timelimit": lambda jobs, limit: [
        "scontrol",
        "update",
        "JobId={}".format(jobs),
        "TimeLimit+=1-00:00:00",
    ],
}


def test(jobs, user, is_admin):
    test_command = COMMAND_BY_ACTION["test"](jobs)
    return_code, out, err = run_command(test_command)
    if return_code:
        raise RuntimeError("NonZero Return Code {}: {}".format(return_code, err))
    if not out:
        raise RuntimeError("no jobs found")
    lines = [
        line.strip().split("\t")
        for line in out.decode("utf-8").split("\n")
        if line.strip()
    ]

    if not is_admin and any([jobuser != user for jobid, jobuser in lines]):
        raise RuntimeError("not your jobs")

    return out


def command(action, jobs, payload=None):
    return COMMAND_BY_ACTION[action](jobs, payload)


def control(action, jobs, user=None, payload=None):
    return_code, out, err = run_command(command(action, jobs, payload), user=user)
    if return_code:
        raise RuntimeError("NonZero Return Code {}: {}".format(return_code, err))
    return out


def logfiles(jobid, user=None):
    return_code, out, err = run_command(
        ["scontrol", "show", "job", str(jobid)], user=user
    )
    if return_code:
        raise RuntimeError("NonZero Return Code {}: {}".format(return_code, err))
    lines = [line.strip().split("=") for line in out.decode("utf-8").split("\n")]
    pairs = [
        {pair[0]: pair[1]}
        for pair in lines
        if len(pair) == 2 and pair[0].startswith("Std")
    ]
    files = {}
    for file in pairs:
        files.update(file)
    return files


def printlog(logfile, lines=20, user=None):
    return_code, out, err = run_command(["tail", "-n", str(lines), logfile], user=user)
    if return_code:
        raise RuntimeError("NonZero Return Code {}: {}".format(return_code, err))
    return out.decode("utf-8")


def log(jobid, lines=20, user=None):
    files = logfiles(jobid, user)

    StdOut = files["StdOut"]
    StdErr = files["StdErr"]

    return {
        "JobId": jobid,
        "StdOutFile": files["StdOut"],
        "StdOut": printlog(files["StdOut"], lines, user),
        "StdErrFile": files["StdOut"],
        "StdErr": printlog(files["StdErr"], lines, user)
        if StdErr != StdOut
        else "<same as StdOut>",
    }


def jobscript(jobid, user=None):
    return_code, out, err = run_command(
        ["scontrol", "write", "batch_script", str(jobid), "-"], user=user
    )
    if return_code:
        raise RuntimeError("NonZero Return Code {}: {}".format(return_code, err))
    return {"JobId": jobid, "JobScript": out.decode("utf-8")}


def main():
    from sys import argv, exit

    cmd, jobs, user = argv
    print(test(jobs, user, user == config.ADMIN_GROUP))


if __name__ == "__main__":
    main()
