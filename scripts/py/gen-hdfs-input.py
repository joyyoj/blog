#!/usr/bin/python
import commands
import time
import datetime
import sys

def datetime_to_str(dt, time_format):
    return dt.strftime(time_format)

def str_to_datetime(string, time_format):
    return datetime.datetime.strptime(string, time_format)

def str_to_timestamp(str_time, time_format):
    return time.mktime(str_to_datetime(str_time, time_format).timetuple())

def current_timestamp():
    return long(time.time() * 1000)

def timestamp_to_str(timestamp, time_format):
    return time.strftime(time_format, time.localtime(timestamp))

def datetime_to_timestamp(date_time):
    return time.mktime(date_time.timetuple())

def exec_shell(cmd):
    output = commands.getstatusoutput(cmd)
    return (output[0], output[1].split("\n"))

if __name__ == '__main__' :
    date = sys.argv[1]
    duration = int(sys.argv[2])
    root="hdfs://nameservice1/data/userProfile/neo_str_new/delta/";
    time_format='%Y-%m-%d/%H:%M:%S'
    s = int(str_to_timestamp(date, time_format) + 1)
    end_time = s
    start_time = s - duration * 3600
    non_exists_count = 0
    parts=set()
    cmd = "hadoop fs -ls %s | awk -F 'delta/' '{print $2}' | awk -F '/' '{print $1}'" % root
    (ret, msg) = exec_shell(cmd)
    if ret == 0:
        for line in msg:
            if line.strip() != '':
                parts.add(line)
    else:
        print("hadoop fs -ls failed")
        sys.exit(1)

    non_exists = 0
    for tt in range(start_time, end_time, 3600):
        version = timestamp_to_str(tt, '%Y%m%d%H')
        path = str(root) + version
        if version in parts:
            print path
        else:
            non_exists += 1
            if non_exists > 5:
                print("non exists exceed max allowed %d" % non_exists)
                sys.exit(1)
