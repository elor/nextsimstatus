from run_command import run_command
import config


def test(nodes):
    if not nodes:
        raise RuntimeError('No nodes defined')

    return_code, out, err = run_command(['nodels', nodes])
    if return_code:
        raise RuntimeError(
            'NonZero Return Code {}: {}'.format(return_code, err))
    if not out:
        raise RuntimeError('no nodes found')
    return out


def command(action, nodes):
    return ['nextsim', action, nodes]


def control(action, nodes):
    return_code, out, err = run_command(command(action, nodes))
    if return_code:
        raise RuntimeError(
            'NonZero Return Code {}: {}'.format(return_code, err))
    return out


if __name__ == "__main__":
    from sys import argv, exit
    cmd, nodes = argv
    print test(nodes)
