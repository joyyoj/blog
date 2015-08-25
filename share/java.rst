查询
LINUX系统下查看JAVA的哪个线程占用CPU高
1. 先定位占用cpu高的进程
top

1. 使用以下命令
ps -p 56651 -L -o pcpu,pid,tid,time,tname,stat,psr | sort -n -k1 -r | head -25

1.

12.3 56651 56675 00:01:45 ?        Sl     4
12.3 56651 56669 00:01:45 ?        Sl    12
12.3 56651 56667 00:01:46 ?        Sl     4
12.3 56651 56666 00:01:46 ?        Sl     4
12.3 56651 56661 00:01:45 ?        Sl     5

其中第3个结果就是此进程中有问题的线程nid

1. 通过jstack命令dump出堆栈

 jstack 56651 | grep -10 `printf "%x" 56675`

"Gang worker#11 (Parallel GC Threads)" prio=10 tid=0x00007f5b9c034000 nid=0xdd5e runnable

"Gang worker#12 (Parallel GC Threads)" prio=10 tid=0x00007f5b9c036000 nid=0xdd5f runnable

"Gang worker#13 (Parallel GC Threads)" prio=10 tid=0x00007f5b9c038000 nid=0xdd60 runnable

"Gang worker#14 (Parallel GC Threads)" prio=10 tid=0x00007f5b9c039800 nid=0xdd61 runnable

jstat查看gc内存:

每隔2s dump一次:

jstat -gcutil 27274 2000
  S0     S1     E      O      P     YGC     YGCT    FGC    FGCT     GCT
  0.00  43.83  69.13  53.52  99.84     35    1.879     0    0.000    1.8

  查看整个JVM内存状态
jmap -heap [pid]
要注意的是在使用CMS GC 情况下，jmap -heap的执行有可能会导致JAVA 进程挂起

查看JVM堆中对象详细占用情况
jmap -histo [pid]

导出整个JVM 中内存信息
jmap -dump:format=b,file=文件名 [pid]

gateway机器需要的操作:
1 hive替换jar包 logging-assemlby.jar; 在.hiverc中add jar xx;
2 pig更改配置: pig.load.default.statements=$PIGHOME/.pigbootup
3 /etc/azkaban/目录下存放了一些需要的脚本;
4 重启azkaban的executor webserver等;
5 重启 profile debugger等工具
6 export PIG_CLASSPATH=/opt/cloudera/parcels/CDH/lib/hive/lib/logging-assembly-0.1.0.jar
如何使用hcatalog: https://cwiki.apache.org/confluence/display/Hive/HCatalog+LoadStore


