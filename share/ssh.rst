
ssh相关使用
###################

ssh
===================
chmod 600 ~/.ssh/authorized_keys
chmod 755 ~/.ssh
cat ~/.ssh/id_rsa.pub | ssh xx "cat - >>~/.ssh/authorized_keys"

配置ssh某些机器的信任文件
==========================

Host 172.31.*
        IdentityFile /home/ubuntu/.ssh/particle_dev.pem

rsync copy 断点续传
======================
alias rscp='rsync --progress --bwlimit=512 -avhe -P -r -e ssh '

使用 rsync 同步文件夹
=======================

服务器间同步文件
在服务器间rsync传输文件，需要有一个是开着rsync的服务，而这一服务需要两个配置文件，说明当前运行的用户名和用户组
这个用户名和用户组讲在改变文件权限和相关内容的时候有用，否则有时候会出现提示权限问题。
配置文件也说明了模块，模块化管理服务的安全性，每个模块的名称都是自己定义的，可以添加用户名密码验证，也可以验证IP，设置目录是否可写等.

vim /etc/rsyncd/rsyncd.conf
############## 内容开始 #############
port = 73
address = 0.0.0.0
uid=nobody
gid=nobody
use chroot=yes
# yes为只读，如果是no，则可以从client发送文件到此服务器
read only=no

[bn]
path=/home/
list=false
write only=yes
auth users=azkaban
secrets file=/etc/rsyncd/rsyncd.secrets
hosts allow=192.168.30.0/255.255.255.0

vim /etc/rsyncd/rsyncd.secrets
##############内容开始##############
backup:reoGWh^#fL
# 一行一个用户，用户名:密码
##############内容结束###############

rsync -avl azkaban@10.111.0.113:/home/azkaban/sunsc/ /home/azkaban/backup




