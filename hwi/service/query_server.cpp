#include "QueryService.h"
#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/server/TSimpleServer.h>
#include <thrift/transport/TServerSocket.h>
#include <thrift/transport/TBufferTransports.h>
#include "completor.cpp"

using namespace ::apache::thrift;
using namespace ::apache::thrift::protocol;
using namespace ::apache::thrift::transport;
using namespace ::apache::thrift::server;

using boost::shared_ptr;

using namespace  ::queryengine;

class QueryServiceHandler : virtual public QueryServiceIf {
 public:
  QueryServiceHandler() {
    cache_service.Init();
  }
 
  void GetCompletion(std::string& _return, const std::string& prefix, const std::string& line, const std::string& content) {
      std::string uprefix =  prefix;
      to_lower(uprefix);
      _return = cache_service.FindIntelligence("", "", uprefix);
  }

 private:
  MetaCacheService cache_service;
};

int main(int argc, char **argv) {
  int port = 9090;
  shared_ptr<QueryServiceHandler> handler(new QueryServiceHandler());
  shared_ptr<TProcessor> processor(new QueryServiceProcessor(handler));
  shared_ptr<TServerTransport> serverTransport(new TServerSocket(port));
  // shared_ptr<TTransportFactory> transportFactory(new TFramedTransportFactory());
  shared_ptr<TTransportFactory> transportFactory(new TBufferedTransportFactory());
  shared_ptr<TProtocolFactory> protocolFactory(new TBinaryProtocolFactory());

  TSimpleServer server(processor, serverTransport, transportFactory, protocolFactory);
  server.serve();
  return 0;
}

