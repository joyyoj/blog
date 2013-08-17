*********************
Impala前端分析
*********************

FrontEnd Overview
=====================

frontend 指的是翻译 query 语句,生成执行计划的部分,采用 java 实现; 通过 jni与c++代码交互。
Frontend 主要完成的工作包括 Query 的语法分析,语义分析,生成基本查询计划树 (PlanNode 树) ,生成 PlanFrangent 及之间的相互关系。其他包括获取相关元数据信息,如所有表 scan node 的 location,select 语句结果字段的元数据等。


