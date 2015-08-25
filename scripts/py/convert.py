#!/usr/bin/python
import json
import sys
import codecs
import commands
from os import listdir
from os.path import isfile, join
import re


def exec_shell(cmd):
    output = commands.getstatusoutput(cmd)
    return (output[0], output[1].split("\n"))

def file_put_content(content, file_name):
    file_obj = codecs.open(file_name, 'w', 'utf-8')
    try:
        file_obj.write(content)
    finally:
         file_obj.close()

def match(str):
    prog = re.compile("^(?!sc\d|c\d).*$")
    m = prog.search(str)
    if m:
        i = m.group(0)
        print(i)


if __name__ == '__main__' :
    match("kc76")
    # dir_path = sys.argv[1]
    # files = [ join(dir_path, f) for f in listdir(dir_path) if isfile(join(dir_path, f)) ]
    # for file_name in files:
    #     f = file(file_name)
    #     js = json.load(f)
    #     file_content=json.dumps(js, sort_keys=True, indent=4, separators=(',', ': '), ensure_ascii=False)
    #     #print file_content
    #     file_put_content(file_content, file_name)
