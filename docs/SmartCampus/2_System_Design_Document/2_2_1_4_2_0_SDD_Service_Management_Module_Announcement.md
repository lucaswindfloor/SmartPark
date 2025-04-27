设计方案

### 1. 合理性分析

状态与权限挂钩，权限灵活分配，适合智慧园区轻量需求：

- **灵活性**：一人多权限或多人协作，适应小型到中型园区。
- **直观性**：状态驱动操作，动态显示可执行操作。
- **扩展性**：支持新增状态、权限、类型，改动成本低.
- **监督与效率**：分级审核确保质量，推送和统计提升效果。

#### 优缺点

- **优点**：
  - 权限灵活，适应不同团队。
  - 状态驱动，操作清晰。
  - 扩展性强，流程变化改动小。
  - 多渠道推送和统计提升传达效果。
- **缺点**：
  - 权限分散增加管理复杂度。
  - 误操作需 confirmation 机制降低风险.
  - 分级审核需合理配置。

---

### 2. Database Design

#### 表结构

1. **通知公告表 (`announcements`)**
   - 字段：
     - `id` (主键)：公告唯一标识。
     - `title` (字符串，≤50字)：标题。
     - `content` (文本)：正文（富文本）。
     - `status` (枚举)：草稿、待审核、待发布、已发布、已过期、已取消发布、档案。
     - `creator_id` (外键)：起草人ID。
     - `scope` (枚举)：公开范围（all、enterprise、role）。
     - `scope_details` (JSON，可空)：范围详情（企业ID、角色ID列表）。
     - `type` (枚举)：类型（normal、policy、event、emergency）。
     - `importance` (枚举)：重要性（normal、important、emergency）。
     - `require_confirmation` (布尔，默认false)：是否需确认。
     - `confirmation_deadline` (时间，可空)：确认截止时间。
     - `view_count` (整数，默认0)：查看次数。
     - `created_at` (时间)：创建时间。
     - `updated_at` (时间)：更新时间。
     - `published_at` (时间，可空)：发布时间。
     - `scheduled_publish_at` (时间，可空)：定时发布时间。
     - `expired_at` (时间，可空)：过期时间。
     - `is_pinned` (布尔)：是否置顶。
     - `validity_period` (整数，可空)：有效期（默认7天）。
     - `archived_at` (时间，可空)：归档时间。
     - `attachments` (JSON，可空)：附件信息（文件名、URL）。
   - **扩展性**：`status`、`type`、`importance`支持新值，`extra_data` (JSON) 预留字段。

2. **用户表 (`users`)**
   - 字段：
     - `id` (主键)：用户唯一标识。
     - `username` (字符串)：用户名。
     - `email` (字符串，可空)：用于通知。
     - `enterprise_id` (外键，可空)：所属企业ID。
     - `role` (字符串，可空)：角色（如员工、管理员）。

3. **权限表 (`user_permissions`)**
   - 字段：
     - `id` (主键)：记录唯一标识。
     - `user_id` (外键)：用户ID。
     - `permission` (枚举)：draft、audit、publish、manage、archive。
   - **扩展性**：`permission`支持新权限。

4. **操作日志表 (`announcement_logs`)**
   - 字段：
     - `id` (主键)：日志唯一标识。
     - `announcement_id` (外键)：公告ID。
     - `operation` (字符串)：操作类型（如提交审核、发布）。
     - `user_id` (外键)：操作人ID。
     - `comment` (文本，可空)：备注（如驳回原因）。
     - `created_at` (时间)：操作时间。
   - **扩展性**：`operation`支持新类型。

5. **查看记录表 (`announcement_views`)**
   - 字段：
     - `id` (主键)：记录唯一标识。
     - `announcement_id` (外键)：公告ID。
     - `user_id` (外键)：查看用户ID。
     - `viewed_at` (时间)：查看时间。
   - **扩展性**：索引优化查询性能。

6. **确认记录表 (`announcement_confirmations`)**
   - 字段：
     - `id` (主键)：记录唯一标识。
     - `announcement_id` (外键)：公告ID。
     - `user_id` (外键)：确认用户ID。
     - `confirmed_at` (时间，可空)：确认时间。
   - **扩展性**：支持扩展确认逻辑。

7. **回收站表 (`recycle_bin`)**
   - 字段：
     - `id` (主键)：回收记录唯一标识。
     - `announcement_id` (外键)：公告ID。
     - `deleted_by` (外键)：删除人ID。
     - `deleted_at` (时间)：删除时间。
     - `expire_at` (时间)：回收站过期时间（30天）。
   - **扩展性**：支持恢复后状态调整。

8. **系统消息表 (`system_messages`)**
   - 字段：
     - `id` (主键)：系统消息唯一标识。
     - `announcement_id` (外键，可空)：关联公告ID。
     - `recipient_id` (外键)：接收人ID。
     - `type` (枚举)：消息类型（inbox、app、sms）。
     - `content` (文本)：消息内容。
     - `sent_at` (时间)：发送时间。
   - **扩展性**：支持新消息类型。

#### 设计原则

- **规范化**：外键确保数据一致性。
- **灵活性**：枚举和 JSON 字段支持扩展。
- **软删除**：删除记录至回收站。
- **索引**：为 `status`、`announcement_id`、`user_id` 加索引。

---

### 3. Backend Logic Design

Backend采用 **RESTful API**，状态机管理流程，权限表校验操作。

#### API 设计

- **起草（draft 权限）**：
  - `POST /announcements`：创建草稿（标题、正文、公开范围、类型、重要性、确认设置、附件）。
  - `PUT /announcements/{id}`：编辑草稿。
  - `POST /announcements/{id}/submit`：提交审核。
  - `DELETE /announcements/{id}`：删除草稿。
- **审核（audit 权限）**：
  - `POST /announcements/{id}/audit`：审核（通过、驳回、建议修改）。
- **发布（publish 权限）**：
  - `POST /announcements/{id}/publish`：发布公告（即时/定时），初始化查看/确认记录。
  - `POST /announcements/{id}/withdraw`：撤回至草稿。
  - `GET /announcements/{id}/preview`：预览公告。
- **管理（manage 权限）**：
  - `POST /announcements/{id}/pin`：置顶。
  - `POST /announcements/{id}/unpin`：取消置顶。
  - `POST /announcements/{id}/extend`：延期。
  - `POST /announcements/{id}/cancel`：取消发布。
  - `DELETE /announcements/{id}`：删除公告。
  - `GET /announcements/{id}/views`：查询阅读统计（阅读量、率、按企业）。
  - `GET /announcements/{id}/confirmations`：查询确认统计（已确认/未确认用户）。
- **归档（archive 权限）**：
  - `GET /announcements/archived`：查询归档公告。
  - `POST /announcements/{id}/archive`：归档。
  - `POST /announcements/{id}/unarchive`：解档。
- **其他**：
  - `GET /scopes`：返回公开范围选项（企业、角色）。
  - `GET /types`：返回通知类型选项。
  - `POST /announcements/{id}/view`：记录查看（所有用户）。
  - `POST /announcements/{id}/confirm`：确认接收（目标用户）。
  - `GET /announcements/logs`：查询日志（管理员）。
  - `GET /recycle-bin`：查询回收站（管理员）。
  - `POST /recycle-bin/{id}/restore`：恢复公告（管理员）。

#### 服务层逻辑

- **状态机**：管理状态转换，规则存储在配置文件或数据库。
- **权限控制**：
  - 查询 `user_permissions` 表校验权限，管理员绕过检查。
  - 不同角色可见范围：
    - 管理员/运营人员：查看所有公告。
    - 企业用户：仅查看针对自身公告（基于 `scope` 和 `scope_details`）。
- **消息服务**：
  - 提交审核：发送系统消息给有 audit 权限的用户。
  - 审核通过/驳回：发送系统消息给起草人和有 publish 权限的用户。
  - 发布：根据 `scope` 和 `importance` 推送系统消息（站内信、App、短信）。
  - 确认截止前：提醒未确认用户（系统→企业管理员→电话）。
  - 使用异步队列（如 RabbitMQ）发送系统消息。
- **定时任务**：
  - 自动过期：检查 `expired_at`，转为已过期。
  - 自动归档：已过期/已取消发布3天后归档。
  - 回收站清理：删除超期记录。
  - 审核超时：24小时未审核，提醒有 audit 权限的用户。
  - 定时发布：检查 `scheduled_publish_at`，执行发布。
  - 确认提醒：截止前提醒未确认用户。
- **日志记录**：操作写入 `announcement_logs`。
- **异常处理**：
  - 审核超时：发送提醒，超期通知管理员。
  - 系统故障：事务确保原子性，失败回滚并记录日志.
  - 权限错误：返回 403，记录非法操作。

---

### 4. Frontend Logic Design

Frontend采用 **Vue/React**，组件化设计，界面简洁。

#### 页面设计

- **公告列表**：
  - 显示草稿、待审核、待发布、已发布、已过期、已取消发布、档案等公告。
  - 支持筛选（类型、状态、时间、关键词）、模糊搜索（标题、内容）、按阅读率排序。
  - 显示字段：标题、类型、重要性、状态、发布时间、阅读数。
- **公告详情**：展示内容、状态、操作历史、阅读/确认统计。
- **起草页面**：创建/编辑草稿（标题、正文、公开范围、类型、重要性、确认设置、附件，draft 权限）。
- **审核页面**：显示待审核公告，提供通过/驳回/建议修改（audit 权限）。
- **发布页面**：支持预览/发布/撤回（publish 权限）。
- **管理页面**：支持置顶/延期/取消发布/删除/阅读统计/确认统计（manage 权限），归档（archive 权限）。
- **归档页面**：查询归档公告，解档（archive 权限）。
- **回收站页面**：显示已删除公告，恢复（archive 权限）。

#### 组件化设计

- **状态组件**：根据状态和权限动态显示操作按钮。
- **操作组件**：封装提交、审核、发布、确认接收等操作。
- **消息组件**：显示审核、发布、确认提醒等系统消息。
- **统计组件**：展示阅读量/率、确认情况（按企业分析）。

#### 交互逻辑

- **权限控制**：根据权限隐藏不可用按钮，基于用户角色过滤公告（管理员全览，企业用户限自身）。
- **表单验证**：编辑草稿校验必填字段（标题）、附件大小。
- **公开范围**：下拉框/多选框选择范围（调用 `GET /scopes`）。
- **类型与重要性**：下拉框选择类型和重要性（调用 `GET /types`）。
- **查看记录**：查看详情时调用 `POST /announcements/{id}/view`。
- **确认接收**：若需确认，显示"确认收到"按钮（调用 `POST /announcements/{id}/confirm`）。
- **操作 confirmation**：发布、撤回、取消发布、删除需二次 confirmation。
- **实时更新**：WebSocket/轮询获取系统消息。

---

### 5. Future Change Adaptability

设计灵活，适应流程变化成本低：

1. **New State (e.g., "待确认")**:
   - Database: Add to `announcements.status` enum.
   - Backend: Update state machine, add API and permission mapping.
   - Frontend: Update state component.
   - **Difficulty**: Low.
2. **New Permission (e.g., "查看")**:
   - Database: Add to `user_permissions.permission` enum.
   - Backend: Update permission validation.
   - Frontend: Adjust button display.
   - **Difficulty**: Low.
3. **Permission Adjustment (e.g., Multi-auditor)**:
   - Database: `user_permissions` supports multiple audit permissions.
   - Backend: Adjust audit logic.
   - Frontend: Display multi-user status.
   - **Difficulty**: Medium, limited to audit module.
4. **New Operation (e.g., "转发")**:
   - Database: Add to `announcement_logs.operation`.
   - Backend: Add API.
   - Frontend: Add button.
   - **Difficulty**: Low.
5. **New Type/Importance**:
   - Database: Add to `announcements.type` or `importance` enum.
   - Backend: Update `GET /types` API.
   - Frontend: Update dropdown options.
   - **Difficulty**: Low.

