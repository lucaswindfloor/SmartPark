import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// 启用调试模式
sqlite3.verbose();

// 确保数据目录存在
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 数据库文件路径
const dbPath = path.resolve(dbDir, 'smartpark.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('连接数据库出错:', err.message);
  } else {
    console.log('已连接到SQLite数据库');
    // 启用外键约束
    db.run('PRAGMA foreign_keys = ON');
  }
});

// Promise封装的查询方法
export const dbQuery = {
  // 执行SQL语句，无需返回结果
  run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  },

  // 查询单行数据
  get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as T);
        }
      });
    });
  },

  // 查询多行数据
  all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  },

  // 执行事务
  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    try {
      await this.run('BEGIN TRANSACTION');
      const result = await callback();
      await this.run('COMMIT');
      return result;
    } catch (error) {
      await this.run('ROLLBACK');
      throw error;
    }
  }
};

// 关闭数据库连接
export const closeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error('关闭数据库连接出错:', err.message);
        reject(err);
      } else {
        console.log('数据库连接已关闭');
        resolve();
      }
    });
  });
};

export default db; 