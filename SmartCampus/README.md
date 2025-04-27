# SmartCampus 智慧园区系统

## 项目结构

- **src/main**: Java后端代码目录
- **src/main/webapp**: 前端代码目录

## 启动方式

### 方式一：一键启动所有服务

```bash
# 在SmartCampus目录下执行
start-all.bat
```

这将同时启动后端服务和前端应用。

### 方式二：分别启动后端和前端

1. 启动后端服务器：
```bash
# 在SmartCampus目录下执行
start-server.bat
```

2. 启动前端应用：
```bash
# 在SmartCampus目录下执行
start-webapp.bat
```

## 访问地址

- 后端API: http://localhost:8080
- 前端应用: http://localhost:3000

## Vite代理配置

前端Vite开发服务器已配置代理，将API请求转发到后端：

```javascript
// SmartCampus/src/main/webapp/vite.config.js
server: {
  port: 3000,
  proxy: {
    '/service': {
      target: 'http://localhost:8080',
      changeOrigin: true
    },
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

# Smart Campus Management System

Smart Campus is a comprehensive management system designed to provide digital solutions for campus administration, student services, and facility management.

## Features

- **Notification System**: Centralized notification service that supports various types of notifications:
  - Email notifications
  - SMS notifications 
  - In-app notifications
  - Push notifications
  - System notifications

## Project Structure

The project follows a Domain-Driven Design (DDD) architecture:

- **Domain Layer**: Contains the core business logic and entities
- **Application Layer**: Contains services that coordinate the application
- **Infrastructure Layer**: Contains implementations of repositories and external services
- **Interfaces Layer**: Contains controllers and DTOs for the API

## Getting Started

### Prerequisites

- Java 1.8 or higher
- Maven 3.6.x or higher
- MySQL 8.0 or higher

### Setup

1. Clone the repository
2. Configure your database connection in `application.properties`
3. Run the following commands:

```bash
cd SmartCampus
mvn clean install
mvn spring-boot:run
```

## API Endpoints

### Notification API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/notifications | Create a new notification |
| GET | /api/notifications/{id} | Get notification by ID |
| GET | /api/notifications | Get notifications for recipient |
| GET | /api/notifications/unread | Get unread notifications |
| GET | /api/notifications/unread/count | Count unread notifications |
| PUT | /api/notifications/{id}/read | Mark notification as read |
| DELETE | /api/notifications/{id} | Delete notification |

## Technology Stack

- Spring Boot 2.7.x
- Spring Data JPA
- MyBatis
- MySQL
- Maven
- Lombok 