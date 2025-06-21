# 現場監督業務監視システム - AccessDB連携セットアップ

## 🚀 セットアップ手順

### 1. 前提条件

**必要なソフトウェア:**
- Node.js (v14以上)
- Microsoft Access (2016以上推奨)
- Windows OS（Access OLEDBドライバーが必要）

**必要なAccessドライバー:**
- Microsoft Access Database Engine 2016 Redistributable
- [ダウンロード](https://www.microsoft.com/ja-jp/download/details.aspx?id=54920)

### 2. プロジェクトのセットアップ

```bash
# 1. 依存関係のインストール
npm install

# 2. 設定ファイルの作成
cp config.example.js config.js

# 3. サーバー起動
npm start

# または開発モード
npm run dev
```

### 3. Accessデータベースの準備

#### 必要なテーブル構造:

**案件管理テーブル:**
```sql
CREATE TABLE [案件管理テーブル] (
    [物件No] TEXT(20) PRIMARY KEY,
    [物件名] TEXT(100),
    [顧客名] TEXT(100),
    [担当者] TEXT(50),
    [工事区分] TEXT(50),
    [契約額] CURRENCY,
    [原価金額] CURRENCY,
    [利益額] CURRENCY,
    [利益率] DOUBLE,
    [ステータス] TEXT(20),
    [請求日] DATE,
    [入金日] DATE
);
```

**見積もりテーブル:**
```sql
CREATE TABLE [見積もりテーブル] (
    [ID] AUTONUMBER PRIMARY KEY,
    [物件No] TEXT(20),
    [カテゴリ] TEXT(50),
    [内容] TEXT(200),
    [金額] CURRENCY,
    [備考] TEXT(500)
);
```

**発注テーブル:**
```sql
CREATE TABLE [発注テーブル] (
    [ID] AUTONUMBER PRIMARY KEY,
    [物件No] TEXT(20),
    [仕入れ先] TEXT(100),
    [発注日] DATE,
    [品番] TEXT(50),
    [商品名] TEXT(200),
    [数量] INTEGER,
    [単価] CURRENCY,
    [金額] CURRENCY
);
```

### 4. 設定ファイルの編集

`config.js`を編集して、実際の環境に合わせて設定してください：

```javascript
module.exports = {
    database: {
        path: 'C:\\Users\\YourName\\Documents\\現場管理.accdb',  // 実際のパス
        provider: 'Microsoft.ACE.OLEDB.12.0'
    },
    
    tables: {
        projects: '案件管理テーブル',     // 実際のテーブル名
        estimates: '見積もりテーブル',
        orders: '発注テーブル'
    },
    
    // 実際のフィールド名に合わせて調整
    fields: {
        projectNo: '物件No',
        projectName: '物件名',
        // ... 他のフィールド
    }
};
```

### 5. アクセス権限の設定

**Accessファイルの権限:**
- ファイルの読み取り・書き込み権限を付与
- ネットワーク共有の場合は適切な共有設定

**Windows セキュリティ:**
- Node.jsプロセスにファイルアクセス権限を付与
- 必要に応じてUACの調整

### 6. 動作確認

```bash
# サーバー起動
npm start

# ブラウザでアクセス
http://localhost:3000
```

**確認項目:**
- [ ] データベース接続成功メッセージ
- [ ] 案件一覧の表示
- [ ] 検索・フィルター機能
- [ ] 照合チェック機能

## 🔧 トラブルシューティング

### よくある問題と解決策

**1. "Provider cannot be found" エラー**
```
解決策: Microsoft Access Database Engine をインストール
https://www.microsoft.com/ja-jp/download/details.aspx?id=54920
```

**2. "Cannot open database" エラー**
```
解決策: 
- ファイルパスを確認
- ファイルアクセス権限を確認
- Accessファイルが他で開かれていないか確認
```

**3. "Permission denied" エラー**
```
解決策:
- Node.jsを管理者権限で実行
- ファイルの読み書き権限を確認
```

**4. パフォーマンスが遅い**
```
解決策:
- Accessファイルを最適化（圧縮・修復）
- インデックスの追加
- 不要なデータの削除
```

### デバッグ方法

**ログの確認:**
```bash
# 詳細ログモード
DEBUG=* npm start
```

**データベース接続テスト:**
```javascript
// test-connection.js を実行
node test-connection.js
```

## 🚀 運用開始

### 1. 本番環境の準備

**データバックアップ:**
```bash
# 定期バックアップスクリプトの設定
# backup-script.bat を作成
```

**監視設定:**
- プロセス監視（PM2推奨）
- ログ監視
- ディスク容量監視

### 2. ユーザートレーニング

**基本操作:**
- データの検索・フィルター
- 照合チェックの実行
- アラート確認

**管理者操作:**
- データの追加・更新
- 設定変更
- バックアップ・復旧

### 3. メンテナンス

**日次作業:**
- [ ] システム稼働確認
- [ ] アラート確認
- [ ] バックアップ確認

**週次作業:**
- [ ] パフォーマンス確認
- [ ] ログファイル整理
- [ ] データ整合性チェック

**月次作業:**
- [ ] データベース最適化
- [ ] セキュリティ更新
- [ ] 容量確認

## 📞 サポート

**技術的な問題:**
- ログファイルを確認
- エラーメッセージをコピー
- 開発チームに連絡

**機能改善要望:**
- GitHub Issues に登録
- 詳細な要望内容を記載

---

## 🔗 関連リンク

- [Node.js公式サイト](https://nodejs.org/)
- [Microsoft Access OLEDB](https://docs.microsoft.com/ja-jp/sql/ado/guide/appendixes/microsoft-ole-db-provider-for-microsoft-jet)
- [プロジェクトWiki](https://github.com/yojirofujioka/dekiruzo-monitoring/wiki) 