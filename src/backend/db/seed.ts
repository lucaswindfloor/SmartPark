import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

// 数据库文件路径
const dbPath = path.resolve(__dirname, '../../../data/smartpark.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath);

// 执行插入查询并返回Promise
const runQuery = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// 执行数据填充
const seedDatabase = async () => {
  try {
    // 清空测试数据
    await runQuery('DELETE FROM notice_confirmations');
    await runQuery('DELETE FROM notice_views');
    await runQuery('DELETE FROM notice_public_ranges');
    await runQuery('DELETE FROM notices');
    await runQuery('DELETE FROM users');

    // 重置自增ID
    await runQuery('DELETE FROM sqlite_sequence WHERE name="users"');
    await runQuery('DELETE FROM sqlite_sequence WHERE name="notices"');
    await runQuery('DELETE FROM sqlite_sequence WHERE name="notice_public_ranges"');
    await runQuery('DELETE FROM sqlite_sequence WHERE name="notice_views"');
    await runQuery('DELETE FROM sqlite_sequence WHERE name="notice_confirmations"');

    // 创建测试用户
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const userPasswordHash = await bcrypt.hash('user123', salt);

    // 插入管理员用户
    await runQuery(`
      INSERT INTO users (username, password, name, email, phone, avatar, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'admin', 
      adminPasswordHash, 
      '系统管理员', 
      'admin@example.com', 
      '13800000000', 
      '/avatars/admin.png', 
      'admin', 
      'active'
    ]);

    // 插入普通用户
    await runQuery(`
      INSERT INTO users (username, password, name, email, phone, avatar, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'user', 
      userPasswordHash, 
      '普通用户', 
      'user@example.com', 
      '13900000000', 
      '/avatars/user.png', 
      'user', 
      'active'
    ]);

    // 创建示例通知数据
    const notices = [
      {
        title: '智慧园区系统上线通知',
        content: '尊敬的各企业、员工：\n\n我们很高兴地通知您，智慧园区管理系统已正式上线...',
        category: 'announcement',
        status: 'published',
        is_top: 1,
        require_confirmation: 1,
        created_by: 1,
        reviewed_by: 1,
        created_at: '2024-06-20 10:00:00',
        updated_at: '2024-06-20 10:30:00',
        published_at: '2024-06-20 10:30:00'
      },
      {
        title: '园区设施维护公告',
        content: '各位园区用户：\n\n为保障园区各项设施正常运行，我们将于本周六进行例行维护...',
        category: 'notice',
        status: 'published',
        is_top: 0,
        require_confirmation: 0,
        created_by: 1,
        reviewed_by: 1,
        created_at: '2024-06-19 14:20:00',
        updated_at: '2024-06-19 15:00:00',
        published_at: '2024-06-19 15:00:00'
      },
      {
        title: '重要安全提醒',
        content: '近期园区周边发生多起安全事件，请各企业注意加强安全管理...',
        category: 'important',
        status: 'draft',
        is_top: 0,
        require_confirmation: 1,
        created_by: 1,
        reviewed_by: null,
        created_at: '2024-06-18 11:15:00',
        updated_at: '2024-06-18 11:15:00',
        published_at: null
      }
    ];

    // 插入通知公告
    for (const notice of notices) {
      const result = await runQuery(`
        INSERT INTO notices (
          title, content, category, status, is_top, require_confirmation, 
          created_by, reviewed_by, created_at, updated_at, published_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        notice.title, notice.content, notice.category, notice.status, 
        notice.is_top, notice.require_confirmation, notice.created_by, 
        notice.reviewed_by, notice.created_at, notice.updated_at, notice.published_at
      ]);

      // 获取新插入通知的ID
      const noticeId = (result as any).lastID;

      // 插入公开范围
      await runQuery(`
        INSERT INTO notice_public_ranges (notice_id, public_range)
        VALUES (?, ?)
      `, [noticeId, 'enterprise']);

      await runQuery(`
        INSERT INTO notice_public_ranges (notice_id, public_range)
        VALUES (?, ?)
      `, [noticeId, 'employee']);

      // 为已发布的通知添加查看和确认记录
      if (notice.status === 'published') {
        await runQuery(`
          INSERT INTO notice_views (notice_id, user_id)
          VALUES (?, ?)
        `, [noticeId, 2]);

        if (notice.require_confirmation) {
          await runQuery(`
            INSERT INTO notice_confirmations (notice_id, user_id)
            VALUES (?, ?)
          `, [noticeId, 2]);
        }
      }
    }

    console.log('数据库填充成功!');
  } catch (error) {
    console.error('创建测试用户失败:', error);
    console.log('详细错误信息:', JSON.stringify(error, null, 2));
  } finally {
    // 关闭数据库连接
    db.close((err) => {
      if (err) {
        console.error('关闭数据库连接出错:', err.message);
      } else {
        console.log('数据库连接已关闭');
      }
    });
  }
};

// 执行数据填充
seedDatabase(); 