copied my public key to authorized_keys but public-key authentication still doesn't work.

Typically this is caused by the file permissions on $HOME, $HOME/.ssh or $HOME/.ssh/authorized_keys being more permissive than sshd allows by default.

In this case, it can be solved by executing the following on the server.

$ chmod go-w $HOME $HOME/.ssh

$ chmod 600 $HOME/.ssh/authorized_keys

$ chown `whoami` $HOME/.ssh/authorized_keys

$ Ctrl-Z -> Stop -> disown

安装thrift
===========
安装boost:
    ./bootstrap.sh
    sudo ./b2 threading=multi address-model=64 variant=release stage install
安装libevent:

安装thrift:

git clone
git checkout tag

http://myitcorner.com/blog/?p=207
autotools默认目录是在/usr/bin，使用brew安装, 默认目录是/brew/bin,
aclocal -I /brew/bin
#autoheader automake autoconf
./bootstrap.sh
./configure --prefix=/Users/sunshangchun/libs/thrift-0.9.1 --without-ruby --without-csharp --without-perl --without-php --without-erlang --with-qt4=no --with-qt5=no --with-boost=/Users/sunshangchun/libs/boost_1_57_0
make CXXFLAGS=-stdlib=libstdc++ or  export CXXFLAGS="-std=c++11" && make
export CXXFLAGS="-std=c++11"
make install

export PATH=/Users/sunshangchun/libs/homebrew/Cellar/glib/2.40.0_1/bin:$PATH
https://issues.apache.org/jira/browse/THRIFT-2907
export GFLAGS_INSTALL=/Users/sunshangchun/ClionProjects/naga/thirdparty/gflags-2.0/third-party-install/ && sh bin/build_thirdparty.sh -glog


export PATH=/Users/sunshangchun/libs/homebrew//Cellar/bison/3.0.2/bin:$PATH
export PATH=/Users/sunshangchun/libs/homebrew//Cellar/glib/2.40.0_1/bin:$PATH
export GLIB_LIBS="-L/Users/sunshangchun/libs/homebrew//Cellar/glib/2.40.0_1"
export GMODULE_LIBS="-L/Users/sunshangchun/libs/homebrew//Cellar/glib/2.40.0_1/lib"
export PATH=/usr/gcc4.9.2/bin:$PATH


make CXXFLAGS=-stdlib=libstdc++


设置应用g++的标准库，苹果体系默认应用的是llvm clang的编译器，对应的标准库是libc++， 而GCC 应用的是libstdc++