mysql手册
###############


create database azkaban character set utf8 collate utf8_general_ci;
CREATE DATABASE mydb CHARACTER SET utf8 COLLATE utf8_bin;
CREATE USER 'myuser'@'%' IDENTIFIED BY PASSWORD '*HASH';
GRANT ALL ON mydb.* TO 'myuser'@'%';
GRANT ALL ON mydb TO 'myuser'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'myuser'@'%'
GRANT CREATE ON mydb TO 'myuser'@'%';
FLUSH PRIVILEGES;

export PIG_CLASSPATH=/opt/cloudera/parcels/CDH/lib/hive/lib/logging-assembly-0.1.0.jar