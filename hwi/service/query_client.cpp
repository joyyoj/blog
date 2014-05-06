#include "QueryService.h"
#include <thrift/transport/TSocket.h>
#include <thrift/transport/TBufferTransports.h>
#include <thrift/protocol/TBinaryProtocol.h>

using namespace apache::thrift;
using namespace apache::thrift::protocol;
using namespace apache::thrift::transport;

using namespace queryengine;

int main(int argc, char **argv) {
    boost::shared_ptr<TSocket> socket(new TSocket("localhost", 9090));
    boost::shared_ptr<TTransport> transport(new TBufferedTransport(socket));
    // boost::shared_ptr<TTransport> transport(new TFramedTransport(socket));
    boost::shared_ptr<TProtocol> protocol(new TBinaryProtocol(transport));

    QueryServiceClient client(protocol);
    transport->open();
    printf("call ping ........\n");
    std::string ret;
    client.GetCompletion(ret, "insight", "insight", "insight");
    std::cout << ret << std::endl;
    transport->close();
    return 0;
}
