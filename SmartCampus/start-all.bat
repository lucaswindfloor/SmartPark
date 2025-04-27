@echo off
echo 正在启动后端服务器...
start cmd /k "%~dp0\start-server.bat"

echo 正在启动前端应用...
start cmd /k "%~dp0\start-webapp.bat"

echo 所有服务启动完毕!
echo 后端API: http://localhost:8080
echo 前端应用: http://localhost:3000 