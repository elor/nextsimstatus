from subprocess import Popen, PIPE


def run_command(command_array, input_stdin=b''):
    p = Popen(command_array, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    out, err = p.communicate(input_stdin)
    return p.returncode, out, err
