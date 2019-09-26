from subprocess import Popen, PIPE


def run_command(command_array, input_stdin=b'', user=None):
    if user:
        command_array = ['sudo', '-u', user] + command_array
    p = Popen(command_array, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    out, err = p.communicate(input_stdin)
    return p.returncode, out, err
