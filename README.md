# 异地数据库同步

### 安装
```
  npm install mssql-i-sync
```

### config.json
```json
{
  "pageSize": 10,   // 分页行数
  "sourceDataBase": {
    "server": "***", // 源数据源地址
    "port": 1433, // 源数据库端口
    "user": "***", // 源数据库用户名
    "password": "***", // 源数据库密码，密码需要经过加密
    "database": "***", // 源数据库
    "tables": ["***"], // 源数据库 表
    "primaryKeys": ["***"], // 源数据库 主键
    "connectionTimeout": 6000000
  },
  "targetDataBase": {
    "server": "***", // 目标数据库地址
    "port": 1433, // 目标数据库端口
    "user": "***", // 目标数据库用户名
    "password": "***", // 目标数据库密码，密码需要经过加密
    "database": "***", // 目标数据库
    "tables": ["***"], // 目标数据库 表
    "connectionTimeout": 6000000
  }
}
```

### 密码加密
```
mssql-i-sync-key --text '123456'
```
