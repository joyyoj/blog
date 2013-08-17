*********************
Impala总体介绍
*********************

Impala要解决的问题
=================================

Impala是Cloudera开发并开源的一个MPP模型的分布式查询引擎，目前处于1.1 版本。该查询引擎主要针对“低延时的实时数据查询与分析”应用，支持直接访问HDFS(hive)和HBase中的数据。它的设计可能反映了Google内部对Dremel和Tenzing的改进思想。 

Impala总体架构
===================

在一个运行中的Impala系统中，主要包含两类服务进程:

* statestored 这是一个中心进程，它的主要功能就是维护第二类(impalad)进程的信息。

* impalad 这是一组进程，它们会与数据节点所在的机器混布, 或者就近部署,真正对外提供查询服务. 每个impalad进程同时充当两类角色:查询的主控者 (coordinator) 或者查询的分布式工作单元 (worker).当一个客户端发起一个SQL查询时,该客户端可以通过thrift连接到任意一个impalad进程上,此时,该impalad进程就成为这个SQL查询的coordinator,其它的impalad进程成为备选的worker进程。

一个SQL执行过程如下：

* 客户端通过thrift将SQL语句发送给coordinator。

* coordinator将SQL语句编译为一组PlanFragment，每一个PlanFragment都可以被分配给某个worker进程执行（某些被coordinator直接执行）。

* coordinator根据每个PlanFragment的输入, 将它分发给一个合适的worker进程执行，并收集执行状态. 如果是交互查询（客户端请求获取结果),coordinator自己会有一个PlanFragment，它会将结果传递回客户端。


Impala的主要代码包含在三个目录中：
impala/common/thrift：包含了thrift接口与数据类型定义。在Impala中，thrift是通用的数据交换格式，包括进程间通信、Java和C之间的数据交换。
impala/fe：包含Impala的编译部分：词法分析、语法分析、语义分析、执行计划生成。
impala/be：包含Impala的服务进程与运行时系统。

