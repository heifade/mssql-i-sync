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
    "server": "115.159.126.123", // 源数据源地址
    "port": 1433, // 源数据库端口
    "user": "mapRegion", // 源数据库用户名
    "password": "abc,234", // 源数据库密码
    "database": "mapRegion", // 源数据库
    "tables": ["boundary"], // 源数据库 表
    "primaryKeys": ["id"], // 源数据库 主键
    "connectionTimeout": 6000000
  },
  "targetDataBase": {
    "server": "115.159.126.123", // 目标数据库地址
    "port": 1433, // 目标数据库端口
    "user": "mapRegion", // 目标数据库用户名
    "password": "abc,234", // 目标数据库密码
    "database": "mapRegion2", // 目标数据库
    "tables": ["boundary"], // 目标数据库 表
    "connectionTimeout": 6000000
  }
}
```
