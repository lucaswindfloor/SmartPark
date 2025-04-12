#!/bin/bash

# 切换到server目录并启动服务端
cd server
npm run dev &

# 等待几秒钟让服务器启动
sleep 3

# 返回主目录并启动客户端
cd ..
npm run dev

# 注意: 要在Unix系统中运行此脚本，请先授予执行权限:
# chmod +x start-server.sh
# 然后执行:
# ./start-server.sh 