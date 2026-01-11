# API 規格說明文件

## 1. 取得所有紀錄 (GET)
- **路由**: `/api/transactions`
- **回應範例**:
  ```json
  [ { "_id": "123", "title": "午餐", "amount": 100, "type": "expense", "category": "餐飲", "date": "2026-01-12" } ]


## 2. 新增帳目 (POST)
- **路由**: `/api/transactions`
- **參數**:
  ```json
  [ { "title": String, "amount": Number, "type": String, "category": String, "date": String } ]


## 3. 更新帳目 (PUT)
- **路由**: `/api/transactions/:id`
- **參數**:
  ```json
  [ { "title": String, "amount": Number } ]


## 4. 刪除帳目 (DELETE)
- **路由**: `/api/transactions/:id`
