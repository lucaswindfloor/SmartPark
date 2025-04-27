@echo off
echo 正在启动后端服务器...
start cmd /k "cd server && set PORT=3001 && npm run dev"

echo 正在启动前端服务...
start cmd /k "npm run dev"

echo 正在启动webapp服务...
start cmd /k "cd SmartCampus/src/main/webapp && npm run dev"

echo 所有服务启动完毕!
echo 后端API: http://localhost:3001
echo 前端应用: http://localhost:3003
echo Webapp: http://localhost:3000 