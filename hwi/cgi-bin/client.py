#!/usr/bin/env python
import sys
import cgi

from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

sys.path.append('/home/sunshangchun/github/joyyoj.github.com/hwi/cgi-bin/gen-py')
from queryengine import QueryService

# Make socket
transport = TSocket.TSocket('localhost', 9090)
# Buffering is critical. Raw sockets are very slow
transport = TTransport.TBufferedTransport(transport)
# Wrap in a protocol
protocol = TBinaryProtocol.TBinaryProtocol(transport)
# Create a client to use the protocol encoder
client = QueryService.Client(protocol)
# Connect!
transport.open()
# Call Server services  
form = cgi.FieldStorage()
prefix = form.getvalue('prefix','')
line = form.getvalue('line','')
content = form.getvalue('content', '')

print "Content-Type: text/html"     # HTML is following
print 
suggest = client.GetCompletion(prefix, line, content)
transport.close();
print suggest
#print "<p>" + suggest + "</p>"
