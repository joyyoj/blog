import commands
import string
import sys
import time


def char_range(c1, c2):
    """Generates the characters from `c1` to `c2`, inclusive."""
    for c in xrange(ord(c1), ord(c2)+1):
        yield chr(c)


def exec_shell(cmd):
    output = commands.getstatusoutput(cmd)
    return (output[0], output[1].split("\n"))

if __name__ == "__main__":
    filename = sys.argv[1]

    parts = set()
    with open(filename, "r") as lines:
        for line in lines:
            line.split("/")[-1]
            day = line[0:4]
            hour = line[4:6]
            exec_shell("sh matrix_delta_str.sh " %(day, hour))
time.sleep(60)

