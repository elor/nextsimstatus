from run_command import run_command
import config

COMMAND_BY_ACTION = {
    'test': lambda jobs, _=None: ['squeue', '--jobs', jobs, '--format=%i\t%u', '--noheader', '--states=PENDING,RUNNING,SUSPENDED,COMPLETED,CANCELLED,FAILED,TIMEOUT,NODE_FAIL,PREEMPTED,BOOT_FAIL,DEADLINE,OUT_OF_MEMORY,COMPLETING,CONFIGURING,RESIZING,REVOKED,SPECIAL_EXIT'],
    'abort': lambda jobs, _=None: ['scancel', jobs],
    'hold': lambda jobs, _=None: ['scontrol', 'hold', jobs],
    'release': lambda jobs, _=None: ['scontrol', 'release', jobs],
    'requeue': lambda jobs, _=None: ['scontrol', 'requeue', jobs],
    'top': lambda jobs, _=None: ['scontrol', 'top', jobs],
    'throttle': lambda jobs, count: ['scontrol', 'update', 'JobId={}'.format(jobs), 'ArrayTaskThrottle={}'.format(count)],
}


def test(jobs, user, is_admin):
    command = COMMAND_BY_ACTION['test'](jobs)
    return_code, out, err = run_command(command)
    if return_code:
        raise RuntimeError(
            'NonZero Return Code {}: {}'.format(return_code, err))
    if not out:
        raise RuntimeError('no jobs found')
    lines = [line.strip().split('\t')
             for line in out.split('\n') if line.strip()]

    if not is_admin and any([jobuser != user for jobid, jobuser in lines]):
        raise RuntimeError('not your jobs')

    return out


def command(action, jobs, payload=None):
    return COMMAND_BY_ACTION[action](jobs, payload)


def control(action, jobs, user=None, payload=None):
    return_code, out, err = run_command(
        command(action, jobs, payload), user=user)
    if return_code:
        raise RuntimeError(
            'NonZero Return Code {}: {}'.format(return_code, err))
    return out


if __name__ == "__main__":
    from sys import argv, exit
    cmd, jobs, user = argv
    print test(jobs, user, user == config.ADMIN_GROUP)
