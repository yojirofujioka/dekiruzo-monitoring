// モックデータベース - AccessDBが利用できない環境用
// 実際のAccess DBの構造を模擬したダミーデータとAPI

class MockDatabase {
    constructor() {
        this.projects = [
            {
                物件No: '37.04.001',
                物件名: 'サンプルマンション101',
                顧客名: '株式会社サンプル',
                担当者: '岡田',
                工事区分: 'リノベーション',
                契約額: 5000000,
                原価金額: 3500000,
                利益額: 1500000,
                利益率: 30.0,
                ステータス: '完了',
                請求日: new Date('2024-04-30'),
                入金日: new Date('2024-05-30')
            },
            {
                物件No: '37.04.002',
                物件名: 'テストビル3F',
                顧客名: '株式会社テスト',
                担当者: '田原',
                工事区分: '原状回復',
                契約額: 1200000,
                原価金額: 950000,
                利益額: 250000,
                利益率: 20.8,
                ステータス: '進行中',
                請求日: new Date('2024-04-30'),
                入金日: new Date('2024-05-31')
            },
            {
                物件No: '37.04.003',
                物件名: 'デモアパート202',
                顧客名: '有限会社デモ',
                担当者: '岡野',
                工事区分: 'リノベーション',
                契約額: 3800000,
                原価金額: 2800000,
                利益額: 1000000,
                利益率: 26.3,
                ステータス: '照合待ち',
                請求日: new Date('2024-04-30'),
                入金日: null
            },
            {
                物件No: '37.04.004',
                物件名: '本厚木スカイハイツ233',
                顧客名: '株式会社エクセル',
                担当者: '岡田',
                工事区分: 'リノベーション',
                契約額: 4500000,
                原価金額: 3200000,
                利益額: 1300000,
                利益率: 28.9,
                ステータス: '進行中',
                請求日: new Date('2024-05-15'),
                入金日: null
            },
            {
                物件No: '37.04.005',
                物件名: '国立市泉3丁目',
                顧客名: 'アパート管理会社',
                担当者: '田原',
                工事区分: '原状回復',
                契約額: 800000,
                原価金額: 720000,
                利益額: 80000,
                利益率: 10.0,
                ステータス: '要確認',
                請求日: new Date('2024-05-01'),
                入金日: null
            }
        ];

        this.estimates = [
            {
                ID: 1,
                物件No: '37.04.001',
                カテゴリ: 'キッチン',
                内容: 'キッチン推薦',
                金額: 800000,
                備考: '標準仕様'
            },
            {
                ID: 2,
                物件No: '37.04.001',
                カテゴリ: '浴室',
                内容: 'ユニットバス標準',
                金額: 650000,
                備考: '1616サイズ'
            },
            {
                ID: 3,
                物件No: '37.04.002',
                カテゴリ: '水廻り',
                内容: '水廻り4点セット',
                金額: 600000,
                備考: '標準グレード'
            },
            {
                ID: 4,
                物件No: '37.04.003',
                カテゴリ: 'キッチン',
                内容: 'KT-Premium',
                金額: 920000,
                備考: 'プレミアムライン'
            }
        ];

        this.orders = [
            {
                ID: 1,
                物件No: '37.04.001',
                仕入れ先: 'キッチンメーカーA',
                発注日: new Date('2024-03-15'),
                品番: 'KT-STD-001',
                商品名: '標準キッチンセット',
                数量: 1,
                単価: 780000,
                金額: 780000
            },
            {
                ID: 2,
                物件No: '37.04.001',
                仕入れ先: 'バスメーカーB',
                発注日: new Date('2024-03-16'),
                品番: 'UB-1616-STD',
                商品名: 'ユニットバス1616標準',
                数量: 1,
                単価: 630000,
                金額: 630000
            },
            {
                ID: 3,
                物件No: '37.04.002',
                仕入れ先: '水廻り専門店C',
                発注日: new Date('2024-04-01'),
                品番: 'WS-4SET-001',
                商品名: '水廻り4点セット標準',
                数量: 1,
                単価: 580000,
                金額: 580000
            }
        ];
    }

    // SQLライクなクエリのシミュレーション
    async query(sql, params = []) {
        console.log(`🎭 Mock DB Query: ${sql}`);
        
        // パラメータ置換の簡易実装
        let processedSql = sql;
        params.forEach((param, index) => {
            processedSql = processedSql.replace('?', `'${param}'`);
        });

        try {
            // SELECT文の処理
            if (sql.toUpperCase().includes('SELECT')) {
                return this.handleSelect(processedSql);
            }
            
            // INSERT文の処理
            if (sql.toUpperCase().includes('INSERT')) {
                return this.handleInsert(processedSql, params);
            }
            
            // UPDATE文の処理
            if (sql.toUpperCase().includes('UPDATE')) {
                return this.handleUpdate(processedSql, params);
            }

            return [];
        } catch (error) {
            console.error('Mock DB Query Error:', error);
            throw new Error(`Mock database query failed: ${error.message}`);
        }
    }

    handleSelect(sql) {
        // 案件管理テーブル
        if (sql.includes('案件管理テーブル')) {
            let results = [...this.projects];
            
            // WHERE句の簡易処理
            if (sql.includes('WHERE')) {
                if (sql.includes('利益率 < 15')) {
                    results = results.filter(p => p.利益率 < 15);
                }
                if (sql.includes("ステータス IN ('進行中', '照合待ち')")) {
                    results = results.filter(p => ['進行中', '照合待ち'].includes(p.ステータス));
                }
                if (sql.includes('担当者 = ')) {
                    const supervisor = sql.match(/担当者 = '(.+?)'/)?.[1];
                    if (supervisor) {
                        results = results.filter(p => p.担当者 === supervisor);
                    }
                }
            }
            
            // GROUP BY句の簡易処理
            if (sql.includes('GROUP BY 担当者')) {
                const grouped = {};
                results.forEach(p => {
                    if (!grouped[p.担当者]) {
                        grouped[p.担当者] = {
                            担当者: p.担当者,
                            案件数: 0,
                            平均利益率: 0,
                            総売上: 0
                        };
                    }
                    grouped[p.担当者].案件数++;
                    grouped[p.担当者].総売上 += p.契約額;
                });
                
                Object.keys(grouped).forEach(supervisor => {
                    const supervisorProjects = results.filter(p => p.担当者 === supervisor);
                    grouped[supervisor].平均利益率 = 
                        supervisorProjects.reduce((sum, p) => sum + p.利益率, 0) / supervisorProjects.length;
                });
                
                return Object.values(grouped);
            }

            return results;
        }
        
        // 見積もりテーブル
        if (sql.includes('見積もりテーブル')) {
            let results = [...this.estimates];
            
            // WHERE句で物件No指定
            const projectNoMatch = sql.match(/物件No = '(.+?)'/);
            if (projectNoMatch) {
                const projectNo = projectNoMatch[1];
                results = results.filter(e => e.物件No === projectNo);
            }
            
            return results;
        }
        
        // 発注テーブル
        if (sql.includes('発注テーブル')) {
            let results = [...this.orders];
            
            // WHERE句で物件No指定
            const projectNoMatch = sql.match(/物件No = '(.+?)'/);
            if (projectNoMatch) {
                const projectNo = projectNoMatch[1];
                results = results.filter(o => o.物件No === projectNo);
            }
            
            return results;
        }

        return [];
    }

    handleInsert(sql, params) {
        console.log('📝 Mock INSERT:', sql, params);
        
        if (sql.includes('案件管理テーブル')) {
            const newProject = {
                物件No: params[0],
                物件名: params[1],
                顧客名: params[2],
                担当者: params[3],
                工事区分: params[4],
                契約額: params[5],
                原価金額: params[6],
                利益額: params[7],
                利益率: params[8],
                ステータス: params[9],
                請求日: new Date(),
                入金日: null
            };
            
            this.projects.push(newProject);
            console.log('✅ Mock project added:', newProject.物件No);
        }
        
        return { insertId: Date.now() };
    }

    handleUpdate(sql, params) {
        console.log('📝 Mock UPDATE:', sql, params);
        return { affectedRows: 1 };
    }

    // 統計データ生成
    generateStatistics() {
        const supervisorStats = {};
        
        this.projects.forEach(project => {
            if (!supervisorStats[project.担当者]) {
                supervisorStats[project.担当者] = {
                    name: project.担当者,
                    projectCount: 0,
                    totalContract: 0,
                    totalProfit: 0,
                    avgProfitRate: 0
                };
            }
            
            const stat = supervisorStats[project.担当者];
            stat.projectCount++;
            stat.totalContract += project.契約額;
            stat.totalProfit += project.利益額;
        });
        
        // 平均利益率計算
        Object.keys(supervisorStats).forEach(supervisor => {
            const supervisorProjects = this.projects.filter(p => p.担当者 === supervisor);
            supervisorStats[supervisor].avgProfitRate = 
                supervisorProjects.reduce((sum, p) => sum + p.利益率, 0) / supervisorProjects.length;
        });
        
        return Object.values(supervisorStats);
    }

    // アラート生成
    generateAlerts() {
        const alerts = [];
        
        // 利益率が低い案件
        const lowProfitProjects = this.projects.filter(p => 
            p.利益率 < 15 && ['進行中', '照合待ち'].includes(p.ステータス)
        );
        
        lowProfitProjects.forEach(project => {
            alerts.push({
                type: 'warning',
                message: `利益率が低い案件: ${project.物件名} (${project.利益率}%)`,
                projectNo: project.物件No,
                supervisor: project.担当者
            });
        });
        
        // 入金遅延案件
        const now = new Date();
        const overdueProjects = this.projects.filter(p => {
            if (!p.請求日 || p.入金日) return false;
            const daysDiff = (now - p.請求日) / (1000 * 60 * 60 * 24);
            return daysDiff > 30;
        });
        
        overdueProjects.forEach(project => {
            alerts.push({
                type: 'danger',
                message: `入金遅延: ${project.物件名}`,
                projectNo: project.物件No,
                supervisor: project.担当者
            });
        });
        
        return alerts;
    }
}

module.exports = MockDatabase; 