 

HIVE优化的策略：
计算优化

计算逻辑的优化
=================



减少Map Task
---------------

合并小文件
----------------

set mapred.combine.input.format.local.only=false来开启多机合并的策略

另外，相关的参数：
hive.merge.mapfiles = true 是否和并 Map 输出文件，默认为 True
hive.merge.mapredfiles = false 是否合并 Reduce 输出文件，默认为 False
hive.merge.size.per.task = 256*1000*1000 合并文件的大小

增加MR轮次
-----------------

count(distinct key) -> select count(*) from (select distinct key from src) t;


减少MR轮次
----------------

set abaci.is.dag.job=true;

开启dag优化，MR -> MR ==> MRR

MapJoin
---------------

小表读入内存，即使MapJoin失败，仍然会启用Backup Task，改用ReduceJoin来完成。


Left Semi Join
---------------

Left Outer Join可以实现

数据倾斜
-----------------

GroupBy: hive.groupby.skewindata = false
JOIN: set hive.optimize.skewjoin=true;


存储优化
===================================


减少文件(分区裁剪, Bucket优化)
-------------------------------

分区裁剪：默认生效;
类似：where baiduid=''

减少行
--------------------
（谓词下推）

尽量过滤不参与计算的行，例如JOIN中，可以去除JOIN key为NULL或空的行。

a join b on a.key=b.key and a.key is not null


A JOIN B JOIN C on A.key=B.key and B.key=C.key
=>
A JOIN B on A.key=B.key JOIN C on B.key=C.key;


针对union all的优化：
a join b on if(a.key is null, a.key1) a.key =b.key


减少列 
---------------------------
列裁剪优化：(RCFile/ORCFile)

****************

减少MR的Job数目
===============

开启DAG优化
==============

减少MR框架的调度
===================

设置合理的MapReduce的task数
-----------------------------
设置split size
开启CombinehiveInputFormat



开启RemoteSplits功能
======================

数据倾斜
==========

join倾斜
---------------

groupby倾斜
-------------

set hive.groupby.skewindata=true;

hql语句优化
=================================
count(distinct) => groupby 
 
优化时把握整体，单个作业最优不如整体最优。


单个HSQL的优化
================

取出cnblog某一天访问日志中同时看过博主“小张”和博主“小李”的人数。低效的思路是面向明细的，先取出看过博主“小张”的用户，再取出看过博主“小李”的用户，然后取交集，代码如下

::
  
  select count(*) from
  (select distinct user_id
   from cnblogs_visit_20130801 where blog_owner = ‘小张’) a
   join
   (select distinct user_id
    from cnblogs_visit_20130801 where blog_owner = ‘小李’) b
    on a.user_id = b.user_id;

这样一来，就要产生2个求子查询的job（当然，可以并行），一个join job，还有一个计算count的job。
但是我们直接用面向统计的方法去计算的话，则会更加符合M/R的模式：

::
  
  select count(*) from
  (
   select user_id,
   count(case when blog_owner = ‘小张’ then 1 end) as visit_z,
   count(case when blog_owner = ‘小李’ then 1 end) as visit_l
   from cnblogs_visit_20130801 group by user_id
  ) t
  where visit_z > 0 and visit_l > 0;
  
这种实现方式转换成job就只会有2个：内层的子查询和外层的统计，更少的job也就带来更高效的执行结果。


参考材料:

1 http://www.cnblogs.com/sunyi514/p/3279957.html
