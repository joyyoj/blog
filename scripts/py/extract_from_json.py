__author__ = 'sunshangchun'

#!/usr/bin/python
import json
import sys
import codecs
from os import listdir
from os.path import isfile, join

def file_put_content(content, file_name):
    #coding=utf-8
    #file_obj = open(file_name, 'w', 'utf-8')
    file_obj=codecs.open(file_name, 'w', 'utf-8')
    try:
         file_obj.write(content)
    finally:
         file_obj.close()
     # print(unicode(file_obj_content,'UTF-8'))


if __name__ == '__main__' :
    with open("log.txt") as infile:
        for line in infile:
            js = json.loads(line)
            
    # dir_path = sys.argv[1]
    # files = [ join(dir_path, f) for f in listdir(dir_path) if isfile(join(dir_path, f)) ]
    # for file_name in files:
    #     f = file(file_name)
    #     js = json.load(f)
    #     file_content=json.dumps(js, sort_keys=True, indent=4, separators=(',', ': '), ensure_ascii=False)
    #     #print file_content
    #     file_put_content(file_content, file_name)