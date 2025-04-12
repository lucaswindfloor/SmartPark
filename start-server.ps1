# PowerShell脚本来启动服务端和客户端

# 切换到server目录并启动服务端
Set-Location -Path .\server
Start-Process -FilePath "npm" -ArgumentList "run", "dev"

# 等待几秒钟让服务器启动
Start-Sleep -Seconds 3

# 返回主目录并启动客户端
Set-Location -Path ..
npm run dev

# 注意: 要在PowerShell中运行此脚本，可以执行：
# .\start-server.ps1 