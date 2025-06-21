// 実際のプロジェクトデータ（提供されたCSVデータから変換）
const PROJECT_DATA = [
    {
        projectNo: "37.04.002",
        customerNo: "1083",
        customer: "(株)リプライス",
        projectName: "府中住吉町住宅2号棟　2-308",
        content: "リノベーション",
        workType: "リノベーション",
        supervisorCode: "123",
        supervisor: "岡田",
        contractAmount: 6344815,
        costAmount: 3916688,
        profitAmount: 1909000,
        profitRate: 30.1,
        status: "完了",
        billingDate: "2025-04-30",
        completionDate: "2025-05-30"
    },
    {
        projectNo: "37.04.004",
        customerNo: "1083",
        customer: "(株)リプライス",
        projectName: "本厚木スカイハイツ233",
        content: "リノベーション",
        workType: "リノベーション",
        supervisorCode: "123",
        supervisor: "岡田",
        contractAmount: 5335000,
        costAmount: 3636193,
        profitAmount: 1228000,
        profitRate: 23.0,
        status: "完了",
        billingDate: "2025-04-30",
        completionDate: "2025-05-30"
    },
    {
        projectNo: "37.04.008",
        customerNo: "1083",
        customer: "(株)リプライス",
        projectName: "国立市泉3丁目14-6_本工事",
        content: "リノベーション",
        workType: "リノベーション",
        supervisorCode: "087",
        supervisor: "岡野",
        contractAmount: 3921390,
        costAmount: 2751783,
        profitAmount: 815000,
        profitRate: 20.8,
        status: "完了",
        billingDate: "2025-04-30",
        completionDate: "2025-05-30"
    },
    {
        projectNo: "37.04.020",
        customerNo: "1083",
        customer: "(株)リプライス",
        projectName: "武蔵村山市残堀5丁目62-44_本工事",
        content: "リノベーション",
        workType: "リノベーション",
        supervisorCode: "087",
        supervisor: "岡野",
        contractAmount: 4360000,
        costAmount: 2852740,
        profitAmount: 1134000,
        profitRate: 26.0,
        status: "完了",
        billingDate: "2025-04-30",
        completionDate: "2025-05-30"
    },
    {
        projectNo: "37.04.047",
        customerNo: "1083",
        customer: "(株)リプライス",
        projectName: "千葉市稲毛区園生町260-6",
        content: "リノベーション",
        workType: "リノベーション",
        supervisorCode: "068",
        supervisor: "田原",
        contractAmount: 4198348,
        costAmount: 3053075,
        profitAmount: 756000,
        profitRate: 18.0,
        status: "完了",
        billingDate: "2025-04-30",
        completionDate: "2025-05-30"
    },
    {
        projectNo: "37.04.211",
        customerNo: "0135",
        customer: "(株)クリエーター二十一",
        projectName: "カーサヴィア船堀　308号室",
        content: "原状回復",
        workType: "原状回復",
        supervisorCode: "027",
        supervisor: "中村",
        contractAmount: 1139413,
        costAmount: 791131,
        profitAmount: 246000,
        profitRate: 21.6,
        status: "完了",
        billingDate: "2025-04-30",
        completionDate: "2025-05-08"
    },
    {
        projectNo: "37.04.271",
        customerNo: "0956",
        customer: "(株)ライフポート西洋",
        projectName: "マイティーハウス　102号室",
        content: "原状回復",
        workType: "原状回復",
        supervisorCode: "031",
        supervisor: "伊藤",
        contractAmount: 1430000,
        costAmount: 798196,
        profitAmount: 523000,
        profitRate: 36.6,
        status: "完了",
        billingDate: "2025-04-30",
        completionDate: "2025-05-08"
    },
    {
        projectNo: "37.04.330",
        customerNo: "1083",
        customer: "(株)リプライス",
        projectName: "市川市北国分2丁目19-12（追加）",
        content: "リノベーション",
        workType: "リノベーション",
        supervisorCode: "068",
        supervisor: "田原",
        contractAmount: 2873068,
        costAmount: 2114667,
        profitAmount: 489000,
        profitRate: 17.0,
        status: "進行中",
        billingDate: "2025-04-30",
        completionDate: null
    },
    {
        projectNo: "37.04.470",
        customerNo: "0000",
        customer: "株式会社明光ネットワークジャパン",
        projectName: "TYビル 6階",
        content: "リノベーション",
        workType: "リノベーション",
        supervisorCode: "054",
        supervisor: "坪井",
        contractAmount: 5400000,
        costAmount: 3124081,
        profitAmount: 1850000,
        profitRate: 34.3,
        status: "照合待ち",
        billingDate: "2025-04-30",
        completionDate: "2025-05-30"
    }
];

// 模擬的な見積もりデータ（現場監督の属人化問題を表現）
const ESTIMATE_DATA = [
    {
        projectNo: "37.04.002",
        supervisor: "岡田",
        items: [
            { category: "キッチン", description: "キッチン推薦", amount: 800000, note: "岡田式：本体+水栓+工事費込み" },
            { category: "バス", description: "ユニットバス標準", amount: 650000, note: "TOTO製想定" },
            { category: "設備", description: "給排水工事一式", amount: 300000, note: "配管含む" },
            { category: "内装", description: "クロス張替え", amount: 180000, note: "" },
            { category: "その他", description: "諸経費", amount: 200000, note: "" }
        ]
    },
    {
        projectNo: "37.04.008",
        supervisor: "岡野",
        items: [
            { category: "キッチン", description: "KT-Premium", amount: 920000, note: "岡野式：高級仕様" },
            { category: "バス", description: "UB-1616", amount: 580000, note: "LIXIL製" },
            { category: "トイレ", description: "便器交換", amount: 280000, note: "タンクレス" },
            { category: "床", description: "フローリング張替", amount: 320000, note: "無垢材" },
            { category: "電気", description: "電気工事", amount: 150000, note: "" }
        ]
    },
    {
        projectNo: "37.04.047",
        supervisor: "田原",
        items: [
            { category: "水廻り", description: "水廻り4点セット", amount: 1200000, note: "田原式：まとめて計上" },
            { category: "内装", description: "内装工事一式", amount: 800000, note: "クロス+床+建具" },
            { category: "設備", description: "設備工事", amount: 450000, note: "電気+給排水" },
            { category: "諸経費", description: "現場管理費", amount: 280000, note: "" }
        ]
    }
];

// 模擬的な発注データ（仕入れ先別）
const ORDER_DATA = [
    {
        projectNo: "37.04.002",
        supplier: "LIXIL",
        orderDate: "2025-03-15",
        items: [
            { itemCode: "LIXIL-SieraS-I2550", itemName: "シエラS I型2550", quantity: 1, unitPrice: 580000, amount: 580000 },
            { itemCode: "LIXIL-SF-WJ780", itemName: "シングルレバー混合栓", quantity: 1, unitPrice: 28000, amount: 28000 },
            { itemCode: "LIXIL-DW-RSW405A", itemName: "食器洗い乾燥機", quantity: 1, unitPrice: 85000, amount: 85000 }
        ]
    },
    {
        projectNo: "37.04.002",
        supplier: "TOTO",
        orderDate: "2025-03-16",
        items: [
            { itemCode: "TOTO-SAZANA-1616", itemName: "サザナ 1616サイズ", quantity: 1, unitPrice: 520000, amount: 520000 },
            { itemCode: "TOTO-UGFT1BM", itemName: "エアインシャワー", quantity: 1, unitPrice: 35000, amount: 35000 }
        ]
    },
    {
        projectNo: "37.04.008",
        supplier: "クリナップ",
        orderDate: "2025-03-20",
        items: [
            { itemCode: "CLEANUP-RAKUERA-I2700", itemName: "ラクエラ I型2700", quantity: 1, unitPrice: 720000, amount: 720000 },
            { itemCode: "CLEANUP-TOUCH-FAUCET", itemName: "タッチレス水栓", quantity: 1, unitPrice: 45000, amount: 45000 }
        ]
    }
];

// 照合結果の例
const VERIFICATION_RESULTS = [
    {
        projectNo: "37.04.002",
        status: "warning",
        issues: [
            {
                type: "amount_mismatch",
                description: "見積もり「キッチン推薦」¥800,000 vs 発注合計¥693,000",
                severity: "中",
                suggestion: "工事費¥107,000が別途計上されている可能性"
            }
        ]
    },
    {
        projectNo: "37.04.008",
        status: "error",
        issues: [
            {
                type: "missing_item",
                description: "見積もり「UB-1616」に対応する発注が見つかりません",
                severity: "高",
                suggestion: "TOTO/LIXILに発注予定の確認が必要"
            }
        ]
    }
];

// 現場監督のパターン分析
const SUPERVISOR_PATTERNS = {
    "岡田": {
        totalProjects: 3,
        avgProfitRate: 26.5,
        preferredSuppliers: ["LIXIL", "TOTO"],
        namingPatterns: [
            { pattern: "キッチン推薦", meaning: "システムキッチン一式（本体+水栓+工事費）" },
            { pattern: "ユニットバス標準", meaning: "1616サイズユニットバス" }
        ],
        characteristics: [
            "利益率が高め（25-30%）",
            "詳細な内訳よりも一括計上を好む",
            "LIXIL製品を多用する傾向"
        ]
    },
    "岡野": {
        totalProjects: 2,
        avgProfitRate: 23.4,
        preferredSuppliers: ["クリナップ", "LIXIL"],
        namingPatterns: [
            { pattern: "KT-Premium", meaning: "高級グレードキッチン" },
            { pattern: "UB-1616", meaning: "1616サイズユニットバス" }
        ],
        characteristics: [
            "品質重視の傾向",
            "型番に近い表記を使用",
            "高級グレード商品を選定"
        ]
    },
    "田原": {
        totalProjects: 2,
        avgProfitRate: 17.5,
        preferredSuppliers: ["パナソニック", "TOTO"],
        namingPatterns: [
            { pattern: "水廻り4点セット", meaning: "キッチン+バス+トイレ+洗面台" },
            { pattern: "内装工事一式", meaning: "クロス+床+建具の合計" }
        ],
        characteristics: [
            "効率重視、まとめて計上",
            "利益率は控えめ",
            "工事項目を大きくまとめる傾向"
        ]
    },
    "中村": {
        totalProjects: 1,
        avgProfitRate: 21.6,
        preferredSuppliers: ["LIXIL", "DAIKEN"],
        namingPatterns: [],
        characteristics: [
            "原状回復専門",
            "標準的な利益率",
            "コストパフォーマンス重視"
        ]
    }
};

// アラート設定
const ALERT_SETTINGS = {
    profitRateThreshold: 15, // 利益率15%未満でアラート
    amountThreshold: 10, // 金額差異10%以上でアラート
    missingItemAlert: true, // 見積もりと発注の不一致アラート
    supplierDelay: 30 // 発注から30日経過でアラート
};

// ユーティリティ関数
function formatCurrency(amount) {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatPercent(rate) {
    return `${rate.toFixed(1)}%`;
}

function getStatusBadgeClass(status) {
    switch (status) {
        case "完了": return "completed";
        case "進行中": return "in-progress";
        case "照合待ち": return "pending";
        case "要確認": return "alert";
        default: return "pending";
    }
}

function calculateProfitRate(contractAmount, costAmount) {
    if (contractAmount === 0) return 0;
    return ((contractAmount - costAmount) / contractAmount) * 100;
}

// データ検索・フィルタリング関数
function searchProjects(query = '', filters = {}) {
    let results = PROJECT_DATA;

    // テキスト検索
    if (query.trim()) {
        const searchTerm = query.toLowerCase();
        results = results.filter(project => 
            project.projectName.toLowerCase().includes(searchTerm) ||
            project.supervisor.toLowerCase().includes(searchTerm) ||
            project.customer.toLowerCase().includes(searchTerm) ||
            project.projectNo.toLowerCase().includes(searchTerm)
        );
    }

    // 担当者フィルター
    if (filters.supervisor) {
        results = results.filter(project => project.supervisor === filters.supervisor);
    }

    // 工事区分フィルター
    if (filters.workType) {
        results = results.filter(project => project.workType === filters.workType);
    }

    // ステータスフィルター
    if (filters.status) {
        results = results.filter(project => project.status === filters.status);
    }

    return results;
}

// 担当者統計計算
function calculateSupervisorStats() {
    const stats = {};
    
    PROJECT_DATA.forEach(project => {
        const supervisor = project.supervisor;
        if (!stats[supervisor]) {
            stats[supervisor] = {
                name: supervisor,
                projectCount: 0,
                totalContract: 0,
                totalProfit: 0,
                avgProfitRate: 0,
                completedProjects: 0
            };
        }
        
        stats[supervisor].projectCount++;
        stats[supervisor].totalContract += project.contractAmount;
        stats[supervisor].totalProfit += project.profitAmount;
        
        if (project.status === "完了") {
            stats[supervisor].completedProjects++;
        }
    });
    
    // 平均利益率計算
    Object.values(stats).forEach(stat => {
        stat.avgProfitRate = stat.totalContract > 0 
            ? (stat.totalProfit / stat.totalContract) * 100 
            : 0;
    });
    
    return Object.values(stats);
}

// アラート生成
function generateAlerts() {
    const alerts = [];
    
    PROJECT_DATA.forEach(project => {
        // 低利益率アラート
        if (project.profitRate < ALERT_SETTINGS.profitRateThreshold) {
            alerts.push({
                type: "warning",
                project: project.projectNo,
                message: `${project.projectName} - 利益率が低下（${formatPercent(project.profitRate)}）`,
                supervisor: project.supervisor
            });
        }
        
        // 照合待ちアラート
        if (project.status === "照合待ち") {
            alerts.push({
                type: "info",
                project: project.projectNo,
                message: `${project.projectName} - 照合作業が必要`,
                supervisor: project.supervisor
            });
        }
        
        // 高額案件アラート
        if (project.contractAmount > 5000000) {
            alerts.push({
                type: "info",
                project: project.projectNo,
                message: `${project.projectName} - 高額案件（${formatCurrency(project.contractAmount)}）`,
                supervisor: project.supervisor
            });
        }
    });
    
    return alerts;
}

console.log('現場監督業務監視システム データ読み込み完了');
console.log(`プロジェクト数: ${PROJECT_DATA.length}件`);
console.log(`担当者数: ${Object.keys(SUPERVISOR_PATTERNS).length}名`);
console.log(`アラート数: ${generateAlerts().length}件`); 