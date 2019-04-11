from run_command import run_command
import config

COMMAND_BY_ACTION = {
    'test': lambda jobs: ['squeue', '--jobs', jobs, '--format=%i\t%u', '--noheader', '--states=PENDING,RUNNING,SUSPENDED,COMPLETED,CANCELLED,FAILED,TIMEOUT,NODE_FAIL,PREEMPTED,BOOT_FAIL,DEADLINE,OUT_OF_MEMORY,COMPLETING,CONFIGURING,RESIZING,REVOKED,SPECIAL_EXIT'],
    'abort': lambda jobs: ['scancel', jobs],
    'hold': lambda jobs: ['scontrol', 'hold', jobs],
    'release': lambda jobs: ['scontrol', 'release', jobs]
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


def command(action, jobs):
    return COMMAND_BY_ACTION[action](jobs)


def control(action, jobs, user=None):
    return_code, out, err = run_command(command(action, jobs), user=user)
    if return_code:
        raise RuntimeError(
            'NonZero Return Code {}: {}'.format(return_code, err))
    return out


if __name__ == "__main__":
    from sys import argv, exit
    cmd, jobs, user = argv
    print test(jobs, user)
