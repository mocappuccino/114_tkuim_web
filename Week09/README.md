# Week09

快速啟動
1. 進入 server：
```powershell
cd Week09/server
```
1. 安裝並啟動：
```powershell
npm install
npm run dev
```
1. 在瀏覽器開啟：`Week09/client/signup_form.html`

快速檢查（curl 範例）
```powershell
curl http://localhost:3001/health | ConvertFrom-Json

curl -X POST http://localhost:3001/api/signup -H 'Content-Type: application/json' -d '{"name":"test","email":"test@example.com","phone":"0912345678","password":"abc12345","confirmPassword":"abc12345","interests":["測試"],"terms":true}' | ConvertFrom-Json

curl http://localhost:3001/api/signup | ConvertFrom-Json
```


測試
- VS Code REST Client (`tests/api.http`) 或 Postman (`tests/signup_collection.json`)。


