
install grpc
==============

install grpc-java
===================

#. build the examples:
    $ cd examples
    $ export CXXFLAGS="-I/usr/local/include" LDFLAGS="-L/usr/local/lib"
    $ ../gradlew installDist

#. run hello world example:
    $ ./build/install/grpc-examples/bin/hello-world-server

    $ ./build/install/grpc-examples/bin/hello-world-client


./gradlew -v 版本号

./gradlew clean 清除9GAG/app目录下的build文件夹

./gradlew build 检查依赖并编译打包

这里注意的是 ./gradlew build 命令把debug、release环境的包都打出来，如果正式发布只需要打Release的包，该怎么办呢，下面介绍一个很有用的命令 **assemble**, 如

./gradlew assembleDebug 编译并打Debug包

./gradlew assembleRelease 编译并打Release的包

除此之外，assemble还可以和productFlavors结合使用，具体在下一篇多渠道打包进一步解释。

./gradlew installRelease Release模式打包并安装

./gradlew uninstallRelease 卸载Release模式包