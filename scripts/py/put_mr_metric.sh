#!/bin/sh

cwd=$(cd `dirname $0`; pwd)
echo $cwd

job=$1
url=`grep "url" *$job* |  awk -F 'job: ' '{print $2}' | tail -1`
dt=`grep  "date" *props*  | grep -h delta_merge  | awk -F '=' '{print $2}' | sed 's/\\\\//g'`
python $cwd/put_mr_metric.py -m $job -u $url -d "$dt"
