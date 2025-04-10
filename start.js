const { spawn } = require('child_process');
const os = require('os');

// 确定正确的npm命令（Windows上使用npm.cmd）
const npmCmd = os.platform() === 'win32' ? 'npm.cmd' : 'npm';

// 启动开发服务器
console.log('Starting development server...');
const child = spawn(npmCmd, ['run', 'dev'], { stdio: 'inherit' });

child.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
}); 