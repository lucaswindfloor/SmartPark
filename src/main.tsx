import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

// 设置全局的React
window.React = React;

// 添加调试信息
console.log('Starting application...');
console.log('Root element:', document.getElementById('root'));

try {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  console.log('Root created successfully');
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
  console.log('Application rendered');
} catch (error) {
  console.error('Error rendering application:', error);
} 