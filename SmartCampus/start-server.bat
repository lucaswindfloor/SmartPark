@echo off
cd src\main
java -jar target\smartpark-backend.jar --server.port=8080
echo 后端服务启动在 http://localhost:8080 