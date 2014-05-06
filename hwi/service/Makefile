GEN_SRC := gen-cpp/queryengine_constants.cpp  gen-cpp/queryengine_types.cpp  gen-cpp/QueryService.cpp
#query_server.cpp query_client.cpp
GEN_OBJ := $(patsubst %.cpp,%.o, $(GEN_SRC))

THRIFT_DIR := /home/sunshangchun/lib/thrift/
BOOST_DIR := /home/sunshangchun/meta/boost

INC := -I$(THRIFT_DIR)/include -I$(BOOST_DIR) -Igen-cpp

.PHONY: all clean

all: query_server query_client
#intelligence_client

%.o: %.cpp
	$(CXX) -Wall -DHAVE_INTTYPES_H -DHAVE_NETINET_IN_H $(INC) -c $< -o $@

query_server: query_server.o $(GEN_OBJ)
	$(CXX) $^ -static -o $@ -L/usr/local/lib -L$(THRIFT_DIR)/lib -lthrift 

query_client: query_client.o $(GEN_OBJ)
	$(CXX) $^ -static -o $@ -L/usr/local/lib -L$(THRIFT_DIR)/lib -lthrift 

clean:
	$(RM) *.o query_server
