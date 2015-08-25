__author__ = 'sunshangchun'

import commands

def exec_shell(cmd):
    output = commands.getstatusoutput(cmd)
    return (output[0], output[1].split("\n"))


def get_partition(line):
    output = line.strip(" ").split(" ")
    path_info = output[-1].rsplit("/", 2)
    return path_info

def dfs_ls(path):
    cmd = "hadoop fs -ls %s" % path
    (ret, msg) = exec_shell(cmd)
    output = []
    if ret == 0:
        for line in msg:
            part_info = line.strip(" ").split(" ")
            if len(part_info) != 3:
                continue
            output.append(part_info)
    return (ret, output)

def repair_part(table, path, day):
    (ret, output) = dfs_ls(path, day)
    if ret != 0:
        return

    for part_info in output:
        hour = part_info[-1]
        day = part_info[-2]
        sql = "alter table %s add partition (p_day='%s', p_hour='%s') location '%s';" % (table, day, hour)
        print(sql)

def remove_invalid_path(date):
    for hour in range(0, 24):
        parent = "hdfs://nameservice1/user/azkaban/camus/productlog/hourly/%s/%02d" % (date, hour)
        path= parent + ("/%02" % hour)
        (ret, msg) = exec_shell("hadoop fs -ls " + path)
        if ret == 0:
            cmd = "hadoop fs -mv %s/* %s" % path, parent
            print("exec %s" % cmd)
            exec_shell(cmd)

if __name__ == "__main__":
    (ret, output) = dfs_ls("/data/userProfile/neo_str/delta")
    if ret == 0 :
       for line in output:
           print line
        # repair_part("etl_user_event", "/user/azkaban/camus/productlog/hourly/", date)

    # line = " drwxr-xr-x   - azkaban azkaban          0 2015-02-01 01:43 /user/azkaban/camus/productlog/hourly/2015-02-01/00"
    # part_info = get_partition(line)
    # print(part_info)
    # for day in range(28, 29):
    #     day = "2015-02-%d" % day
    #     for hour in range(1, 22):
    #         location = "hdfs://nameservice1/user/azkaban/camus/productlog/hourly/%s/%02d" % (day, hour)
    #         sql="alter table etl_user_event add partition (p_day='%s', p_hour='%02d') location '%s';" % (day, hour, location)
    #         print(sql)
    # file_put_content("hello", "helloa")

