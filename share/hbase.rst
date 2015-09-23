

hbase建表时指定region
#######################

create 't1', 'f1', {SPLITS => ['10', '20', '30', '40']}

分区时针对全表而非某个Column Family:

create 't', {NAME => 'f', VERSIONS => 1, COMPRESSION => 'SNAPPY'},
    {SPLITS => ['10','20','30']}

http://shitouer.cn/2013/05/hbase-create-table-with-pre-splitting-and-other-options/

例如创建neo的doc相关表格:

create 'neo_conjunction_cfb', {NAME => 'f', VERSIONS => 1, COMPRESSION => 'SNAPPY', IN_MEMORY => 'true', BLOCKCACHE => 'true', TTL => '345600' },
    {SPLITS => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']}

create 'neo_doc_test', {NAME => 'f', VERSIONS => 1, COMPRESSION => 'SNAPPY', IN_MEMORY => 'true', BLOCKCACHE => 'true' },
    {SPLITS => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']}


create 'stat_doc', 'f', { NUMREGIONS => 128, SPLITALGO => 'UniformSplit' }, { NAME => 'f', IN_MEMORY => 'true', BLOCKCACHE => 'true', COMPRESSION => 'SNAPPY' }
create 'stat_source', 'f', { NUMREGIONS => 32, SPLITALGO => 'UniformSplit' }, { NAME => 'f', IN_MEMORY => 'true', BLOCKCACHE => 'true', COMPRESSION => 'SNAPPY' }

create 'neo_conj', {NAME => 'f', VERSIONS => 1, COMPRESSION => 'SNAPPY', IN_MEMORY => 'true', BLOCKCACHE => 'true', TTL => '345600' },
    {SPLITS => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']}


设置600,2415240
如果设置1200, 2246740
100, 2037900
;
设置pending=1000, 100, 1721980
设置5000, 1414120

create 'neo_conj_history', {NAME => 'f', VERSIONS => 1, COMPRESSION => 'SNAPPY', IN_MEMORY => 'true', BLOCKCACHE => 'true', TTL => '345600' },
    {SPLITS => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']}

随机查询为主, 创建时采用UniformSplit;

create 'neo_shortterm', 'f', { NUMREGIONS => 128, SPLITALGO => 'UniformSplit' }, { NAME => 'f', IN_MEMORY => 'true', BLOCKCACHE => 'true', COMPRESSION => 'SNAPPY', TTL => '172800' }

create 'neo_shortterm', 'f', { NUMREGIONS => 16, SPLITALGO => 'UniformSplit' }, { NAME => 'f', IN_MEMORY => 'true', BLOCKCACHE => 'true', COMPRESSION => 'SNAPPY', TTL => '172800' }

生成delta -> -> shuffle by key -> persistent汇集写入

不做任何的batch,不emit,达到900m/10m;
不做任何的batch，emit，16k/1m，delta发送的频率为1.5M/m左右 140m/10m;
batch为1000,
不做后续的emit,但是


pipeline发数据，但是不写数据, 此时达到了?;

hbase coprocessor 开发
===============================

加载coprocessor
-----------------

alter 'neo_cfb_doc_test', METHOD=>'table_att','coprocessor'=>'hdfs://nameservice1/lib/neo/coprocessor.jar|com.blackwing.util.hbase.coprocessor.SplitRowEndPoint|1073741823'

参考:

1. HBase的coprocessor分拆HRegion http://blackwing.iteye.com/blog/1788647
