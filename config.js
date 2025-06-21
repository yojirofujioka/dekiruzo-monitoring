// 設定ファイル - config.js
// テスト環境用設定

module.exports = {
    // データベース設定
    database: {
        // テスト用：実際のAccessファイルがない場合はダミーモードで動作
        path: process.env.ACCESS_DB_PATH || 'C:\\temp\\test_database.accdb',
        provider: 'Microsoft.ACE.OLEDB.12.0'
    },
    
    // サーバー設定
    server: {
        port: process.env.PORT || 3000,
        host: 'localhost'
    },
    
    // テーブル名設定（Accessのテーブル名に合わせて変更）
    tables: {
        projects: '案件管理テーブル',
        estimates: '見積もりテーブル',
        orders: '発注テーブル',
        suppliers: '仕入れ先テーブル'
    },
    
    // フィールド名マッピング（Accessのフィールド名に合わせて変更）
    fields: {
        projectNo: '物件No',
        projectName: '物件名',
        customer: '顧客名',
        supervisor: '担当者',
        workType: '工事区分',
        contractAmount: '契約額',
        costAmount: '原価金額',
        profitAmount: '利益額',
        profitRate: '利益率',
        status: 'ステータス',
        invoiceDate: '請求日',
        paymentDate: '入金日'
    },
    
    // アラート設定
    alerts: {
        lowProfitThreshold: 15,    // 利益率アラート閾値(%)
        amountDifferenceThreshold: 10, // 金額差異アラート閾値(%)
        overdueDeadline: 30        // 支払い遅延アラート(日)
    },
    
    // メール通知設定
    email: {
        enabled: false,
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-app-password'
        },
        from: 'your-email@gmail.com',
        to: ['supervisor@company.com']
    },
    
    // テスト・デバッグ設定
    development: {
        useMockData: true,          // AccessDBが利用できない場合のダミーデータ使用
        logLevel: 'debug',          // ログレベル
        enableCors: true,           // CORS有効化
        mockDelay: 100              // APIレスポンスの模擬遅延(ms)
    }
}; 