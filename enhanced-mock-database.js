// 強化版モックデータベース - 実際の照合業務フロー対応
class EnhancedMockDatabase {
    constructor() {
        // 基本案件データ
        this.projects = [
            {
                物件No: '37.04.001',
                物件名: 'サンプルマンション101',
                顧客名: '株式会社サンプル',
                担当者: '岡田',
                工事区分: 'リノベーション',
                契約額: 5000000,
                見積原価: 3500000,
                利益額: 1500000,
                利益率: 30.0,
                ステータス: '完了',
                請求日: new Date('2024-04-30'),
                入金日: new Date('2024-05-30'),
                請求額: 5000000,
                入金額: 5000000
            },
            {
                物件No: '37.04.002',
                物件名: 'テストビル3F',
                顧客名: '株式会社テスト',
                担当者: '田原',
                工事区分: '原状回復',
                契約額: 1200000,
                見積原価: 950000,
                利益額: 250000,
                利益率: 20.8,
                ステータス: '進行中',
                請求日: new Date('2024-04-30'),
                入金日: null,
                請求額: 1200000,
                入金額: 0
            },
            // 案件管理テーブル（照合サマリー用）
            {
                物件No: '37.07.133',
                物件名: 'パレス代々木　201号室',
                顧客名: '興和管理(株)',
                担当者: '藤岡',
                契約額: 156500,
                原価金額: 125200,
                利益率: 20.0,
                ステータス: '完了',
                発注日: '2025/06/13',
                完了予定日: '2025/07/08'
            },
            {
                物件No: '37.06.124',
                物件名: 'サンアセント　301号室',
                顧客名: 'アプロホールディングス(株)',
                担当者: '藤岡',
                契約額: 172000,
                原価金額: 146400,
                利益率: 14.9,
                ステータス: '照合待ち',
                発注日: '2025/06/11',
                完了予定日: '2025/06/28'
            },
            {
                物件No: '37.06.120',
                物件名: '中外医学社　女子トイレ',
                顧客名: '株式会社東元社',
                担当者: '藤岡',
                契約額: 85000,
                原価金額: 72250,
                利益率: 15.0,
                ステータス: '進行中',
                発注日: '2025/06/20',
                完了予定日: '2025/06/27'
            },
            {
                物件No: '37.06.115',
                物件名: '日興パレス永代　803号室',
                顧客名: '興和管理(株)',
                担当者: '藤岡',
                契約額: 35000,
                原価金額: 31500,
                利益率: 10.0,
                ステータス: '照合待ち',
                発注日: '2025/06/19',
                完了予定日: '2025/06/28'
            },
            {
                物件No: '37.06.110',
                物件名: 'ピアハウス201',
                顧客名: '(株)ウィングスジャパン',
                担当者: '藤岡',
                契約額: 42000,
                原価金額: 33600,
                利益率: 20.0,
                ステータス: '完了',
                発注日: '2025/06/19',
                完了予定日: '2025/07/05'
            }
        ];

        // 見積もり詳細（材料別）
        this.estimates = [
            {
                ID: 1,
                物件No: '37.04.001',
                カテゴリ: '材料',
                品目: 'システムキッチン',
                メーカー: 'パナソニック',
                型番: 'Lacucina',
                見積原価: 780000,
                備考: '標準仕様'
            },
            {
                ID: 2,
                物件No: '37.04.001',
                カテゴリ: '材料',
                品目: 'ユニットバス',
                メーカー: 'TOTO',
                型番: 'WBV1616',
                見積原価: 650000,
                備考: '1616サイズ'
            },
            {
                ID: 3,
                物件No: '37.04.001',
                カテゴリ: '工事',
                品目: '内装工事',
                業者: '内装工事株式会社',
                見積原価: 500000,
                備考: '全面リフォーム'
            }
        ];

        // 実際の工事注文書データ（提供されたデータから）
        this.workOrders = [
            {
                発注日付: '2025/06/20',
                伝票番号: '267934',
                発注先名: '(株)アンセイ',
                工事場所: '新宿区矢来町62',
                受注先: '株式会社東元社',
                物件名: '中外医学社　女子トイレ',
                担当者: '藤岡',
                施工開始日: '2025/6/23',
                施工終了日: '2025/06/27',
                カギ: '株式会社 中外医学社　青木様080-2143-5153',
                発注金額: 0,
                詳細明細: [
                    { No: 10, 明細: '以下、発注させていただきます。', 金額: 0 },
                    { No: 20, 明細: '材料現場納品　ゴミはニッソウへ', 金額: 0 }
                ]
            },
            {
                発注日付: '2025/06/20',
                伝票番号: '267926',
                発注先名: '(同)村上塗装　　　2022/1/26～新会社設立',
                工事場所: '世田谷区中町2-38-9',
                受注先: '齋藤公明様　磯部深雪様',
                物件名: '斎藤様邸　B1　壁面部分塗装',
                担当者: '藤岡',
                施工開始日: '2025/7/15',
                施工終了日: '2025/06/16',
                カギ: 'B1　のポストの中に鍵',
                発注金額: 38000,
                詳細明細: [
                    { No: 10, 明細: '以下、発注させていただきます。', 金額: 0 },
                    { No: 20, 明細: '材料現場納品　ゴミはニッソウへ', 金額: 0 },
                    { No: 30, 明細: '', 金額: 0 },
                    { No: 40, 明細: '■クロス貼替え　天井・壁　　トイレ、収納含む　90㎡×550＝49,500', 金額: 49500 },
                    { No: 50, 明細: '■フィルム施工／玄関ドア内側', 金額: 0 },
                    { No: 60, 明細: '傘立て撤去、パテ含む　　＊ドアポストは塗装済みです　12,000', 金額: 12000 },
                    { No: 70, 明細: '交通費　8,000', 金額: 8000 }
                ]
            },
            {
                発注日付: '2025/06/19',
                伝票番号: '267839',
                発注先名: '(株)小菅硝子　真砂',
                工事場所: '江東区永代1-2-7',
                受注先: '興和管理(株)',
                物件名: '日興パレス永代　803号室　ｻｯｼ不具合補修',
                担当者: '藤岡',
                施工開始日: '2025/6/28',
                施工終了日: '2025/06/28',
                カギ: '入居者：岡本　莉々子（オカモト　リリコ）様　090-4178-6170',
                発注金額: 21000,
                詳細明細: [
                    { No: 10, 明細: 'サッシ不具合補修作業', 金額: 18000 },
                    { No: 20, 明細: '交通費', 金額: 3000 }
                ]
            },
            {
                発注日付: '2025/06/19',
                伝票番号: '267837',
                発注先名: '吉川設備',
                工事場所: '板橋区上板橋3-8-3',
                受注先: '(株)ウィングスジャパン',
                物件名: 'ピアハウス201',
                担当者: '藤岡',
                施工開始日: '2025/7/5',
                施工終了日: '2025/07/05',
                カギ: '入居中',
                発注金額: 25000,
                詳細明細: [
                    { No: 10, 明細: '設備工事一式', 金額: 22000 },
                    { No: 20, 明細: '交通費・諸経費', 金額: 3000 }
                ]
            },
            {
                発注日付: '2025/06/13',
                伝票番号: '267499',
                発注先名: 'インテリアナガイ　永井英仁',
                工事場所: '渋谷区代々木5-39-2',
                受注先: '興和管理(株)',
                物件名: 'パレス代々木　201号室',
                担当者: '藤岡',
                施工開始日: '2025/7/3',
                施工終了日: '2025/07/04',
                カギ: '玄関南京錠：5058',
                発注金額: 69500,
                詳細明細: [
                    { No: 10, 明細: '以下、発注させていただきます。', 金額: 0 },
                    { No: 20, 明細: '材料現場納品　ゴミはニッソウへ', 金額: 0 },
                    { No: 30, 明細: '', 金額: 0 },
                    { No: 40, 明細: '■クロス貼替え　天井・壁　　トイレ、収納含む　90㎡×550＝49,500', 金額: 49500 },
                    { No: 50, 明細: '■フィルム施工／玄関ドア内側', 金額: 0 },
                    { No: 60, 明細: '傘立て撤去、パテ含む　　＊ドアポストは塗装済みです　12,000', 金額: 12000 },
                    { No: 70, 明細: '交通費　8,000', 金額: 8000 }
                ]
            }
        ];

        // 材料発注書
        this.materialOrders = [
            {
                ID: 1,
                物件No: '37.04.001',
                発注日: new Date('2024-03-10'),
                仕入れ先: 'パナソニック住建',
                品目: 'システムキッチン',
                型番: 'Lacucina',
                発注金額: 785000,
                納期: new Date('2024-03-25'),
                ステータス: '納品済み'
            },
            {
                ID: 2,
                物件No: '37.04.001',
                発注日: new Date('2024-03-12'),
                仕入れ先: 'TOTO販売店',
                品目: 'ユニットバス',
                型番: 'WBV1616',
                発注金額: 648000,
                納期: new Date('2024-03-28'),
                ステータス: '納品済み'
            },
            // トーシンコーポレーション関連の材料発注追加
            {
                ID: 3,
                物件No: '37.04.001',
                発注日: new Date('2024-04-05'),
                仕入れ先: 'トーシンコーポレーション',
                品目: 'キッチン部材',
                型番: 'KT-Premium',
                発注金額: 920000,
                納期: new Date('2024-04-20'),
                ステータス: '納品済み'
            },
            {
                ID: 4,
                物件No: '37.04.002',
                発注日: new Date('2024-04-10'),
                仕入れ先: 'トーシンコーポレーション',
                品目: '水廻り4点セット',
                型番: 'WS-STANDARD',
                発注金額: 600000,
                納期: new Date('2024-04-25'),
                ステータス: '納品済み'
            },
            {
                ID: 5,
                物件No: '37.04.003',
                発注日: new Date('2024-04-15'),
                仕入れ先: 'トーシンコーポレーション',
                品目: 'ユニットバス',
                型番: 'UB-1616',
                発注金額: 580000,
                納期: new Date('2024-04-30'),
                ステータス: '納品済み'
            }
        ];

        // 材料屋からの請求データ（複数フォーマット）
        this.supplierInvoices = [
            {
                ID: 1,
                物件No: '37.04.001',
                仕入れ先: 'パナソニック住建',
                請求日: new Date('2024-03-30'),
                請求番号: 'PAN-2024-0330-001',
                データ形式: 'PDF',
                品目: 'システムキッチン',
                型番: 'Lacucina',
                請求金額: 785000,
                消費税: 78500,
                合計金額: 863500,
                支払期限: new Date('2024-04-30'),
                ステータス: '支払済み'
            },
            // トーシンコーポレーション実際の請求データ追加
            {
                ID: 2,
                物件No: '37.04.001',
                仕入れ先: 'トーシンコーポレーション',
                請求日: new Date('2024-04-15'),
                請求番号: 'TOSHIN-2024-04-001',
                データ形式: 'CSV',
                品目: 'キッチン部材',
                型番: 'KT-Premium',
                請求金額: 920000,
                消費税: 92000,
                合計金額: 1012000,
                支払期限: new Date('2024-05-15'),
                ステータス: '支払済み',
                備考: 'リノベーション用プレミアム仕様'
            },
            {
                ID: 3,
                物件No: '37.04.002',
                仕入れ先: 'トーシンコーポレーション',
                請求日: new Date('2024-04-20'),
                請求番号: 'TOSHIN-2024-04-002',
                データ形式: 'CSV',
                品目: '水廻り4点セット',
                型番: 'WS-STANDARD',
                請求金額: 600000,
                消費税: 60000,
                合計金額: 660000,
                支払期限: new Date('2024-05-20'),
                ステータス: '支払済み',
                備考: '原状回復用標準仕様'
            },
            {
                ID: 4,
                物件No: '37.04.003',
                仕入れ先: 'トーシンコーポレーション',
                請求日: new Date('2024-04-25'),
                請求番号: 'TOSHIN-2024-04-003',
                データ形式: 'CSV',
                品目: 'ユニットバス',
                型番: 'UB-1616',
                請求金額: 580000,
                消費税: 58000,
                合計金額: 638000,
                支払期限: new Date('2024-05-25'),
                ステータス: '照合待ち',
                備考: 'リノベーション用1616サイズ'
            },
            // 材料屋請求明細サンプルデータ
            {
                請求書番号: 'TC-2025-0615-001',
                材料屋名: 'トーシンコーポレーション',
                請求日: '2025/06/15',
                物件名: 'パレス代々木　201号室',
                明細: [
                    { 商品名: 'システムキッチン IH対応', 型番: 'TC-KIT-001', 数量: 1, 単価: 85000, 金額: 85000 },
                    { 商品名: '洗面化粧台', 型番: 'TC-WB-205', 数量: 1, 単価: 32000, 金額: 32000 },
                    { 商品名: '配送費', 型番: '', 数量: 1, 単価: 8000, 金額: 8000 }
                ],
                合計金額: 125000,
                支払期限: '2025/07/15',
                ファイル形式: 'CSV'
            },
            {
                請求書番号: 'PH-2025-0618-003',
                材料屋名: 'パナソニック住建',
                請求日: '2025/06/18',
                物件名: 'サンアセント　301号室',
                明細: [
                    { 商品名: 'ユニットバス 1216サイズ', 型番: 'PH-UB-1216', 数量: 1, 単価: 95000, 金額: 95000 },
                    { 商品名: '浴室換気扇', 型番: 'PH-FAN-24', 数量: 1, 単価: 15000, 金額: 15000 },
                    { 商品名: '設置工事費', 型番: '', 数量: 1, 単価: 25000, 金額: 25000 }
                ],
                合計金額: 135000,
                支払期限: '2025/07/18',
                ファイル形式: 'PDF'
            },
            {
                請求書番号: 'TT-2025-0620-007',
                材料屋名: 'TOTO販売店',
                請求日: '2025/06/20',
                物件名: '中外医学社　女子トイレ',
                明細: [
                    { 商品名: '洋式便器セット', 型番: 'TT-WC-CS230B', 数量: 2, 単価: 28000, 金額: 56000 },
                    { 商品名: '手洗器', 型番: 'TT-HW-LSL870', 数量: 1, 単価: 18000, 金額: 18000 },
                    { 商品名: '配管部材一式', 型番: 'TT-PIPE-SET', 数量: 1, 単価: 12000, 金額: 12000 }
                ],
                合計金額: 86000,
                支払期限: '2025/07/20',
                ファイル形式: 'Excel'
            }
        ];

        // 材料屋マスターデータ（トーシンコーポレーション含む）
        this.suppliers = [
            {
                ID: 1,
                会社名: 'パナソニック住建',
                連絡先: '03-1234-5678',
                担当者: '田中',
                メール: 'tanaka@panasonic-jutaku.co.jp',
                主要取扱商品: ['システムキッチン', '洗面台', '内装建材'],
                請求書フォーマット: 'PDF',
                支払条件: '月末締め翌月末払い',
                備考: '大手住設メーカー'
            },
            {
                ID: 2,
                会社名: 'トーシンコーポレーション',
                連絡先: '03-9876-5432',
                担当者: '佐藤',
                メール: 'sato@toshin-corp.co.jp',
                主要取扱商品: ['水廻り設備', 'キッチン部材', 'ユニットバス', 'フローリング'],
                請求書フォーマット: 'CSV',
                支払条件: '20日締め翌月15日払い',
                備考: '中堅材料屋・CSV形式の詳細明細提供'
            },
            {
                ID: 3,
                会社名: 'TOTO販売店',
                連絡先: '03-5555-1111',
                担当者: '山田',
                メール: 'yamada@toto-dealer.co.jp',
                主要取扱商品: ['ユニットバス', 'トイレ', '洗面台'],
                請求書フォーマット: 'Excel',
                支払条件: '月末締め翌月末払い',
                備考: 'TOTO正規代理店'
            }
        ];

        // 小口精算データ
        this.pettyExpenses = [
            {
                ID: 1,
                物件No: '37.04.001',
                精算日: new Date('2024-03-20'),
                精算者: '岡田',
                品目: '補修材料',
                購入先: 'ホームセンター',
                金額: 15000,
                レシート有無: true,
                備考: '緊急補修用'
            }
        ];

        // 工事請求書（職人からの請求）
        this.contractorInvoices = [
            {
                ID: 1,
                物件No: '37.04.001',
                請求日: new Date('2024-04-20'),
                業者名: '内装工事株式会社',
                工事内容: '内装工事一式',
                請求金額: 520000,
                消費税: 52000,
                合計金額: 572000,
                フォーマット: '業者独自',
                ステータス: '支払済み',
                備考: '予定通り完了'
            }
        ];

        // 銀行入金データ
        this.bankDeposits = [
            {
                ID: 1,
                物件No: '37.04.001',
                入金日: new Date('2024-05-30'),
                入金者: '株式会社サンプル',
                入金額: 5000000,
                振込手数料: 330,
                実入金額: 4999670,
                備考: '工事代金',
                照合ステータス: '完了'
            }
        ];

        // 工事業者マスターデータ
        this.contractors = [
            {
                業者名: '(株)アンセイ',
                業種: '総合工事',
                連絡先: '03-1234-5678',
                担当者: '安西',
                得意分野: ['内装工事', '設備工事'],
                単価: { クロス貼替: 550, フィルム施工: 300, 交通費: 8000 }
            },
            {
                業者名: '(同)村上塗装',
                業種: '塗装工事',
                連絡先: '03-2345-6789',
                担当者: '村上',
                得意分野: ['塗装工事', 'クロス工事'],
                単価: { クロス貼替: 550, 塗装工事: 800, 交通費: 8000 }
            },
            {
                業者名: 'インテリアナガイ',
                業種: '内装工事',
                連絡先: '03-3456-7890',
                担当者: '永井英仁',
                得意分野: ['クロス工事', 'フィルム施工'],
                単価: { クロス貼替: 550, フィルム施工: 300, 交通費: 8000 }
            },
            {
                業者名: '(株)小菅硝子',
                業種: 'ガラス・サッシ工事',
                連絡先: '03-4567-8901',
                担当者: '小菅',
                得意分野: ['サッシ工事', 'ガラス工事'],
                単価: { サッシ補修: 15000, 交通費: 3000 }
            },
            {
                業者名: '吉川設備',
                業種: '設備工事',
                連絡先: '03-5678-9012',
                担当者: '吉川',
                得意分野: ['給排水工事', '電気工事'],
                単価: { 設備工事: 20000, 交通費: 3000 }
            }
        ];

        // 工事注文書照合機能
        this.workOrderVerification = [
            {
                伝票番号: '267499',
                照合結果: 'OK',
                詳細明細合計: 69500,
                発注金額: 69500,
                差異: 0,
                チェック項目: [
                    { 項目: '明細合計チェック', 結果: 'OK', 詳細: '49,500 + 12,000 + 8,000 = 69,500' },
                    { 項目: '単価チェック', 結果: 'OK', 詳細: 'クロス貼替 90㎡×550円 = 49,500円' },
                    { 項目: '業者マスターチェック', 結果: 'OK', 詳細: 'インテリアナガイ - 内装工事業者として登録済み' }
                ]
            },
            {
                伝票番号: '267926',
                照合結果: 'WARNING',
                詳細明細合計: 69500,
                発注金額: 38000,
                差異: -31500,
                チェック項目: [
                    { 項目: '明細合計チェック', 結果: 'ERROR', 詳細: '49,500 + 12,000 + 8,000 = 69,500 ≠ 38,000' },
                    { 項目: '単価チェック', 結果: 'OK', 詳細: 'クロス貼替 90㎡×550円 = 49,500円' },
                    { 項目: '業者マスターチェック', 結果: 'OK', 詳細: '村上塗装 - 塗装工事業者として登録済み' }
                ]
            }
        ];
    }

    async query(sql, params = []) {
        console.log(`🔍 Enhanced Mock DB Query: ${sql}`);
        
        if (sql.includes('案件管理テーブル')) {
            return this.handleProjectQuery(sql, params);
        }
        if (sql.includes('見積もりテーブル')) {
            return this.handleEstimateQuery(sql, params);
        }
        
        return [];
    }

    handleProjectQuery(sql, params) {
        return this.projects;
    }

    handleEstimateQuery(sql, params) {
        let results = [...this.estimates];
        const projectNoMatch = sql.match(/物件No = '(.+?)'/);
        if (projectNoMatch) {
            const projectNo = projectNoMatch[1];
            results = results.filter(e => e.物件No === projectNo);
        }
        return results;
    }

    // 高度な照合チェック機能
    performAdvancedVerification(projectNo = null) {
        const projects = projectNo ? 
            this.projects.filter(p => p.物件No === projectNo) : 
            this.projects;

        const verificationResults = [];

        projects.forEach(project => {
            const result = {
                projectNo: project.物件No,
                projectName: project.物件名,
                checks: {
                    materialEstimateVsOrder: this.checkMaterialEstimateVsOrder(project.物件No),
                    materialOrderVsInvoice: this.checkMaterialOrderVsInvoice(project.物件No),
                    workEstimateVsOrder: this.checkWorkEstimateVsOrder(project.物件No),
                    totalCostVerification: this.checkTotalCostVerification(project.物件No),
                    paymentVerification: this.checkPaymentVerification(project.物件No)
                }
            };

            verificationResults.push(result);
        });

        return verificationResults;
    }

    // 1. 工事発注書の金額と見積もり書の原価照合
    checkWorkEstimateVsOrder(projectNo) {
        const estimates = this.estimates.filter(e => 
            e.物件No === projectNo && e.カテゴリ === '工事'
        );
        const workOrders = this.workOrders.filter(w => w.物件名 === projectNo);

        const results = [];
        
        estimates.forEach(estimate => {
            const matchingOrder = workOrders.find(order => 
                order.工事内容.includes(estimate.品目)
            );

            if (matchingOrder) {
                const difference = Math.abs(estimate.見積原価 - matchingOrder.発注金額);
                const diffPercent = (difference / estimate.見積原価) * 100;

                results.push({
                    type: diffPercent < 5 ? 'ok' : diffPercent < 10 ? 'warning' : 'error',
                    item: estimate.品目,
                    estimateAmount: estimate.見積原価,
                    orderAmount: matchingOrder.発注金額,
                    difference: difference,
                    diffPercent: diffPercent.toFixed(1),
                    message: `見積原価 ${estimate.見積原価.toLocaleString()}円 vs 発注金額 ${matchingOrder.発注金額.toLocaleString()}円`
                });
            } else {
                results.push({
                    type: 'error',
                    item: estimate.品目,
                    estimateAmount: estimate.見積原価,
                    orderAmount: 0,
                    message: '対応する発注書が見つかりません'
                });
            }
        });

        return results;
    }

    // 2. 材料の見積もり原価と材料屋からの請求データ照合
    checkMaterialOrderVsInvoice(projectNo) {
        const materialOrders = this.materialOrders.filter(o => o.物件No === projectNo);
        const supplierInvoices = this.supplierInvoices.filter(i => i.物件No === projectNo);

        const results = [];

        materialOrders.forEach(order => {
            const matchingInvoice = supplierInvoices.find(invoice => 
                invoice.仕入れ先 === order.仕入れ先 && invoice.型番 === order.型番
            );

            if (matchingInvoice) {
                const difference = Math.abs(order.発注金額 - matchingInvoice.請求金額);
                const diffPercent = (difference / order.発注金額) * 100;

                results.push({
                    type: diffPercent < 2 ? 'ok' : diffPercent < 5 ? 'warning' : 'error',
                    item: order.品目,
                    supplier: order.仕入れ先,
                    orderAmount: order.発注金額,
                    invoiceAmount: matchingInvoice.請求金額,
                    difference: difference,
                    diffPercent: diffPercent.toFixed(1),
                    dataFormat: matchingInvoice.データ形式,
                    message: `発注 ${order.発注金額.toLocaleString()}円 vs 請求 ${matchingInvoice.請求金額.toLocaleString()}円 (${matchingInvoice.データ形式})`
                });
            } else {
                results.push({
                    type: 'error',
                    item: order.品目,
                    supplier: order.仕入れ先,
                    orderAmount: order.発注金額,
                    invoiceAmount: 0,
                    message: '対応する請求書が見つかりません'
                });
            }
        });

        return results;
    }

    // 3. 材料見積もり原価と材料発注照合
    checkMaterialEstimateVsOrder(projectNo) {
        const estimates = this.estimates.filter(e => 
            e.物件No === projectNo && e.カテゴリ === '材料'
        );
        const materialOrders = this.materialOrders.filter(o => o.物件No === projectNo);

        const results = [];

        estimates.forEach(estimate => {
            const matchingOrder = materialOrders.find(order => 
                order.型番 === estimate.型番
            );

            if (matchingOrder) {
                const difference = Math.abs(estimate.見積原価 - matchingOrder.発注金額);
                const diffPercent = (difference / estimate.見積原価) * 100;

                results.push({
                    type: diffPercent < 3 ? 'ok' : diffPercent < 8 ? 'warning' : 'error',
                    item: estimate.品目,
                    modelNo: estimate.型番,
                    estimateAmount: estimate.見積原価,
                    orderAmount: matchingOrder.発注金額,
                    difference: difference,
                    diffPercent: diffPercent.toFixed(1),
                    message: `見積原価 ${estimate.見積原価.toLocaleString()}円 vs 発注金額 ${matchingOrder.発注金額.toLocaleString()}円`
                });
            } else {
                results.push({
                    type: 'error',
                    item: estimate.品目,
                    modelNo: estimate.型番,
                    estimateAmount: estimate.見積原価,
                    orderAmount: 0,
                    message: '対応する材料発注が見つかりません'
                });
            }
        });

        return results;
    }

    // 4. 総合原価検証
    checkTotalCostVerification(projectNo) {
        const project = this.projects.find(p => p.物件No === projectNo);
        const materialOrders = this.materialOrders.filter(o => o.物件No === projectNo);
        const workOrders = this.workOrders.filter(w => w.物件名 === projectNo);
        const pettyExpenses = this.pettyExpenses.filter(p => p.物件No === projectNo);

        const totalMaterialCost = materialOrders.reduce((sum, o) => sum + o.発注金額, 0);
        const totalWorkCost = workOrders.reduce((sum, w) => sum + w.発注金額, 0);
        const totalPettyExpenses = pettyExpenses.reduce((sum, p) => sum + p.金額, 0);
        const actualTotalCost = totalMaterialCost + totalWorkCost + totalPettyExpenses;

        const difference = Math.abs(project.見積原価 - actualTotalCost);
        const diffPercent = (difference / project.見積原価) * 100;

        return {
            type: diffPercent < 5 ? 'ok' : diffPercent < 10 ? 'warning' : 'error',
            estimatedCost: project.見積原価,
            actualCost: actualTotalCost,
            breakdown: {
                materials: totalMaterialCost,
                work: totalWorkCost,
                pettyExpenses: totalPettyExpenses
            },
            difference: difference,
            diffPercent: diffPercent.toFixed(1),
            message: `見積原価 ${project.見積原価.toLocaleString()}円 vs 実際原価 ${actualTotalCost.toLocaleString()}円`
        };
    }

    // 5. 入金照合
    checkPaymentVerification(projectNo) {
        const project = this.projects.find(p => p.物件No === projectNo);
        const bankDeposit = this.bankDeposits.find(b => b.物件No === projectNo);

        if (!bankDeposit || !bankDeposit.入金日) {
            return {
                type: 'error',
                expectedAmount: project.請求額,
                receivedAmount: 0,
                message: '入金が確認できません'
            };
        }

        const difference = Math.abs(project.請求額 - bankDeposit.入金額);
        const handlingFee = bankDeposit.振込手数料;

        return {
            type: difference <= handlingFee ? 'ok' : 'warning',
            expectedAmount: project.請求額,
            receivedAmount: bankDeposit.入金額,
            actualReceived: bankDeposit.実入金額,
            handlingFee: handlingFee,
            difference: difference,
            message: `請求額 ${project.請求額.toLocaleString()}円 vs 入金額 ${bankDeposit.入金額.toLocaleString()}円`
        };
    }

    // 照合サマリー生成
    generateVerificationSummary() {
        const allResults = this.performAdvancedVerification();
        
        let totalChecks = 0;
        let okCount = 0;
        let warningCount = 0;
        let errorCount = 0;

        allResults.forEach(result => {
            Object.values(result.checks).forEach(checkCategory => {
                if (Array.isArray(checkCategory)) {
                    checkCategory.forEach(check => {
                        totalChecks++;
                        if (check.type === 'ok') okCount++;
                        else if (check.type === 'warning') warningCount++;
                        else if (check.type === 'error') errorCount++;
                    });
                } else {
                    totalChecks++;
                    if (checkCategory.type === 'ok') okCount++;
                    else if (checkCategory.type === 'warning') warningCount++;
                    else if (checkCategory.type === 'error') errorCount++;
                }
            });
        });

        return {
            totalChecks,
            okCount,
            warningCount,
            errorCount,
            okPercent: ((okCount / totalChecks) * 100).toFixed(1),
            details: allResults
        };
    }
}

module.exports = EnhancedMockDatabase; 