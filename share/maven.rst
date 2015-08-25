*****************************
Maven常用命令
*****************************

test
==========

执行一个单元测试: mvn test -Dtest=testname

如果工程包含多个module,需要指定单测所在的module: mvn test -Dtest=testname -pl subproject

单测进行调试: mvn test -Dtest=MySuperClassTest -Dmaven.surefire.debug 之后使用远程调试功能;

mvn -X  cobertura:cobertura

依赖包
============

查看依赖图: mvn dependency:tree

拷贝依赖包: mvn dependency:copy-denpendices

mvn -U clean package

intellij的问题
===============

如果mvn的依赖scope是provided，那么如果要调试，需要改为compile才可以正确找到类的路径

模拟器，模拟发包, 真实机器

服务器 数据库 各种机型的特征值 多个信息
