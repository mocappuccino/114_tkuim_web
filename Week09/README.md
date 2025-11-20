# Week09

快速啟動
- 進入 server：
```powershell
cd Week09/server
```
- 安裝並啟動：
```powershell
npm install
npm run dev
```
- 開啟：`Week09/client/signup_form.html`

快速檢查（curl 範例）
```powershell
curl http://localhost:3001/api/signup

curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CLI",
    "email": "cli@example.com",
    "phone": "0911222333",
    "password": "cliPass88",
    "confirmPassword": "cliPass88",
    "interests": ["資料庫"],
    "terms": true
  }'

```

測試
- VS Code REST Client (`tests/api.http`) 或 Postman (`tests/signup_collection.json`)。


