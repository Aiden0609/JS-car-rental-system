# 汽车租赁管理系统（Car Rental Management System）

基于 **Express + Node.js + Sequelize + MySQL** 的租车系统管理端，用于练习环境搭建、数据库迁移与基础的增删改查操作。

> 本项目无登录鉴权、无缓存、无消息队列，属于练习性质项目。

## 功能特性

- **首页概览**：实时统计车辆（总数 / 可用 / 已租出 / 维护中）、客户总数、租赁记录（总数 / 进行中 / 已完成），并展示最近车辆与最近租赁记录。
- **车辆管理**：车辆的增删改查；支持按品牌、车牌号、状态、日租金范围分页筛选；已租出的车辆不可删除。
- **客户管理**：客户的增删改查；支持按姓名、电话、驾驶证号分页筛选。
- **租赁管理**：发起租赁（自动将车辆置为「已租出」）、还车结算（按 `日租金 × 天数` 自动计算费用，车辆恢复「可用」）；支持按状态、客户分页筛选；进行中的租赁不可删除。

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 后端 | Express · Node.js 24.16.0 · Sequelize |
| 数据库 | MySQL 8.3.0（Docker Desktop） |
| 前端 | 原生 HTML / CSS / JavaScript（静态页面，无框架） |
| 其他 | 无缓存 · 无 MQ · 无登录鉴权 |

## 项目结构

```
├── app.js                  # Express 应用入口：中间件装配与路由挂载
├── bin/www                 # HTTP 服务启动脚本
├── config/config.json      # 数据库连接配置（development / test / production）
├── docker-compose.yml      # MySQL 8.3.0 容器编排
├── models/                 # Sequelize 模型：Car、Customer、Rental
├── migrations/             # 数据库迁移脚本
├── seeders/                # 种子数据（车辆 / 客户 / 租赁）
├── routes/                 # 业务路由：cars、customers、rentals（index / users 为脚手架占位）
├── utils/responses.js      # 统一成功 / 失败响应封装
└── public/                 # 前端静态页面
    ├── index.html          # 首页概览
    ├── cars.html           # 车辆管理
    ├── customers.html      # 客户管理
    ├── rentals.html        # 租赁管理
    ├── js/common.js        # 通用工具：请求封装、提示、格式化、分页、弹窗
    └── stylesheets/style.css
```

## 快速开始

### 1. 启动数据库

```bash
docker compose up -d
```

### 2. 安装依赖

```bash
npm install
```

### 3. 数据库迁移与种子数据

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

> 数据库连接信息见 `config/config.json`（默认 `root / car1234 @ 127.0.0.1:3306`，库名 `car_rental_development`）。

### 4. 启动服务

```bash
npm start
```

启动后访问 <http://localhost:3000>。

## API 接口

统一响应格式：成功 `{ status: true, message, data }`；失败 `{ status: false, message, errors }`。

### 车辆 `/cars`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/cars` | 分页查询车辆列表，支持 `brand`、`licensePlate`、`status`、`dailyRateMin`、`dailyRateMax`、`currentPage`、`pageSize` |
| GET | `/cars/:id` | 查询车辆详情 |
| POST | `/cars` | 新增车辆 |
| PUT | `/cars/:id` | 更新车辆 |
| DELETE | `/cars/:id` | 删除车辆（已租出 RENTED 时返回 409） |

### 客户 `/customers`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/customers` | 分页查询客户列表，支持 `name`、`phone`、`driversLicense`、`currentPage`、`pageSize` |
| GET | `/customers/:id` | 查询客户详情 |
| POST | `/customers` | 新增客户 |
| PUT | `/customers/:id` | 更新客户 |
| DELETE | `/customers/:id` | 删除客户 |

### 租赁 `/rentals`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/rentals` | 分页查询租赁列表（含车辆、客户关联信息），支持 `status`、`customerId`、`currentPage`、`pageSize` |
| GET | `/rentals/:id` | 查询租赁详情 |
| POST | `/rentals` | 发起租赁（校验车辆可用，将车辆置为 RENTED） |
| POST | `/rentals/:id/return` | 还车结算（按日租金 × 天数计算费用，车辆恢复 AVAILABLE） |
| PUT | `/rentals/:id` | 更新租赁 |
| DELETE | `/rentals/:id` | 删除租赁（进行中 ONGOING 时返回 409） |

> `GET /` 与 `GET /users` 为脚手架占位路由。

## Bug 报告

### 弹窗无法通过「取消 / 关闭」按钮退出，只能点击空白处退出

**严重程度**：中等（影响操作，不影响数据）

**现象**：在前端的「编辑 / 更新」弹窗和「查看详情」弹窗中，点击右上角的 ✕ 关闭按钮或底部的「取消 / 关闭」按钮均无任何反应，弹窗无法关闭；只有点击弹窗外部空白区域（遮罩层）才能退出弹窗。

**复现步骤**

1. 打开任意管理页（车辆 / 客户 / 租赁）。
2. 点击某条记录的「编辑」，打开编辑弹窗；或点击「查看」，打开详情弹窗。
3. 点击弹窗右上角 ✕，或底部「取消 / 关闭」按钮。
4. 弹窗没有任何响应，仍保持打开。

**影响范围**

- 受影响：所有带有 `data-close` 按钮的弹窗，包括 **新增 / 编辑弹窗、详情弹窗**，以及租赁页的**还车弹窗**（车辆、客户、租赁三个页面均存在）。
- 不受影响：点击弹窗外部遮罩层可正常关闭。

**原因分析**

弹窗的「取消 / 关闭 / ✕」按钮在 HTML 中均带有 `data-close="弹窗id"` 属性（例如 `public/cars.html` 中的 `<button class="modal-close" data-close="edit-modal">&times;</button>`），但前端仅实现了「点击遮罩层关闭」的逻辑：

- `public/js/common.js` 中 `openModal()` / `closeModal()` 通过切换 `open` 类控制弹窗显隐；
- 唯一的点击监听器只处理了 `e.target` 上带有 `modal` 类（即遮罩层本身）的情况；
- **代码中缺少对 `[data-close]` 按钮的点击事件监听**，因此这些按钮点击后不会触发任何关闭逻辑。

**修复建议**

在 `public/js/common.js` 中补充一个对 `[data-close]` 的事件委托监听，例如：

```js
/* 点击带 data-close 属性的按钮（取消 / 关闭 / ✕）时关闭对应弹窗 */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-close]');
  if (btn) closeModal(btn.dataset.close);
});
```

## 已知待办

- `routes/customers.js`：客户详情接口暂未查询客户的租赁记录（Pending）。
- `routes/customers.js`：删除客户暂未做软删除与「有进行中订单不可删除」的校验（Pending）。
