#/usr/bin/python
# -*- coding:utf-8 -*-

import httplib
import json
import time
from urlparse import urlparse
import sys
import datetime

tsdb_url = "http://hadoop1-4.yidian.com:4242/api/put"

def str_to_datetime(string, time_format):
    return datetime.datetime.strptime(string, time_format)

def str_to_timestamp(str_time, time_format):
    return time.mktime(str_to_datetime(str_time, time_format).timetuple())

def current_timestamp():
    return long(time.time() * 1000)

def request_get(url, netloc = ""):
    if netloc == "":
        netloc = urlparse(url).netloc
    conn = httplib.HTTPConnection(netloc)
    conn.request('GET', url)
    counter_data = conn.getresponse().read()
    conn.close()
    json_data=json.loads(counter_data)
    return json_data

#httplib.HTTPConnection.debuglevel = 1
def parse_app_master(location):
    parsed_uri = urlparse(location)
    app_id = parsed_uri.path.split("/")[2]
    host = parsed_uri.netloc
    path = "/proxy/"  + app_id
    conn = httplib.HTTPConnection(host)
    conn.request('GET', path)
    job_id = ""
    app_master = ""
    for item in conn.getresponse().getheaders():
        if item[0]=='location':
            parsed_uri = urlparse(item[1])
            #app_master = '{uri.scheme}://{uri.netloc}'.format(uri=parsed_uri)
            app_master = parsed_uri.netloc
            job_id = parsed_uri.path.split("/")[-2]
    conn.close()
    return (app_master, job_id)

def request_counter(app_master, job_id, track_url, is_history):
    counter_url = ("/ws/v1/history/mapreduce/jobs/%s/counters" % job_id) \
        if is_history else (track_url + "/ws/v1/mapreduce/jobs/%s/counters" % job_id)
    print "counter url:" + app_master + counter_url
    return request_get(counter_url, app_master)

def post_metrics(url, points):
    headers = {"Content-type":"application/json"}
    parsed_url = urlparse(url)
    conn = httplib.HTTPConnection(parsed_url.netloc)
    params = json.dumps(points)
    print("post " + params)
    conn.request('POST', parsed_url.path, params, headers)
    response = conn.getresponse()
    data = response.read()
    print data

def trans_counter(json_data, timestamp):
    counter_group = json_data["jobCounters"]["counterGroup"]
    for counters in counter_group:
        if counters["counterGroupName"] == "org.apache.hadoop.mapreduce.TaskCounter":
            values = {}
            for counter in counters["counter"]:
                values[counter["name"]] = long(counter["totalCounterValue"])

            metric_names = ["REDUCE_INPUT_GROUPS", "REDUCE_OUTPUT_RECORDS", "REDUCE_INPUT_GROUPS", "MAP_INPUT_RECORDS", "MAP_OUTPUT_RECORDS"]
            metric_points = []
            for name in metric_names:
                if values.has_key(name):
                    metric_point = {}
                    metric_point["metric"] = metric + "_" + name.lower()
                    metric_point["value"] = values[name]
                    metric_point["tags"] = { "type" : "mr" }
                    metric_point["timestamp"] = timestamp
                    metric_points.append(metric_point)
            return metric_point

def test_post():
    metric_points = []
    timestamp = current_timestamp()
    metric_point = {"metric":"test_mapreduce", "timestamp":timestamp, "value":100 }
    metric_point["tags"] = {"type":"mr"}
    metric_points.append(metric_point)
    post_metrics(tsdb_url, metric_points)

if __name__ == "__main__":
    # test_post()
    # metric = "test_mapreduce"
    # http://hadoop2-13.lg-4-e10.yidian.com:8088/proxy/application_1425412783697_53564/ws/v1/mapreduce/jobs
    # track_url = "http://hadoop2-13.lg-4-e10.yidian.com:8088/proxy/application_1425412783697_53571"
    # track_url = "http://hadoop2-13.lg-4-e10.yidian.com:8088/proxy/application_1425412783697_53613"
    # http://hadoop2-13.lg-4-e10.yidian.com:8088/proxy/application_1425412783697_53656/
    metric = sys.argv[1]
    track_url = sys.argv[2]
    day = sys.argv[3]
    hour = sys.argv[4]
    timestamp = long(str_to_timestamp(day + " " + hour, "%Y-%m-%d %H:%M:%S") * 1000)

    (app_master, job_id) = parse_app_master(track_url)
    url = track_url + "/"

    is_history = False if app_master == "" else True
    if app_master == "": # if running
        app_master = urlparse(track_url).netloc
        job_url = track_url + "/ws/v1/mapreduce/jobs"
        jobs = request_get(job_url)
        print jobs["jobs"]["job"]
        for job in jobs["jobs"]["job"]:
            job_id = job["id"]
            break
    json_data = request_counter(app_master, job_id, track_url, is_history)
    counter_group = trans_counter(json_data, timestamp)
    post_metrics(tsdb_url, counter_group)