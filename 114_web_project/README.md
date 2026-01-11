# 114 網路程式設計期末專題 - 記帳小幫手

這是一款簡潔風記帳程式，功能淺顯易懂，任何人都可以輕易上手。

## 核心功能
- **記帳管理**：支援收入/支出分類、自定義日期錄入。
- **智慧排序**：首頁顯示「近期新增」3筆，切換「顯示全部」按日期排序。
- **原地編輯**：點擊清單項目名稱可直接修改內容與金額。
- **數據分析**：左側滑動抽屜顯示當月收支對比圖與支出圓餅圖。
- **日期搜尋**：可精確篩選特定日期的消費紀錄。

## 技術
- **前端**: React, Tailwind CSS, Recharts, Axios
- **後端**: Node.js, Express, MongoDB

## 🚀 執行步驟
1. **資料庫**：啟動 Docker 中的 MongoDB 容器。
2. **後端 (Backend)**：
   ```bash
   cd backend
   npm install
   npx nodemon server.js
3. **前端 (Frontend)**：
   ```bash
   cd frontend
    npm install
    npm run dev

## API 說明
於docs文件內(api_spec.md)

### DEMO 影片
https://drive.google.com/drive/folders/1rXuXK_MbKIGxLt_7XJ5ccSsl_DNbV6JU?usp=sharing
