# 基於區塊鏈之碳權交易系統

## 專案簡介

這是一個基於以太坊區塊鏈的碳權交易系統,旨在為碳權交易提供一個透明、高效的平台。本系統運行在以太坊 Holesky 測試網上,實現了碳權代幣的發行、交易、抵免等核心功能。

## 主要特色

- 🌱 支持碳權代幣的發行與交易
- 🔒 安全可靠的區塊鏈架構
- 📝 完整的抵免記錄追蹤
- 👥 便捷的用戶介面
- 🔍 多維度的查詢功能
- ⚡ 即時的交易確認

## 系統功能

### 基礎功能
- MetaMask 錢包連接與管理
- 碳權代幣轉移
- 碳權抵免操作
- 抵免記錄查詢

### 管理功能
- 碳權代幣鑄造(管理員)
- 系統暫停/恢復(管理員)
- 交易監控

### 查詢功能
- 即時餘額查詢
- 單筆抵免記錄查詢
- 地址歷史記錄查詢
- 最近抵免記錄顯示

## 技術架構

### 前端技術
- HTML5/CSS3
- JavaScript (ES6+)
- ethers.js v6
- Web3Modal

### 智能合約
- Solidity ^0.8.20
- OpenZeppelin 合約庫


### 區塊鏈網絡
- 以太坊 Holesky 測試網
- ERC20 代幣標準
- 事件日誌機制

## 快速開始

### 環境準備
1. 安裝 MetaMask 錢包
2. 切換到 Holesky 測試網
3. 獲取測試用 ETH ([Holesky Faucet](https://faucet.quicknode.com/ethereum/holesky))

### 本地部署
```bash
# 克隆專案
git clone https://github.com/Skyblue2016219/blockchain-carbon-credit-trading-system.git

# 安裝依賴
cd blockchain-carbon-credit-trading-system
npm install

# 啟動本地服務器
npm run dev
```

### 合約部署
1. 使用 Remix IDE 部署合約
2. 更新 `app.js` 中的合約地址
3. 確認合約初始化參數

## 使用指南

### 基本操作流程
1. 連接 MetaMask 錢包
2. 確認網絡設置(Holesky)
3. 進行碳權交易或抵免操作
4. 查看交易結果和記錄

### 注意事項
- 確保錢包中有足夠的 ETH 支付 Gas 費用
- 仔細檢查交易參數再確認
- 定期備份重要數據
- 注意網絡安全

## 問題排解

### 常見問題
Q: 交易一直待確認怎麼辦？
A: 檢查 Gas 價格設置,可以適當提高 Gas 以加快確認速度。

Q: 為什麼看不到我的代幣餘額？
A: 確認是否已將代幣合約地址添加到 MetaMask。

Q: 交易失敗怎麼辦？
A: 檢查您的 ETH 餘額是否足夠支付燃料費，確保網絡連接穩定，然後重試。如果問題持續，可能是合約暫停或其他問題，請聯繫管理員。

## 參與貢獻

我們歡迎各種形式的貢獻:
- 提交 Bug 報告
- 改進文檔
- 提供新功能建議
- 提交程式碼

## 許可證

本專案採用 [MIT 許可證]。

## 聯繫方式

- Email: skyblue2016219@gmail.com

