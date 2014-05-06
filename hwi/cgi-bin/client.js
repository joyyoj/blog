var thrift = require('thrift');
var service = require('./gen-nodejs/QueryService.js');
var connection = thrift.createConnection('localhost', 9090),
    client = thrift.createClient(service, connection);
connection.on("error", function(err) {
    console.error(err);
});

var res = client.GetCompletion("line", "content", "insight");
console.error(res);
connection.end();

