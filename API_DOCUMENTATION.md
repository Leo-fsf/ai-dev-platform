# API文档

## 认证API

### POST /api/auth
用户认证（登录/注册/登出）

**请求体：**
```json
{
  "action": "login" | "register" | "logout",
  "email": "string",
  "password": "string",
  "name": "string" (注册时必需)
}
```

**响应：**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

---

## AI对话API

### POST /api/chat
AI对话接口

**请求体：**
```json
{
  "messages": [
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ],
  "conversationId": "string" (可选)
}
```

**响应：**
```json
{
  "response": "string",
  "conversationId": "string"
}
```

---

## 项目API

### GET /api/projects
获取项目列表

**查询参数：**
- `userId`: string (可选)

**响应：**
```json
{
  "projects": [
    {
      "id": "string",
      "userId": "string",
      "name": "string",
      "description": "string",
      "tags": ["string"],
      "likes": number,
      "forks": number,
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ]
}
```

### POST /api/projects
创建项目

**请求体：**
```json
{
  "name": "string",
  "description": "string",
  "tags": ["string"],
  "code": "string" (可选)
}
```

### GET /api/projects/[id]
获取项目详情

**响应：**
```json
{
  "project": {
    "id": "string",
    "userId": "string",
    "name": "string",
    "description": "string",
    "tags": ["string"],
    "likes": number,
    "forks": number,
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

### PATCH /api/projects/[id]
更新项目

**请求体：**
```json
{
  "name": "string",
  "description": "string",
  "tags": ["string"]
}
```

### DELETE /api/projects/[id]
删除项目

### POST /api/projects/[id]/action
项目操作（点赞/Fork）

**请求体：**
```json
{
  "action": "like" | "fork"
}
```

---

## 用户API

### GET /api/user
获取用户信息

**查询参数：**
- `userId`: string

**响应：**
```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "avatar": "string",
    "bio": "string"
  },
  "theme": {
    "mode": "light" | "dark",
    "language": "zh" | "en"
  }
}
```

### PATCH /api/user
更新用户信息

**请求体：**
```json
{
  "name": "string",
  "email": "string",
  "bio": "string"
}
```

---

## 错误响应

所有API在失败时返回：

```json
{
  "error": "错误描述"
}
```

HTTP状态码：
- `200` - 成功
- `400` - 请求错误
- `401` - 未授权
- `404` - 资源不存在
- `500` - 服务器错误
