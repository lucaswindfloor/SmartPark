// 启动开发服务器的Node.js脚本
// 此脚本解决在Windows PowerShell中无法使用&&符号连接命令的问题

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 获取当前工作目录
const rootDir = process.cwd();
const serverDir = path.join(rootDir, 'server');

// 检查server目录是否存在
const serverExists = fs.existsSync(serverDir);
console.log(`Server directory ${serverExists ? 'exists' : 'does not exist'}: ${serverDir}`);

// 尝试启动后端服务
if (serverExists) {
  console.log('Starting backend server...');
  const backend = spawn('npm', ['run', 'dev'], { 
    cwd: serverDir,
    shell: true,
    stdio: 'inherit'
  });

  backend.on('error', (err) => {
    console.error('Failed to start backend server:', err);
  });

  // 给后端一点时间启动
  setTimeout(() => {
    // 启动前端服务
    console.log('Starting frontend...');
    const frontend = spawn('npm', ['run', 'dev'], { 
      cwd: rootDir,
      shell: true,
      stdio: 'inherit'
    });

    frontend.on('error', (err) => {
      console.error('Failed to start frontend:', err);
    });
  }, 3000);
} else {
  console.log('Server directory not found, starting frontend only...');
  // 只启动前端
  const frontend = spawn('npm', ['run', 'dev'], { 
    cwd: rootDir,
    shell: true,
    stdio: 'inherit'
  });

  frontend.on('error', (err) => {
    console.error('Failed to start frontend:', err);
  });
}

console.log('Dev server script started. Press Ctrl+C to stop all processes.'); 