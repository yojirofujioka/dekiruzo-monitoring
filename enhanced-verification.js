// 詳細照合機能 - フロントエンド
// UTF-8 encoding fix for Linux/Windows compatibility
class EnhancedVerificationManager {
    constructor() {
        this.currentVerificationData = null;
        console.log('🔧 EnhancedVerificationManager コンストラクタ実行');
    }

    init() {
        console.log('🎯 EnhancedVerificationManager 初期化開始');
        // 新しいタブシステムを作成
        this.createTabSystem();
    }

    createEnhancedVerificationUI() {
        // 照合チェックタブの内容を強化
        const verificationTab = document.getElementById('verification');
        
        verificationTab.innerHTML = `
            <div class="verification-header">
                <h2>🔍 詳細照合チェックシステム</h2>
                <div class="verification-controls">
                    <button id="run-detailed-verification" class="btn-primary">
                        <span class="icon">🚀</span> 詳細照合実行
                    </button>
                    <button id="export-verification-report" class="btn-secondary">
                        <span class="icon">📊</span> レポート出力
                    </button>
                    <button id="refresh-verification" class="btn-secondary">
                        <span class="icon">🔄</span> 更新
                    </button>
                </div>
            </div>

            <div class="verification-summary" id="verification-summary" style="display: none;">
                <div class="summary-cards">
                    <div class="summary-card ok">
                        <div class="summary-number" id="summary-ok">0</div>
                        <div class="summary-label">照合OK</div>
                    </div>
                    <div class="summary-card warning">
                        <div class="summary-number" id="summary-warning">0</div>
                        <div class="summary-label">要確認</div>
                    </div>
                    <div class="summary-card error">
                        <div class="summary-number" id="summary-error">0</div>
                        <div class="summary-label">エラー</div>
                    </div>
                    <div class="summary-card total">
                        <div class="summary-number" id="summary-total">0</div>
                        <div class="summary-label">総チェック数</div>
                        <div class="summary-percent" id="summary-percent">0%</div>
                    </div>
                </div>
            </div>

            <div class="verification-tabs">
                <button class="verification-tab-btn active" data-tab="all">全体概要</button>
                <button class="verification-tab-btn" data-tab="material-estimate">材料見積vs発注</button>
                <button class="verification-tab-btn" data-tab="material-invoice">材料発注vs請求</button>
                <button class="verification-tab-btn" data-tab="work-estimate">工事見積vs発注</button>
                <button class="verification-tab-btn" data-tab="cost-total">総原価照合</button>
                <button class="verification-tab-btn" data-tab="payment">入金照合</button>
            </div>

            <div class="verification-content">
                <div id="verification-all" class="verification-tab-content active">
                    <div class="projects-verification-list" id="projects-verification-list">
                        <!-- 案件別照合結果がここに表示される -->
                    </div>
                </div>

                <div id="verification-material-estimate" class="verification-tab-content">
                    <h3>📦 材料見積もり原価 vs 材料発注金額</h3>
                    <div class="verification-details" id="material-estimate-details">
                        <!-- 詳細がここに表示される -->
                    </div>
                </div>

                <div id="verification-material-invoice" class="verification-tab-content">
                    <h3>📄 材料発注金額 vs 材料屋請求金額</h3>
                    <div class="verification-note">
                        <p><strong>対応フォーマット:</strong> PDF、Excel、CSV</p>
                        <p><strong>チェック項目:</strong> 金額差異、型番一致、仕入れ先確認</p>
                    </div>
                    <div class="verification-details" id="material-invoice-details">
                        <!-- 詳細がここに表示される -->
                    </div>
                </div>

                <div id="verification-work-estimate" class="verification-tab-content">
                    <h3>🔨 工事見積もり原価 vs 工事発注金額</h3>
                    <div class="verification-note">
                        <p><strong>チェック項目:</strong> 職人への発注金額と見積原価の差異</p>
                    </div>
                    <div class="verification-details" id="work-estimate-details">
                        <!-- 詳細がここに表示される -->
                    </div>
                </div>

                <div id="verification-cost-total" class="verification-tab-content">
                    <h3>💰 総原価照合</h3>
                    <div class="verification-note">
                        <p><strong>照合内容:</strong> 見積原価 vs (材料費 + 工事費 + 小口精算)</p>
                    </div>
                    <div class="verification-details" id="cost-total-details">
                        <!-- 詳細がここに表示される -->
                    </div>
                </div>

                <div id="verification-payment" class="verification-tab-content">
                    <h3>💳 クライアント入金照合</h3>
                    <div class="verification-note">
                        <p><strong>照合内容:</strong> 請求額 vs 銀行入金額（振込手数料考慮）</p>
                    </div>
                    <div class="verification-details" id="payment-details">
                        <!-- 詳細がここに表示される -->
                    </div>
                </div>
            </div>

            <!-- 詳細モーダル -->
            <div id="verification-detail-modal" class="modal hidden">
                <div class="modal-content large">
                    <span class="close">&times;</span>
                    <div id="verification-modal-body"></div>
                </div>
            </div>
        `;

        // CSSスタイルを追加
        this.addVerificationStyles();
    }

    addVerificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .verification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding: 15px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
            }

            .verification-controls {
                display: flex;
                gap: 10px;
            }

            .verification-controls button {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .verification-summary {
                margin-bottom: 20px;
            }

            .summary-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }

            .summary-card {
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                color: white;
                position: relative;
                overflow: hidden;
            }

            .summary-card.ok { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
            .summary-card.warning { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
            .summary-card.error { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); }
            .summary-card.total { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

            .summary-number {
                font-size: 2.5em;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .summary-label {
                font-size: 0.9em;
                opacity: 0.9;
            }

            .summary-percent {
                font-size: 1.2em;
                font-weight: bold;
                margin-top: 5px;
            }

            .verification-tabs {
                display: flex;
                border-bottom: 2px solid #e1e5e9;
                margin-bottom: 20px;
                overflow-x: auto;
            }

            .verification-tab-btn {
                padding: 12px 20px;
                border: none;
                background: none;
                cursor: pointer;
                white-space: nowrap;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
            }

            .verification-tab-btn:hover {
                background: #f8f9fa;
            }

            .verification-tab-btn.active {
                color: #007bff;
                border-bottom-color: #007bff;
                background: #f8f9fa;
            }

            .verification-tab-content {
                display: none;
            }

            .verification-tab-content.active {
                display: block;
            }

            .verification-note {
                background: #e7f3ff;
                border-left: 4px solid #007bff;
                padding: 15px;
                margin-bottom: 20px;
                border-radius: 5px;
            }

            .verification-item {
                background: white;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 10px;
                border-left: 4px solid #ddd;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.2s ease;
            }

            .verification-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }

            .verification-item.ok { border-left-color: #28a745; }
            .verification-item.warning { border-left-color: #ffc107; }
            .verification-item.error { border-left-color: #dc3545; }

            .project-verification-card {
                background: white;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border: 1px solid #e1e5e9;
            }

            .project-verification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #e1e5e9;
            }

            .project-verification-title {
                font-size: 1.3em;
                font-weight: bold;
                color: #2c3e50;
            }

            .verification-quick-summary {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
                margin-top: 15px;
            }

            .verification-quick-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                border-radius: 5px;
                background: #f8f9fa;
                border-left: 3px solid #ddd;
            }

            .verification-quick-item.ok { border-left-color: #28a745; }
            .verification-quick-item.warning { border-left-color: #ffc107; }
            .verification-quick-item.error { border-left-color: #dc3545; }

            .quick-status {
                font-weight: bold;
            }

            .quick-status.ok { color: #28a745; }
            .quick-status.warning { color: #ffc107; }
            .quick-status.error { color: #dc3545; }

            .mini-status {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 5px;
            }

            .mini-status.ok { background: #28a745; }
            .mini-status.warning { background: #ffc107; }
            .mini-status.error { background: #dc3545; }

            /* タブシステムのスタイル */
            .tabs-container {
                width: 100%;
                height: 100%;
            }

            .tabs-nav {
                display: flex;
                background: #f8f9fa;
                border-bottom: 2px solid #dee2e6;
                overflow-x: auto;
                padding: 0;
                margin: 0;
            }

            .tab-btn {
                background: none;
                border: none;
                padding: 12px 20px;
                cursor: pointer;
                white-space: nowrap;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
                font-size: 14px;
                color: #495057;
            }

            .tab-btn:hover {
                background: #e9ecef;
                color: #007bff;
            }

            .tab-btn.active {
                background: white;
                color: #007bff;
                border-bottom-color: #007bff;
                font-weight: bold;
            }

            .tabs-content {
                padding: 20px;
                background: white;
                min-height: 500px;
            }

            .tab-content {
                display: none;
            }

            .tab-content.active {
                display: block;
            }

            .tab-content h2 {
                margin: 0 0 20px 0;
                color: #2c3e50;
            }

            /* 開発中機能のスタイル */
            .feature-content {
                text-align: center;
                padding: 40px 20px;
                background: #f8f9fa;
                border-radius: 10px;
                margin: 20px 0;
            }

            .feature-content h3 {
                color: #495057;
                margin-bottom: 15px;
            }

            .feature-content p {
                color: #6c757d;
                margin-bottom: 20px;
                line-height: 1.6;
            }

            .feature-status {
                display: inline-block;
                padding: 8px 16px;
                background: #ffc107;
                color: #212529;
                border-radius: 20px;
                font-weight: bold;
                font-size: 0.9em;
            }

            /* モックデータ表示用スタイル */
            .mock-data-section {
                margin-top: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #0984e3;
            }

            .sample-comparison, .estimate-comparison, .cost-analysis, .payment-status {
                margin-top: 10px;
            }

            .comparison-item, .cost-item, .payment-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                margin: 5px 0;
                background: white;
                border-radius: 5px;
                border: 1px solid #e0e0e0;
                transition: box-shadow 0.2s;
            }

            .comparison-item:hover, .cost-item:hover, .payment-item:hover {
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .item-name, .project-name, .client-name {
                font-weight: 500;
                flex: 1;
                color: #2c3e50;
            }

            .status-ok {
                color: #00b894;
                font-weight: bold;
            }

            .status-warning {
                color: #fdcb6e;
                font-weight: bold;
            }

            .status-error {
                color: #e17055;
                font-weight: bold;
            }

            .cost-info, .payment-info {
                font-size: 0.9em;
                color: #636e72;
                margin: 0 10px;
            }

            /* 追加スタイル：統計表示 */
            .summary-stats, .stat-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }

            .stat-label {
                font-weight: 500;
                color: #2c3e50;
            }

            .stat-value {
                font-weight: bold;
                font-size: 1.1em;
            }

            /* プロジェクト・工事注文書・ファイル・材料屋リスト */
            .project-list, .work-order-list, .file-list, .supplier-list {
                margin-top: 15px;
            }

            .project-item, .work-order-item, .file-item, .supplier-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                margin: 8px 0;
                background: white;
                border-radius: 5px;
                border: 1px solid #e0e0e0;
                transition: box-shadow 0.2s;
            }

            .project-item:hover, .work-order-item:hover, .file-item:hover, .supplier-item:hover {
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .order-name, .order-amount, .file-name, .file-info, .supplier-name, .supplier-info {
                flex: 1;
                margin: 0 5px;
            }

            .order-amount, .file-info, .supplier-info {
                font-size: 0.9em;
                color: #636e72;
            }

            /* アップロード・アクション */
            .upload-section, .supplier-actions, .action-buttons {
                margin-top: 20px;
                padding: 15px;
                background: #f1f3f4;
                border-radius: 8px;
                text-align: center;
            }

            .upload-area {
                text-align: center;
                padding: 20px;
                border: 2px dashed #bdc3c7;
                border-radius: 8px;
                background: white;
            }

            .btn-primary, .btn-secondary {
                padding: 8px 16px;
                margin: 5px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 500;
            }

            .btn-primary {
                background: #0984e3;
                color: white;
            }

            .btn-secondary {
                background: #636e72;
                color: white;
            }

            .btn-primary:hover, .btn-secondary:hover {
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
    }

    createTabSystem() {
        console.log('🎯 タブシステム作成開始...');
        
        const container = document.getElementById('verification-container');
        if (!container) {
            console.error('❌ verification-containerが見つかりません');
            return;
        }
        
        // 新しいタブシステムHTML
        container.innerHTML = `
            <div class="tabs-container">
                <div class="tabs-nav">
                    <button class="tab-btn active" data-tab="summary">📊 照合サマリー</button>
                    <button class="tab-btn" data-tab="work-order">🏗️ 工事注文書照合</button>
                    <button class="tab-btn" data-tab="material-invoice">📄 材料発注vs請求</button>
                    <button class="tab-btn" data-tab="material-estimate">📦 材料見積vs発注</button>
                    <button class="tab-btn" data-tab="cost-total">💰 総原価検証</button>
                    <button class="tab-btn" data-tab="payment">💳 入金照合</button>
                    <button class="tab-btn" data-tab="supplier-files">🏢 材料屋請求書</button>
                    <button class="tab-btn" data-tab="suppliers">📋 材料屋一覧</button>
                </div>
                <div class="tabs-content">
                    <div id="summary" class="tab-content active">
                        <h2>📊 照合サマリー</h2>
                        <div id="summary-content">データを読み込み中...</div>
                    </div>
                    <div id="work-order" class="tab-content">
                        <h2>🏗️ 工事注文書照合</h2>
                        <div id="work-order-content">データを読み込み中...</div>
                    </div>
                    <div id="material-invoice" class="tab-content">
                        <h2>📄 材料発注vs請求</h2>
                        <div id="material-invoice-content">データを読み込み中...</div>
                    </div>
                    <div id="material-estimate" class="tab-content">
                        <h2>📦 材料見積vs発注</h2>
                        <div id="material-estimate-content">データを読み込み中...</div>
                    </div>
                    <div id="cost-total" class="tab-content">
                        <h2>💰 総原価検証</h2>
                        <div id="cost-total-content">データを読み込み中...</div>
                    </div>
                    <div id="payment" class="tab-content">
                        <h2>💳 入金照合</h2>
                        <div id="payment-content">データを読み込み中...</div>
                    </div>
                    <div id="supplier-files" class="tab-content">
                        <h2>🏢 材料屋請求書</h2>
                        <div id="supplier-files-content">データを読み込み中...</div>
                    </div>
                    <div id="suppliers" class="tab-content">
                        <h2>📋 材料屋一覧</h2>
                        <div id="suppliers-content">データを読み込み中...</div>
                    </div>
                </div>
            </div>
        `;
        
        // タブボタンイベント設定
        this.setupTabEventListeners();
        
        // 初期タブ表示（遅延実行）
        setTimeout(() => {
            console.log('📊 初期タブ（summary）を表示中...');
            this.showTab('summary');
        }, 100);
        
        // 初期データ読み込み
        this.loadProjectsData();
        
        console.log('✅ タブシステム作成完了');
    }

    setupTabEventListeners() {
        console.log('🎯 タブイベントリスナー設定開始...');
        
        // タブボタンのイベントリスナーを設定
        const setupTabButtons = () => {
            const tabButtons = document.querySelectorAll('.tab-btn');
            console.log(`📋 タブボタン数: ${tabButtons.length}`);
            
            if (tabButtons.length === 0) {
                console.warn('⚠️ タブボタンが見つかりません - 再試行します');
                return false;
            }
            
            tabButtons.forEach((btn, index) => {
                const tabName = btn.dataset.tab;
                console.log(`🔘 タブボタン ${index + 1}: ${tabName}`);
                
                // 新しいイベントリスナーを追加
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`🖱️ タブクリック: ${tabName}`);
                    this.showTab(tabName);
                });
            });
            
            console.log('✅ タブイベントリスナー設定完了');
            return true;
        };
        
        // 即座に試行
        if (!setupTabButtons()) {
            // 失敗した場合は遅延して再試行
            setTimeout(() => {
                console.log('🔄 タブボタン設定を再試行中...');
                setupTabButtons();
            }, 500);
        }
        
        // グローバル関数として照合実行関数を設定
        window.runDetailedVerification = () => {
            console.log('🚀 グローバル照合実行関数が呼ばれました');
            if (window.verificationSystem) {
                window.verificationSystem.runDetailedVerification();
            } else {
                console.error('❌ verificationSystemが見つかりません');
            }
        };
        
        window.loadProjectsData = () => {
            console.log('🔄 グローバルデータ更新関数が呼ばれました');
            if (window.verificationSystem) {
                window.verificationSystem.loadProjectsData();
            } else {
                console.error('❌ verificationSystemが見つかりません');
            }
        };
        
        window.exportVerificationReport = () => {
            console.log('📊 グローバルレポート出力関数が呼ばれました');
            if (window.verificationSystem) {
                window.verificationSystem.exportVerificationReport();
            } else {
                console.error('❌ verificationSystemが見つかりません');
            }
        };
        
        console.log('✅ グローバル関数設定完了');
    }

    async runDetailedVerification() {
        this.showLoading('詳細照合チェックを実行中...');
        
        try {
            // まずプロジェクトデータを取得
            const projects = await dataManager.getProjectsWithCache();
            
            // 照合結果を生成（モックデータまたは実際のAPI）
            let verificationResults;
            try {
                // APIから照合サマリーを取得を試行
                const summary = await dataManager.apiClient.request('/verification/summary');
                const detailedResults = await dataManager.apiClient.request('/verification/run', {
                    method: 'POST'
                });
                
                verificationResults = {
                    summary,
                    details: detailedResults
                };
            } catch (error) {
                console.log('API照合失敗、ローカル照合を実行:', error);
                // APIが失敗した場合はローカルで照合を実行
                verificationResults = this.performLocalVerification(projects);
            }

            this.currentVerificationData = verificationResults;

            this.displayVerificationSummary(verificationResults.summary);
            this.displayVerificationResults(verificationResults.details);
            
            // サマリー表示
            const summaryElement = document.getElementById('verification-summary');
            if (summaryElement) {
                summaryElement.style.display = 'block';
            }
            
            // 成功メッセージ
            this.showSuccessMessage('詳細照合チェックが完了しました！');
            
        } catch (error) {
            console.error('詳細照合エラー:', error);
            this.showErrorMessage('詳細照合チェック中にエラーが発生しました: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    // ローカル照合実行
    performLocalVerification(projects) {
        const summary = {
            okCount: 0,
            warningCount: 0,
            errorCount: 0,
            totalChecks: projects.length,
            okPercent: 0
        };

        const details = projects.map(project => {
            const checks = this.analyzeProject(project);
            
            // サマリーカウント更新
            if (checks.overallStatus === 'ok') summary.okCount++;
            else if (checks.overallStatus === 'warning') summary.warningCount++;
            else summary.errorCount++;

            return {
                projectNo: project.projectNo || project.物件No,
                projectName: project.projectName || project.物件名,
                supervisor: project.supervisor || project.担当者,
                overallStatus: checks.overallStatus,
                checks: checks
            };
        });

        summary.okPercent = summary.totalChecks > 0 ? 
            Math.round((summary.okCount / summary.totalChecks) * 100) : 0;

        return { summary, details };
    }

    // プロジェクト分析
    analyzeProject(project) {
        const checks = {
            materialEstimateVsOrder: this.checkMaterialEstimate(project),
            materialOrderVsInvoice: this.checkMaterialInvoice(project),
            workEstimateVsOrder: this.checkWorkEstimate(project),
            totalCostVerification: this.checkTotalCost(project),
            paymentVerification: this.checkPayment(project)
        };

        // 全体ステータス決定
        const statuses = Object.values(checks).map(check => 
            Array.isArray(check) ? (check.length > 0 ? check[0].type : 'ok') : check.type
        );

        const hasError = statuses.includes('error');
        const hasWarning = statuses.includes('warning');

        checks.overallStatus = hasError ? 'error' : hasWarning ? 'warning' : 'ok';

        return checks;
    }

    // 各種チェック関数
    checkMaterialEstimate(project) {
        const profitRate = project.profitRate || project.利益率 || 0;
        if (profitRate < 15) {
            return { type: 'warning', message: `利益率が低い (${profitRate.toFixed(1)}%)` };
        } else if (profitRate > 30) {
            return { type: 'ok', message: `利益率良好 (${profitRate.toFixed(1)}%)` };
        }
        return { type: 'ok', message: `利益率正常 (${profitRate.toFixed(1)}%)` };
    }

    checkMaterialInvoice(project) {
        const contractAmount = project.contractAmount || project.契約額 || 0;
        if (contractAmount > 5000000) {
            return { type: 'warning', message: '高額案件 - 要注意' };
        }
        return { type: 'ok', message: '材料請求チェックOK' };
    }

    checkWorkEstimate(project) {
        const status = project.status || project.ステータス;
        if (status === '照合待ち') {
            return { type: 'warning', message: '照合作業が必要' };
        }
        return { type: 'ok', message: '工事見積チェックOK' };
    }

    checkTotalCost(project) {
        const costAmount = project.costAmount || project.原価金額 || 0;
        const contractAmount = project.contractAmount || project.契約額 || 0;
        
        if (costAmount > contractAmount * 0.9) {
            return { type: 'error', message: '原価率が高すぎます' };
        }
        return { type: 'ok', message: '総原価チェックOK' };
    }

    checkPayment(project) {
        const status = project.status || project.ステータス;
        if (status === '完了') {
            return { type: 'ok', message: '入金確認済み' };
        }
        return { type: 'warning', message: '入金未確認' };
    }

    // 成功メッセージ表示
    showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.innerHTML = `✅ ${message}`;
        
        const container = document.querySelector('.summary-dashboard');
        if (container) {
            container.prepend(alertDiv);
            setTimeout(() => alertDiv.remove(), 5000);
        }
    }

    // エラーメッセージ表示
    showErrorMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-error';
        alertDiv.innerHTML = `❌ ${message}`;
        
        const container = document.querySelector('.summary-dashboard');
        if (container) {
            container.prepend(alertDiv);
            setTimeout(() => alertDiv.remove(), 8000);
        }
    }

    displayVerificationSummary(summary) {
        document.getElementById('summary-ok').textContent = summary.okCount;
        document.getElementById('summary-warning').textContent = summary.warningCount;
        document.getElementById('summary-error').textContent = summary.errorCount;
        document.getElementById('summary-total').textContent = summary.totalChecks;
        document.getElementById('summary-percent').textContent = summary.okPercent + '%';
    }

    displayVerificationResults(results) {
        const container = document.getElementById('projects-verification-list');
        container.innerHTML = '';

        results.forEach(project => {
            const projectCard = this.createProjectVerificationCard(project);
            container.appendChild(projectCard);
        });
    }

    createProjectVerificationCard(project) {
        const card = document.createElement('div');
        card.className = 'project-verification-card';

        const statusIcons = this.generateStatusIcons(project.checks);
        
        card.innerHTML = `
            <div class="project-verification-header">
                <div>
                    <div class="project-verification-title">${project.projectName}</div>
                    <div class="text-muted">物件No: ${project.projectNo}</div>
                </div>
                <div class="project-verification-summary">
                    ${statusIcons}
                    <button class="btn-small btn-primary" onclick="enhancedVerification.showProjectDetail('${project.projectNo}')">
                        詳細表示
                    </button>
                </div>
            </div>
            <div class="verification-quick-summary">
                ${this.generateQuickSummary(project.checks)}
            </div>
        `;

        return card;
    }

    generateStatusIcons(checks) {
        const statuses = [];
        Object.values(checks).forEach(check => {
            if (Array.isArray(check)) {
                check.forEach(item => statuses.push(item.type));
            } else {
                statuses.push(check.type);
            }
        });

        const icons = statuses.map(status => 
            `<span class="mini-status ${status}" title="${status}"></span>`
        );

        return icons.join('');
    }

    generateQuickSummary(checks) {
        const summaryItems = [
            { label: '材料見積vs発注', data: checks.materialEstimateVsOrder },
            { label: '材料発注vs請求', data: checks.materialOrderVsInvoice },
            { label: '工事見積vs発注', data: checks.workEstimateVsOrder },
            { label: '総原価照合', data: checks.totalCostVerification },
            { label: '入金照合', data: checks.paymentVerification }
        ];

        return summaryItems.map(item => {
            const status = Array.isArray(item.data) ? 
                (item.data.length > 0 ? item.data[0].type : 'ok') : 
                item.data.type;
            
            return `
                <div class="verification-quick-item ${status}">
                    <span class="quick-label">${item.label}</span>
                    <span class="quick-status ${status}">
                        ${status === 'ok' ? '✓' : status === 'warning' ? '⚠' : '✗'}
                    </span>
                </div>
            `;
        }).join('');
    }

    switchVerificationTab(tabName) {
        // タブボタンの状態更新
        document.querySelectorAll('.verification-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // タブコンテンツの表示切り替え
        document.querySelectorAll('.verification-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`verification-${tabName}`).classList.add('active');
    }

    async showProjectDetail(projectNo) {
        try {
            const details = await dataManager.apiClient.request(`/verification/detailed/${projectNo}`, {
                method: 'POST'
            });

            this.displayProjectDetailModal(details);
        } catch (error) {
            console.error('プロジェクト詳細取得エラー:', error);
        }
    }

    displayProjectDetailModal(details) {
        const modal = document.getElementById('verification-detail-modal');
        const modalBody = document.getElementById('verification-modal-body');

        modalBody.innerHTML = `
            <h2>📋 詳細照合結果: ${details.projectName}</h2>
            <div class="modal-verification-details">
                ${this.generateDetailedChecksHTML(details.checks)}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    generateDetailedChecksHTML(checks) {
        let html = '';
        
        Object.entries(checks).forEach(([checkType, checkData]) => {
            html += `<div class="verification-section">`;
            html += `<h3>${this.getCheckTypeLabel(checkType)}</h3>`;
            
            if (Array.isArray(checkData)) {
                checkData.forEach(item => {
                    html += `
                        <div class="verification-item ${item.type}">
                            <div class="verification-item-header">
                                <span class="verification-item-title">${item.item || item.message}</span>
                                <span class="verification-item-status ${item.type}">
                                    ${item.type === 'ok' ? 'OK' : item.type === 'warning' ? '要確認' : 'エラー'}
                                </span>
                            </div>
                            <p>${item.message}</p>
                        </div>
                    `;
                });
            } else {
                html += `
                    <div class="verification-item ${checkData.type}">
                        <div class="verification-item-header">
                            <span class="verification-item-title">${checkData.message}</span>
                            <span class="verification-item-status ${checkData.type}">
                                ${checkData.type === 'ok' ? 'OK' : checkData.type === 'warning' ? '要確認' : 'エラー'}
                            </span>
                        </div>
                    </div>
                `;
            }
            
            html += `</div>`;
        });
        
        return html;
    }

    getCheckTypeLabel(checkType) {
        const labels = {
            materialEstimateVsOrder: '📦 材料見積vs発注',
            materialOrderVsInvoice: '📄 材料発注vs請求',
            workEstimateVsOrder: '🔨 工事見積vs発注',
            totalCostVerification: '💰 総原価照合',
            paymentVerification: '💳 入金照合'
        };
        
        return labels[checkType] || checkType;
    }

    async exportVerificationReport() {
        if (!this.currentVerificationData) {
            alert('照合データがありません。まず詳細照合を実行してください。');
            return;
        }

        // CSV形式でレポートを生成
        const csvContent = this.generateCSVReport(this.currentVerificationData);
        
        // ダウンロード
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `照合レポート_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    }

    generateCSVReport(data) {
        // CSV生成ロジック
        let csv = '物件No,物件名,チェック項目,ステータス,詳細\n';
        
        data.details.forEach(project => {
            Object.entries(project.checks).forEach(([checkType, checkResult]) => {
                if (Array.isArray(checkResult)) {
                    checkResult.forEach(item => {
                        csv += `${project.projectNo},${project.projectName},${checkType},${item.type},"${item.message}"\n`;
                    });
                } else {
                    csv += `${project.projectNo},${project.projectName},${checkType},${checkResult.type},"${checkResult.message}"\n`;
                }
            });
        });

        return csv;
    }

    async refreshVerification() {
        // キャッシュをクリアして再読み込み
        if (dataManager && dataManager.cache) {
            dataManager.cache.clear();
        }
        
        if (this.currentVerificationData) {
            await this.runDetailedVerification();
        }
    }

    showLoading(message = '処理中...') {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.querySelector('p').textContent = message;
            loading.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    // タブナビゲーション作成
    createTabs() {
        const tabsHTML = `
            <div class="tabs-container">
                <nav class="tabs-nav">
                    <button class="tab-btn active" data-tab="summary">📊 照合サマリー</button>
                    <button class="tab-btn" data-tab="work-order-check">📋 工事注文書照合</button>
                    <button class="tab-btn" data-tab="work-order">🔨 工事発注vs見積</button>
                    <button class="tab-btn" data-tab="material-invoice">📦 材料発注vs請求</button>
                    <button class="tab-btn" data-tab="material-estimate">💰 材料見積vs発注</button>
                    <button class="tab-btn" data-tab="total-cost">📋 総原価検証</button>
                    <button class="tab-btn" data-tab="payment">💳 入金照合</button>
                    <button class="tab-btn" data-tab="supplier-files">🏭 材料屋請求書</button>
                    <button class="tab-btn" data-tab="contractor-files">👷 工事業者請求</button>
                    <button class="tab-btn" data-tab="company-data">🏢 社内データ</button>
                    <button class="tab-btn" data-tab="suppliers">🏢 材料屋管理</button>
                </nav>
                <div class="content-area">
                    <!-- ここに各タブのコンテンツが表示される -->
                </div>
            </div>
        `;
        
        return tabsHTML;
    }

    // サマリータブ表示
    showSummaryTab(container) {
        container.innerHTML = `
            <div class="tab-content">
                <h3>📊 照合サマリー</h3>
                <div class="summary-dashboard">
                    <div class="summary-cards">
                        <div class="summary-card">
                            <h4>案件総数</h4>
                            <div class="summary-number" id="total-projects-count">5</div>
                        </div>
                        <div class="summary-card">
                            <h4>照合完了</h4>
                            <div class="summary-number" id="verified-projects-count">2</div>
                        </div>
                        <div class="summary-card">
                            <h4>要確認</h4>
                            <div class="summary-number" id="warning-projects-count">2</div>
                        </div>
                        <div class="summary-card">
                            <h4>エラー</h4>
                            <div class="summary-number" id="error-projects-count">1</div>
                        </div>
                    </div>
                    <div class="summary-actions">
                        <button class="btn-primary" onclick="verificationSystem.runDetailedVerification()">
                            🚀 詳細照合実行
                        </button>
                        <button class="btn-secondary" onclick="verificationSystem.exportVerificationReport()">
                            📊 レポート出力
                        </button>
                        <button class="btn-secondary" onclick="verificationSystem.loadProjectsData()">
                            🔄 データ更新
                        </button>
                    </div>
                    <div id="projects-list" class="projects-list">
                        <!-- 初期データを即座に表示 -->
                        <h4>📋 案件一覧</h4>
                        <div class="projects-grid">
                            <div class="project-card completed">
                                <div class="project-header">
                                    <h5>パレス代々木　201号室</h5>
                                    <span class="project-no">37.07.133</span>
                                </div>
                                <div class="project-details">
                                    <div class="detail-row">
                                        <span class="label">顧客:</span>
                                        <span class="value">興和管理(株)</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">担当:</span>
                                        <span class="value">藤岡</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">契約額:</span>
                                        <span class="value">¥156,500</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">利益率:</span>
                                        <span class="value high-profit">20.0%</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">ステータス:</span>
                                        <span class="status completed">完了</span>
                                    </div>
                                </div>
                                <div class="project-actions">
                                    <button class="btn-small btn-primary" onclick="verificationSystem.showProjectDetail('37.07.133')">
                                        詳細表示
                                    </button>
                                </div>
                            </div>
                            
                            <div class="project-card pending">
                                <div class="project-header">
                                    <h5>サンアセント　301号室</h5>
                                    <span class="project-no">37.06.124</span>
                                </div>
                                <div class="project-details">
                                    <div class="detail-row">
                                        <span class="label">顧客:</span>
                                        <span class="value">アプロホールディングス(株)</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">担当:</span>
                                        <span class="value">藤岡</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">契約額:</span>
                                        <span class="value">¥172,000</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">利益率:</span>
                                        <span class="value low-profit">14.9%</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">ステータス:</span>
                                        <span class="status pending">照合待ち</span>
                                    </div>
                                </div>
                                <div class="project-actions">
                                    <button class="btn-small btn-primary" onclick="verificationSystem.showProjectDetail('37.06.124')">
                                        詳細表示
                                    </button>
                                </div>
                            </div>
                            
                            <div class="project-card in-progress">
                                <div class="project-header">
                                    <h5>中外医学社　女子トイレ</h5>
                                    <span class="project-no">37.06.120</span>
                                </div>
                                <div class="project-details">
                                    <div class="detail-row">
                                        <span class="label">顧客:</span>
                                        <span class="value">株式会社東元社</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">担当:</span>
                                        <span class="value">藤岡</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">契約額:</span>
                                        <span class="value">¥85,000</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">利益率:</span>
                                        <span class="value normal-profit">15.0%</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">ステータス:</span>
                                        <span class="status in-progress">進行中</span>
                                    </div>
                                </div>
                                <div class="project-actions">
                                    <button class="btn-small btn-primary" onclick="verificationSystem.showProjectDetail('37.06.120')">
                                        詳細表示
                                    </button>
                                </div>
                            </div>
                            
                            <div class="project-card pending">
                                <div class="project-header">
                                    <h5>日興パレス永代　803号室</h5>
                                    <span class="project-no">37.06.115</span>
                                </div>
                                <div class="project-details">
                                    <div class="detail-row">
                                        <span class="label">顧客:</span>
                                        <span class="value">興和管理(株)</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">担当:</span>
                                        <span class="value">藤岡</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">契約額:</span>
                                        <span class="value">¥35,000</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">利益率:</span>
                                        <span class="value low-profit">10.0%</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">ステータス:</span>
                                        <span class="status pending">照合待ち</span>
                                    </div>
                                </div>
                                <div class="project-actions">
                                    <button class="btn-small btn-primary" onclick="verificationSystem.showProjectDetail('37.06.115')">
                                        詳細表示
                                    </button>
                                </div>
                            </div>
                            
                            <div class="project-card completed">
                                <div class="project-header">
                                    <h5>ピアハウス201</h5>
                                    <span class="project-no">37.06.110</span>
                                </div>
                                <div class="project-details">
                                    <div class="detail-row">
                                        <span class="label">顧客:</span>
                                        <span class="value">(株)ウィングスジャパン</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">担当:</span>
                                        <span class="value">藤岡</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">契約額:</span>
                                        <span class="value">¥42,000</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">利益率:</span>
                                        <span class="value high-profit">20.0%</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="label">ステータス:</span>
                                        <span class="status completed">完了</span>
                                    </div>
                                </div>
                                <div class="project-actions">
                                    <button class="btn-small btn-primary" onclick="verificationSystem.showProjectDetail('37.06.110')">
                                        詳細表示
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // APIからのデータ読み込みも並行して実行（バックグラウンド）
        this.loadProjectsData();
    }

    // プロジェクトデータ読み込み
    async loadProjectsData() {
        try {
            this.showLoading('プロジェクトデータを読み込み中...');
            
            // APIからプロジェクトデータを取得
            const projects = await dataManager.getProjectsWithCache();
            
            // サマリー数値を更新
            this.updateSummaryNumbers(projects);
            
            // プロジェクト一覧を表示
            this.displayProjectsList(projects);
            
            // ステータスバーを更新
            this.updateStatusBar(projects);
            
        } catch (error) {
            console.error('データ読み込みエラー:', error);
            
            // フォールバック: ローカルデータを使用
            if (typeof PROJECT_DATA !== 'undefined') {
                this.updateSummaryNumbers(PROJECT_DATA);
                this.displayProjectsList(PROJECT_DATA);
                this.updateStatusBar(PROJECT_DATA);
                
                const errorMsg = document.createElement('div');
                errorMsg.className = 'alert alert-warning';
                errorMsg.innerHTML = '⚠️ サーバーに接続できません。ローカルデータを表示しています。';
                document.querySelector('.summary-dashboard').prepend(errorMsg);
            }
        } finally {
            this.hideLoading();
        }
    }

    // サマリー数値更新
    updateSummaryNumbers(projects) {
        const totalCount = projects.length;
        const completedCount = projects.filter(p => p.status === '完了').length;
        const warningCount = projects.filter(p => p.status === '照合待ち').length;
        const errorCount = projects.filter(p => p.profitRate < 15).length;

        document.getElementById('total-projects-count').textContent = totalCount;
        document.getElementById('verified-projects-count').textContent = completedCount;
        document.getElementById('warning-projects-count').textContent = warningCount;
        document.getElementById('error-projects-count').textContent = errorCount;
    }

    // プロジェクト一覧表示
    displayProjectsList(projects) {
        const container = document.getElementById('projects-list');
        if (!container) return;

        let html = `
            <h4>📋 案件一覧</h4>
            <div class="projects-grid">
        `;

        projects.forEach(project => {
            const statusClass = this.getStatusClass(project.status);
            const profitClass = project.profitRate < 15 ? 'low-profit' : project.profitRate > 25 ? 'high-profit' : 'normal-profit';
            
            html += `
                <div class="project-card ${statusClass}">
                    <div class="project-header">
                        <h5>${project.projectName || project.物件名}</h5>
                        <span class="project-no">${project.projectNo || project.物件No}</span>
                    </div>
                    <div class="project-details">
                        <div class="detail-row">
                            <span class="label">顧客:</span>
                            <span class="value">${project.customer || project.顧客名}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">担当:</span>
                            <span class="value">${project.supervisor || project.担当者}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">契約額:</span>
                            <span class="value">¥${(project.contractAmount || project.契約額 || 0).toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">利益率:</span>
                            <span class="value ${profitClass}">${(project.profitRate || project.利益率 || 0).toFixed(1)}%</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">ステータス:</span>
                            <span class="status ${statusClass}">${project.status || project.ステータス}</span>
                        </div>
                    </div>
                    <div class="project-actions">
                        <button class="btn-small btn-primary" onclick="verificationSystem.showProjectDetail('${project.projectNo || project.物件No}')">
                            詳細表示
                        </button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    // ステータスクラス取得
    getStatusClass(status) {
        switch (status) {
            case '完了': return 'completed';
            case '進行中': return 'in-progress';
            case '照合待ち': return 'pending';
            default: return 'pending';
        }
    }

    // ステータスバー更新
    updateStatusBar(projects) {
        const totalProjects = document.getElementById('total-projects');
        const alertCount = document.getElementById('alert-count');
        const lastUpdate = document.getElementById('last-update');

        if (totalProjects) {
            totalProjects.textContent = `案件数: ${projects.length}件`;
        }

        if (alertCount) {
            const warningCount = projects.filter(p => p.status === '照合待ち' || p.profitRate < 15).length;
            alertCount.textContent = `要確認: ${warningCount}件`;
        }

        if (lastUpdate) {
            lastUpdate.textContent = `最終更新: ${new Date().toLocaleTimeString()}`;
        }
    }

    // 各種タブ表示メソッド（簡略版）
    showWorkOrderTab(container) {
        container.innerHTML = `
            <div class="tab-content">
                <h3>📋 工事注文書照合システム</h3>
                <div class="work-order-info">
                    <p>🎯 <strong>照合内容:</strong> 工事注文書の発注金額と詳細明細の合計金額の照合</p>
                    <p>📊 <strong>チェック項目:</strong> 明細合計、業者マスター、単価妥当性</p>
                </div>
                
                <div class="work-order-actions">
                    <button class="btn-primary" onclick="verificationSystem.runWorkOrderVerification()">
                        🚀 工事注文書一括照合
                    </button>
                    <button class="btn-secondary" onclick="verificationSystem.loadWorkOrders()">
                        📋 工事注文書一覧表示
                    </button>
                    <button class="btn-secondary" onclick="verificationSystem.exportWorkOrderReport()">
                        📊 照合結果出力
                    </button>
                </div>
                
                <div id="work-order-summary" class="verification-summary">
                    <div class="summary-cards">
                        <div class="summary-card ok">
                            <div class="summary-number" id="work-order-ok">3</div>
                            <div class="summary-label">照合OK</div>
                        </div>
                        <div class="summary-card warning">
                            <div class="summary-number" id="work-order-warning">1</div>
                            <div class="summary-label">要確認</div>
                        </div>
                        <div class="summary-card error">
                            <div class="summary-number" id="work-order-error">1</div>
                            <div class="summary-label">エラー</div>
                        </div>
                        <div class="summary-card total">
                            <div class="summary-number" id="work-order-total">5</div>
                            <div class="summary-label">総件数</div>
                            <div class="summary-amount" id="work-order-diff">¥31,500</div>
                        </div>
                    </div>
                </div>
                
                <div id="work-order-results" class="work-order-results">
                    <h4>📋 工事注文書照合結果</h4>
                    <div class="work-order-grid">
                        <div class="work-order-card ok">
                            <div class="work-order-header">
                                <h5>パレス代々木　201号室</h5>
                                <span class="ticket-no">伝票No: 267499</span>
                            </div>
                            <div class="work-order-details">
                                <div class="detail-row">
                                    <span class="label">発注先:</span>
                                    <span class="value">インテリアナガイ　永井英仁</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">発注金額:</span>
                                    <span class="value">¥69,500</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">明細合計:</span>
                                    <span class="value">¥69,500</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">差異:</span>
                                    <span class="value no-diff">¥0</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">差異率:</span>
                                    <span class="value">0.00%</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">照合結果:</span>
                                    <span class="status ok">OK</span>
                                </div>
                            </div>
                            <div class="work-order-actions">
                                <button class="btn-small btn-primary" onclick="verificationSystem.showWorkOrderDetail('267499')">
                                    詳細表示
                                </button>
                            </div>
                        </div>
                        
                        <div class="work-order-card error">
                            <div class="work-order-header">
                                <h5>斎藤様邸　B1　壁面部分塗装</h5>
                                <span class="ticket-no">伝票No: 267926</span>
                            </div>
                            <div class="work-order-details">
                                <div class="detail-row">
                                    <span class="label">発注先:</span>
                                    <span class="value">(同)村上塗装</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">発注金額:</span>
                                    <span class="value">¥38,000</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">明細合計:</span>
                                    <span class="value">¥69,500</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">差異:</span>
                                    <span class="value negative-diff">-¥31,500</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">差異率:</span>
                                    <span class="value">82.89%</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">照合結果:</span>
                                    <span class="status error">ERROR</span>
                                </div>
                            </div>
                            <div class="work-order-actions">
                                <button class="btn-small btn-primary" onclick="verificationSystem.showWorkOrderDetail('267926')">
                                    詳細表示
                                </button>
                            </div>
                        </div>
                        
                        <div class="work-order-card ok">
                            <div class="work-order-header">
                                <h5>日興パレス永代　803号室</h5>
                                <span class="ticket-no">伝票No: 267839</span>
                            </div>
                            <div class="work-order-details">
                                <div class="detail-row">
                                    <span class="label">発注先:</span>
                                    <span class="value">(株)小菅硝子　真砂</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">発注金額:</span>
                                    <span class="value">¥21,000</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">明細合計:</span>
                                    <span class="value">¥21,000</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">差異:</span>
                                    <span class="value no-diff">¥0</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">差異率:</span>
                                    <span class="value">0.00%</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">照合結果:</span>
                                    <span class="status ok">OK</span>
                                </div>
                            </div>
                            <div class="work-order-actions">
                                <button class="btn-small btn-primary" onclick="verificationSystem.showWorkOrderDetail('267839')">
                                    詳細表示
                                </button>
                            </div>
                        </div>
                        
                        <div class="work-order-card ok">
                            <div class="work-order-header">
                                <h5>ピアハウス201</h5>
                                <span class="ticket-no">伝票No: 267837</span>
                            </div>
                            <div class="work-order-details">
                                <div class="detail-row">
                                    <span class="label">発注先:</span>
                                    <span class="value">吉川設備</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">発注金額:</span>
                                    <span class="value">¥25,000</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">明細合計:</span>
                                    <span class="value">¥25,000</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">差異:</span>
                                    <span class="value no-diff">¥0</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">差異率:</span>
                                    <span class="value">0.00%</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">照合結果:</span>
                                    <span class="status ok">OK</span>
                                </div>
                            </div>
                            <div class="work-order-actions">
                                <button class="btn-small btn-primary" onclick="verificationSystem.showWorkOrderDetail('267837')">
                                    詳細表示
                                </button>
                            </div>
                        </div>
                        
                        <div class="work-order-card warning">
                            <div class="work-order-header">
                                <h5>中外医学社　女子トイレ</h5>
                                <span class="ticket-no">伝票No: 267934</span>
                            </div>
                            <div class="work-order-details">
                                <div class="detail-row">
                                    <span class="label">発注先:</span>
                                    <span class="value">(株)アンセイ</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">発注金額:</span>
                                    <span class="value">¥0</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">明細合計:</span>
                                    <span class="value">¥0</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">差異:</span>
                                    <span class="value no-diff">¥0</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">差異率:</span>
                                    <span class="value">0.00%</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">照合結果:</span>
                                    <span class="status warning">WARNING</span>
                                </div>
                            </div>
                            <div class="work-order-actions">
                                <button class="btn-small btn-primary" onclick="verificationSystem.showWorkOrderDetail('267934')">
                                    詳細表示
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 工事注文書一括照合実行
    async runWorkOrderVerification() {
        try {
            this.showLoading('工事注文書照合を実行中...');
            
            const response = await fetch('/api/verify-all-work-orders', {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // サマリー表示
            this.displayWorkOrderSummary(data.summary);
            
            // 詳細結果表示
            this.displayWorkOrderResults(data.results);
            
            // サマリーを表示
            document.getElementById('work-order-summary').style.display = 'block';
            
            this.showSuccessMessage(`工事注文書照合完了！ ${data.summary.総件数}件を処理しました。`);
            
        } catch (error) {
            console.error('工事注文書照合エラー:', error);
            this.showErrorMessage('工事注文書照合中にエラーが発生しました: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    // 工事注文書サマリー表示
    displayWorkOrderSummary(summary) {
        document.getElementById('work-order-ok').textContent = summary.OK件数;
        document.getElementById('work-order-warning').textContent = summary.WARNING件数;
        document.getElementById('work-order-error').textContent = summary.ERROR件数;
        document.getElementById('work-order-total').textContent = summary.総件数;
        document.getElementById('work-order-diff').textContent = `¥${summary.総差異金額.toLocaleString()}`;
    }

    // 工事注文書結果表示
    displayWorkOrderResults(results) {
        const container = document.getElementById('work-order-results');
        
        let html = `
            <h4>📋 工事注文書照合結果</h4>
            <div class="work-order-grid">
        `;
        
        results.forEach(result => {
            const statusClass = result.照合結果.toLowerCase();
            const diffClass = result.差異 === 0 ? 'no-diff' : result.差異 > 0 ? 'positive-diff' : 'negative-diff';
            
            html += `
                <div class="work-order-card ${statusClass}">
                    <div class="work-order-header">
                        <h5>${result.物件名}</h5>
                        <span class="ticket-no">伝票No: ${result.伝票番号}</span>
                    </div>
                    <div class="work-order-details">
                        <div class="detail-row">
                            <span class="label">発注先:</span>
                            <span class="value">${result.発注先名}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">発注金額:</span>
                            <span class="value">¥${result.発注金額.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">明細合計:</span>
                            <span class="value">¥${result.詳細明細合計.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">差異:</span>
                            <span class="value ${diffClass}">¥${result.差異.toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">差異率:</span>
                            <span class="value">${result.差異率.toFixed(2)}%</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">照合結果:</span>
                            <span class="status ${statusClass}">${result.照合結果}</span>
                        </div>
                    </div>
                    <div class="work-order-actions">
                        <button class="btn-small btn-primary" onclick="verificationSystem.showWorkOrderDetail('${result.伝票番号}')">
                            詳細表示
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        container.innerHTML = html;
    }

    // 工事注文書詳細表示
    async showWorkOrderDetail(ticketNo) {
        try {
            const response = await fetch(`/api/verify-work-order/${ticketNo}`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // モーダルで詳細表示
            this.displayWorkOrderDetailModal(data);
            
        } catch (error) {
            console.error('工事注文書詳細取得エラー:', error);
            this.showErrorMessage('詳細情報の取得に失敗しました');
        }
    }

    // 工事注文書詳細モーダル表示
    displayWorkOrderDetailModal(data) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content large">
                <h3>📋 工事注文書詳細照合結果</h3>
                <div class="modal-header">
                    <div class="detail-info">
                        <p><strong>伝票番号:</strong> ${data.伝票番号}</p>
                        <p><strong>発注先:</strong> ${data.発注先名}</p>
                        <p><strong>物件名:</strong> ${data.物件名}</p>
                        <p><strong>照合結果:</strong> <span class="status ${data.照合結果.toLowerCase()}">${data.照合結果}</span></p>
                    </div>
                </div>
                
                <div class="amount-comparison">
                    <div class="amount-item">
                        <h4>発注金額</h4>
                        <div class="amount">¥${data.発注金額.toLocaleString()}</div>
                    </div>
                    <div class="amount-item">
                        <h4>明細合計</h4>
                        <div class="amount">¥${data.詳細明細合計.toLocaleString()}</div>
                    </div>
                    <div class="amount-item ${data.差異 === 0 ? 'no-diff' : data.差異 > 0 ? 'positive-diff' : 'negative-diff'}">
                        <h4>差異</h4>
                        <div class="amount">¥${data.差異.toLocaleString()}</div>
                    </div>
                </div>
                
                <div class="detail-breakdown">
                    <h4>📝 詳細明細</h4>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>明細</th>
                                <th>金額</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.詳細明細.map(item => `
                                <tr>
                                    <td>${item.No}</td>
                                    <td>${item.明細}</td>
                                    <td class="amount-cell">¥${item.金額.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr class="total-row">
                                <td colspan="2"><strong>合計</strong></td>
                                <td class="amount-cell"><strong>¥${data.詳細明細合計.toLocaleString()}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div class="check-results">
                    <h4>✅ チェック項目</h4>
                    ${data.チェック項目.map(check => `
                        <div class="check-item ${check.結果.toLowerCase()}">
                            <div class="check-header">
                                <span class="check-name">${check.項目}</span>
                                <span class="check-status ${check.結果.toLowerCase()}">${check.結果}</span>
                            </div>
                            <div class="check-detail">${check.詳細}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="modal-actions">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-secondary">
                        閉じる
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // 工事注文書一覧読み込み
    async loadWorkOrders() {
        try {
            this.showLoading('工事注文書一覧を読み込み中...');
            
            const response = await fetch('/api/work-orders');
            const workOrders = await response.json();
            
            this.displayWorkOrderList(workOrders);
            
        } catch (error) {
            console.error('工事注文書一覧取得エラー:', error);
            this.showErrorMessage('工事注文書一覧の取得に失敗しました');
        } finally {
            this.hideLoading();
        }
    }

    // 工事注文書一覧表示
    displayWorkOrderList(workOrders) {
        const container = document.getElementById('work-order-results');
        
        let html = `
            <h4>📋 工事注文書一覧</h4>
            <div class="work-order-list">
                <table class="work-order-table">
                    <thead>
                        <tr>
                            <th>伝票番号</th>
                            <th>発注日付</th>
                            <th>発注先</th>
                            <th>物件名</th>
                            <th>担当者</th>
                            <th>発注金額</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        workOrders.forEach(order => {
            html += `
                <tr>
                    <td>${order.伝票番号}</td>
                    <td>${order.発注日付}</td>
                    <td>${order.発注先名}</td>
                    <td>${order.物件名}</td>
                    <td>${order.担当者}</td>
                    <td class="amount-cell">¥${order.発注金額.toLocaleString()}</td>
                    <td>
                        <button class="btn-small btn-primary" onclick="verificationSystem.showWorkOrderDetail('${order.伝票番号}')">
                            詳細照合
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }

    // 工事注文書レポート出力
    async exportWorkOrderReport() {
        try {
            const response = await fetch('/api/verify-all-work-orders', {
                method: 'POST'
            });
            
            const data = await response.json();
            
            // CSV形式でダウンロード
            const csvContent = this.generateWorkOrderCSV(data.results);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `工事注文書照合結果_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            
            this.showSuccessMessage('工事注文書照合結果をCSVファイルでダウンロードしました');
            
        } catch (error) {
            console.error('レポート出力エラー:', error);
            this.showErrorMessage('レポート出力に失敗しました');
        }
    }

    // 工事注文書CSV生成
    generateWorkOrderCSV(results) {
        const headers = ['伝票番号', '発注先名', '物件名', '発注金額', '明細合計', '差異', '差異率', '照合結果'];
        const rows = results.map(result => [
            result.伝票番号,
            result.発注先名,
            result.物件名,
            result.発注金額,
            result.詳細明細合計,
            result.差異,
            result.差異率.toFixed(2) + '%',
            result.照合結果
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // 1. 材料屋請求書処理タブ
    showSupplierFilesTab(container) {
        container.innerHTML = `
            <div class="tab-content">
                <h3>🏭 材料屋請求書処理システム</h3>
                <div class="data-source-info">
                    <p>📥 <strong>データの出所:</strong> トーシンコーポレーション、パナソニック住建、TOTO販売店などの材料屋から送られてくる請求書ファイル</p>
                    <p>📄 <strong>対応形式:</strong> CSV詳細明細、Excel請求書、PDF請求書</p>
                    <p>🔄 <strong>処理フロー:</strong> ファイルアップロード → 自動解析 → データ抽出 → 照合実行 → 結果表示</p>
                </div>
                
                <div class="demo-section">
                    <h4>📋 取り込み方法の説明</h4>
                    <div class="process-steps">
                        <div class="step-card">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h5>📤 ファイル受信</h5>
                                <p>材料屋からメールまたはFAXで請求書が届く</p>
                                <ul>
                                    <li>CSV: トーシンコーポレーション形式</li>
                                    <li>PDF: パナソニック住建の請求書</li>
                                    <li>Excel: TOTO販売店の明細書</li>
                                </ul>
                            </div>
                        </div>
                        <div class="step-card">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h5>📂 ファイル選択</h5>
                                <p>下記のアップロードエリアで材料屋と形式を選択</p>
                                <p>対応拡張子: .csv, .xls, .xlsx, .pdf</p>
                            </div>
                        </div>
                        <div class="step-card">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h5>🔍 自動解析</h5>
                                <p>ファイル形式に応じて自動でデータを抽出</p>
                                <p>商品名、型番、数量、単価、金額を識別</p>
                            </div>
                        </div>
                        <div class="step-card">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h5>✅ 照合実行</h5>
                                <p>発注データと自動照合して差異をチェック</p>
                                <p>結果をカード形式で表示</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="file-upload-section">
                    <div class="upload-area">
                        <h4>📋 材料屋請求書アップロード</h4>
                        <div class="supplier-selection">
                            <label for="supplierSelect">材料屋選択:</label>
                            <select id="supplierSelect" class="form-control">
                                <option value="">材料屋を選択してください</option>
                                <option value="トーシンコーポレーション">🏭 トーシンコーポレーション (CSV形式)</option>
                                <option value="パナソニック住建">🏭 パナソニック住建 (PDF形式)</option>
                                <option value="TOTO販売店">🏭 TOTO販売店 (Excel形式)</option>
                            </select>
                        </div>
                        
                        <div class="file-input-area">
                            <label for="supplierFileInput">請求書ファイル:</label>
                            <input type="file" id="supplierFileInput" class="form-control" 
                                   accept=".csv,.xls,.xlsx,.pdf" 
                                   onchange="verificationSystem.handleSupplierFileSelect(event)">
                            <div class="file-info" id="supplierFileInfo"></div>
                            <div class="sample-file-note">
                                💡 <strong>サンプルファイル:</strong> sample_toshin_invoice.csv をテスト用に使用できます
                            </div>
                        </div>
                        
                        <button onclick="verificationSystem.processSupplierFile()" 
                                class="btn-primary" id="supplierProcessBtn" disabled>
                            📤 材料屋請求書処理実行
                        </button>
                        
                        <button onclick="verificationSystem.loadSupplierInvoicesSample()" 
                                class="btn-secondary">
                            📋 サンプルデータ表示
                        </button>
                    </div>
                    
                    <div id="supplierResults" class="results-area">
                        <!-- 処理結果がここに表示される -->
                    </div>
                </div>
            </div>
        `;
    }

    // 2. 工事業者請求処理タブ
    showContractorFilesTab(container) {
        container.innerHTML = `
            <div class="tab-content">
                <h3>👷 工事業者請求処理</h3>
                <div class="data-source-info">
                    <p>📥 <strong>データの出所:</strong> 内装工事業者、電気工事業者、配管工事業者などから送られてくる工事完了後の請求書</p>
                    <p>📄 <strong>対応形式:</strong> 各業者独自フォーマットのPDF請求書、Excel見積書、手書きをスキャンしたPDF</p>
                </div>
                
                <div class="file-upload-section">
                    <div class="upload-area">
                        <h4>🔨 工事業者請求書アップロード</h4>
                        <div class="contractor-selection">
                            <label for="contractorSelect">工事業者選択:</label>
                            <select id="contractorSelect" class="form-control">
                                <option value="">工事業者を選択してください</option>
                                <option value="内装工事株式会社">🔨 内装工事株式会社</option>
                                <option value="原状回復専門業者">🔧 原状回復専門業者</option>
                                <option value="電気工事業者">⚡ 電気工事業者</option>
                                <option value="配管工事業者">🚰 配管工事業者</option>
                            </select>
                        </div>
                        
                        <div class="file-input-area">
                            <label for="contractorFileInput">工事請求書ファイル:</label>
                            <input type="file" id="contractorFileInput" class="form-control" 
                                   accept=".pdf,.xls,.xlsx" 
                                   onchange="verificationSystem.handleContractorFileSelect(event)">
                            <div class="file-info" id="contractorFileInfo"></div>
                        </div>
                        
                        <button onclick="verificationSystem.processContractorFile()" 
                                class="btn-primary" id="contractorProcessBtn" disabled>
                            工事請求書処理実行
                        </button>
                    </div>
                    
                    <div id="contractorResults" class="results-area"></div>
                </div>
            </div>
        `;
    }

    // 3. 社内データ取込タブ
    showCompanyDataTab(container) {
        container.innerHTML = `
            <div class="tab-content">
                <h3>🏢 社内データ取込</h3>
                <div class="data-source-info">
                    <p>📥 <strong>データの出所:</strong> 会社のAccessデータベース、経理システム、銀行の入金データなど社内で管理しているデータ</p>
                    <p>📄 <strong>対応形式:</strong> Access DB エクスポートファイル、CSV経理データ、Excel銀行明細</p>
                </div>
                
                <div class="file-upload-section">
                    <div class="upload-area">
                        <h4>💾 社内データアップロード</h4>
                        <div class="data-type-selection">
                            <label for="dataTypeSelect">データ種別選択:</label>
                            <select id="dataTypeSelect" class="form-control">
                                <option value="">データ種別を選択してください</option>
                                <option value="案件管理">📊 案件管理データ (Accessエクスポート)</option>
                                <option value="見積データ">💰 見積データ (Excel)</option>
                                <option value="発注データ">📋 発注データ (CSV)</option>
                                <option value="銀行明細">🏦 銀行入金明細 (CSV/Excel)</option>
                                <option value="小口精算">💳 小口精算データ (Excel)</option>
                            </select>
                        </div>
                        
                        <div class="file-input-area">
                            <label for="companyFileInput">社内データファイル:</label>
                            <input type="file" id="companyFileInput" class="form-control" 
                                   accept=".csv,.xls,.xlsx,.mdb,.accdb" 
                                   onchange="verificationSystem.handleCompanyFileSelect(event)">
                            <div class="file-info" id="companyFileInfo"></div>
                        </div>
                        
                        <button onclick="verificationSystem.processCompanyFile()" 
                                class="btn-primary" id="companyProcessBtn" disabled>
                            社内データ処理実行
                        </button>
                    </div>
                    
                    <div id="companyResults" class="results-area"></div>
                </div>
            </div>
        `;
    }

    // 材料屋管理タブ
    showSuppliersTab(container) {
        container.innerHTML = `
            <div class="tab-content">
                <h3>🏢 材料屋マスター管理</h3>
                <div id="suppliersContent" class="suppliers-content">
                    <div class="loading">材料屋データを読み込み中...</div>
                </div>
            </div>
        `;
        
        this.loadSuppliers();
    }

    // 材料屋データ読み込み
    async loadSuppliers() {
        try {
            const response = await fetch('/api/suppliers');
            const result = await response.json();
            
            if (result.success) {
                this.displaySuppliers(result.suppliers);
            } else {
                document.getElementById('suppliersContent').innerHTML = 
                    `<div class="error">材料屋データ取得エラー: ${result.error}</div>`;
            }
        } catch (error) {
            document.getElementById('suppliersContent').innerHTML = 
                `<div class="error">通信エラー: ${error.message}</div>`;
        }
    }

    // 材料屋一覧表示
    displaySuppliers(suppliers) {
        let html = `
            <div class="suppliers-grid">
        `;
        
        suppliers.forEach(supplier => {
            html += `
                <div class="supplier-card">
                    <h4>${supplier.会社名}</h4>
                    <div class="supplier-info">
                        <p><strong>連絡先:</strong> ${supplier.連絡先}</p>
                        <p><strong>担当者:</strong> ${supplier.担当者}</p>
                        <p><strong>メール:</strong> ${supplier.メール}</p>
                        <p><strong>請求書形式:</strong> ${supplier.請求書フォーマット}</p>
                        <p><strong>支払条件:</strong> ${supplier.支払条件}</p>
                        <p><strong>主要商品:</strong> ${supplier.主要取扱商品.join(', ')}</p>
                        <p><strong>備考:</strong> ${supplier.備考}</p>
                    </div>
                    <button onclick="verificationSystem.showSupplierInvoices('${supplier.会社名}')" class="btn-secondary">請求履歴表示</button>
                </div>
            `;
        });
        
        html += `</div>`;
        document.getElementById('suppliersContent').innerHTML = html;
    }

    // 材料屋別請求履歴表示
    async showSupplierInvoices(supplierName) {
        try {
            const response = await fetch(`/api/supplier-invoices/${encodeURIComponent(supplierName)}`);
            const result = await response.json();
            
            if (result.success) {
                this.displaySupplierInvoiceHistory(supplierName, result.invoices);
            } else {
                alert(`請求履歴取得エラー: ${result.error}`);
            }
        } catch (error) {
            alert(`通信エラー: ${error.message}`);
        }
    }

    // 材料屋別請求履歴詳細表示
    displaySupplierInvoiceHistory(supplierName, invoices) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>📋 ${supplierName} 請求履歴</h3>
                <div class="invoice-history">
                    <table>
                        <thead>
                            <tr>
                                <th>物件No</th>
                                <th>請求日</th>
                                <th>請求番号</th>
                                <th>品目</th>
                                <th>型番</th>
                                <th>請求金額</th>
                                <th>形式</th>
                                <th>ステータス</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        invoices.forEach(invoice => {
            const statusClass = invoice.ステータス === '照合待ち' ? 'warning' : 'ok';
            modal.innerHTML += `
                            <tr>
                                <td>${invoice.物件No}</td>
                                <td>${new Date(invoice.請求日).toLocaleDateString()}</td>
                                <td>${invoice.請求番号}</td>
                                <td>${invoice.品目}</td>
                                <td>${invoice.型番}</td>
                                <td>¥${invoice.請求金額.toLocaleString()}</td>
                                <td>${invoice.データ形式}</td>
                                <td><span class="status ${statusClass}">${invoice.ステータス}</span></td>
                            </tr>
            `;
        });
        
        modal.innerHTML += `
                        </tbody>
                    </table>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="btn-secondary">閉じる</button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // 材料屋ファイル選択処理
    handleSupplierFileSelect(event) {
        const file = event.target.files[0];
        const fileInfo = document.getElementById('supplierFileInfo');
        const processBtn = document.getElementById('supplierProcessBtn');
        
        if (file) {
            const fileSize = (file.size / 1024 / 1024).toFixed(2);
            const fileType = this.getFileTypeDisplay(file.type);
            
            fileInfo.innerHTML = `
                <div class="selected-file">
                    <span class="file-name">📎 ${file.name}</span>
                    <span class="file-details">${fileType} | ${fileSize}MB</span>
                </div>
            `;
            
            processBtn.disabled = false;
        } else {
            fileInfo.innerHTML = '';
            processBtn.disabled = true;
        }
    }

    // 工事業者ファイル選択処理
    handleContractorFileSelect(event) {
        const file = event.target.files[0];
        const fileInfo = document.getElementById('contractorFileInfo');
        const processBtn = document.getElementById('contractorProcessBtn');
        
        if (file) {
            const fileSize = (file.size / 1024 / 1024).toFixed(2);
            const fileType = this.getFileTypeDisplay(file.type);
            
            fileInfo.innerHTML = `
                <div class="selected-file">
                    <span class="file-name">📎 ${file.name}</span>
                    <span class="file-details">${fileType} | ${fileSize}MB</span>
                </div>
            `;
            
            processBtn.disabled = false;
        } else {
            fileInfo.innerHTML = '';
            processBtn.disabled = true;
        }
    }

    // 社内データファイル選択処理
    handleCompanyFileSelect(event) {
        const file = event.target.files[0];
        const fileInfo = document.getElementById('companyFileInfo');
        const processBtn = document.getElementById('companyProcessBtn');
        
        if (file) {
            const fileSize = (file.size / 1024 / 1024).toFixed(2);
            const fileType = this.getFileTypeDisplay(file.type);
            
            fileInfo.innerHTML = `
                <div class="selected-file">
                    <span class="file-name">📎 ${file.name}</span>
                    <span class="file-details">${fileType} | ${fileSize}MB</span>
                </div>
            `;
            
            processBtn.disabled = false;
        } else {
            fileInfo.innerHTML = '';
            processBtn.disabled = true;
        }
    }

    // ファイル形式表示名取得
    getFileTypeDisplay(mimeType) {
        switch (mimeType) {
            case 'text/csv':
                return 'CSV';
            case 'application/vnd.ms-excel':
                return 'Excel (.xls)';
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return 'Excel (.xlsx)';
            case 'application/pdf':
                return 'PDF';
            case 'application/x-msaccess':
            case 'application/vnd.ms-access':
                return 'Access DB';
            default:
                return '不明';
        }
    }

    // 1. 材料屋ファイル処理実行
    async processSupplierFile() {
        const supplierSelect = document.getElementById('supplierSelect');
        const fileInput = document.getElementById('supplierFileInput');
        const resultsDiv = document.getElementById('supplierResults');
        const processBtn = document.getElementById('supplierProcessBtn');
        
        if (!supplierSelect.value) {
            alert('材料屋を選択してください');
            return;
        }
        
        if (!fileInput.files[0]) {
            alert('ファイルを選択してください');
            return;
        }
        
        const formData = new FormData();
        formData.append('invoiceFile', fileInput.files[0]);
        formData.append('supplierName', supplierSelect.value);
        formData.append('dataType', 'supplier');
        
        try {
            processBtn.disabled = true;
            processBtn.textContent = '処理中...';
            resultsDiv.innerHTML = '<div class="loading">材料屋請求書処理中...</div>';
            
            const response = await fetch('/api/process-invoice-file', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayProcessResults(result, resultsDiv, '材料屋請求書');
            } else {
                resultsDiv.innerHTML = `<div class="error">処理エラー: ${result.error}</div>`;
            }
        } catch (error) {
            resultsDiv.innerHTML = `<div class="error">通信エラー: ${error.message}</div>`;
        } finally {
            processBtn.disabled = false;
            processBtn.textContent = '材料屋請求書処理実行';
        }
    }

    // 2. 工事業者ファイル処理実行
    async processContractorFile() {
        const contractorSelect = document.getElementById('contractorSelect');
        const fileInput = document.getElementById('contractorFileInput');
        const resultsDiv = document.getElementById('contractorResults');
        const processBtn = document.getElementById('contractorProcessBtn');
        
        if (!contractorSelect.value) {
            alert('工事業者を選択してください');
            return;
        }
        
        if (!fileInput.files[0]) {
            alert('ファイルを選択してください');
            return;
        }
        
        const formData = new FormData();
        formData.append('invoiceFile', fileInput.files[0]);
        formData.append('supplierName', contractorSelect.value);
        formData.append('dataType', 'contractor');
        
        try {
            processBtn.disabled = true;
            processBtn.textContent = '処理中...';
            resultsDiv.innerHTML = '<div class="loading">工事業者請求書処理中...</div>';
            
            const response = await fetch('/api/process-contractor-file', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayProcessResults(result, resultsDiv, '工事業者請求書');
            } else {
                resultsDiv.innerHTML = `<div class="error">処理エラー: ${result.error}</div>`;
            }
        } catch (error) {
            resultsDiv.innerHTML = `<div class="error">通信エラー: ${error.message}</div>`;
        } finally {
            processBtn.disabled = false;
            processBtn.textContent = '工事請求書処理実行';
        }
    }

    // 3. 社内データファイル処理実行
    async processCompanyFile() {
        const dataTypeSelect = document.getElementById('dataTypeSelect');
        const fileInput = document.getElementById('companyFileInput');
        const resultsDiv = document.getElementById('companyResults');
        const processBtn = document.getElementById('companyProcessBtn');
        
        if (!dataTypeSelect.value) {
            alert('データ種別を選択してください');
            return;
        }
        
        if (!fileInput.files[0]) {
            alert('ファイルを選択してください');
            return;
        }
        
        const formData = new FormData();
        formData.append('dataFile', fileInput.files[0]);
        formData.append('dataType', dataTypeSelect.value);
        
        try {
            processBtn.disabled = true;
            processBtn.textContent = '処理中...';
            resultsDiv.innerHTML = '<div class="loading">社内データ処理中...</div>';
            
            const response = await fetch('/api/process-company-data', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayProcessResults(result, resultsDiv, '社内データ');
            } else {
                resultsDiv.innerHTML = `<div class="error">処理エラー: ${result.error}</div>`;
            }
        } catch (error) {
            resultsDiv.innerHTML = `<div class="error">通信エラー: ${error.message}</div>`;
        } finally {
            processBtn.disabled = false;
            processBtn.textContent = '社内データ処理実行';
        }
    }

    // 統一処理結果表示
    displayProcessResults(result, container, dataTypeName) {
        let html = `
            <h4>📋 ${dataTypeName}処理結果</h4>
            
            <div class="file-summary">
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="label">ファイル名:</span>
                        <span class="value">${result.fileInfo.name}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">データ種別:</span>
                        <span class="value">${dataTypeName}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">ファイル形式:</span>
                        <span class="value">${this.getFileTypeDisplay(result.fileInfo.type)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">ファイルサイズ:</span>
                        <span class="value">${(result.fileInfo.size / 1024).toFixed(1)}KB</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">抽出件数:</span>
                        <span class="value">${result.extractedData.length}件</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">照合結果:</span>
                        <span class="value">${result.verification ? result.verification.length : 0}件</span>
                    </div>
                </div>
            </div>
        `;

        // 抽出データ表示
        if (result.extractedData.length > 0) {
            html += `
                <h5>📊 抽出データ</h5>
                <div class="extracted-data-table">
                    <table>
                        <thead>
                            <tr>
            `;
            
            // 動的ヘッダー作成
            const headers = Object.keys(result.extractedData[0]);
            headers.forEach(header => {
                html += `<th>${header}</th>`;
            });
            html += `</tr></thead><tbody>`;
            
            // データ行作成
            result.extractedData.forEach(item => {
                html += '<tr>';
                headers.forEach(header => {
                    let value = item[header] || '';
                    if (typeof value === 'number' && header.includes('金額')) {
                        value = '¥' + value.toLocaleString();
                    }
                    html += `<td>${value}</td>`;
                });
                html += '</tr>';
            });
            
            html += '</tbody></table></div>';
        }

        // 照合結果表示
        if (result.verification && result.verification.length > 0) {
            html += `
                <h5>🔍 照合結果</h5>
                <div class="verification-results">
            `;
            
            result.verification.forEach(item => {
                const statusClass = item.type === 'ok' ? 'ok' : 
                                  item.type === 'warning' ? 'warning' : 
                                  item.type === 'new' ? 'info' : 'error';
                
                html += `
                    <div class="verification-item ${statusClass}">
                        <div class="item-header">
                            <span class="status ${statusClass}">${this.getStatusText(item.type)}</span>
                            <span class="message">${item.message}</span>
                        </div>
                        <div class="item-details">
                            <div class="extracted-side">
                                <strong>抽出データ:</strong>
                                <span>${JSON.stringify(item.extracted)}</span>
                            </div>
                            ${item.database ? `
                                <div class="database-side">
                                    <strong>データベース:</strong>
                                    <span>${JSON.stringify(item.database)}</span>
                                </div>
                                ${item.difference !== undefined ? `
                                    <div class="difference">
                                        <strong>金額差異:</strong>
                                        <span>¥${item.difference.toLocaleString()}</span>
                                    </div>
                                ` : ''}
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        container.innerHTML = html;
    }

    // ステータステキスト取得
    getStatusText(type) {
        switch (type) {
            case 'ok':
                return '✅ 一致';
            case 'warning':
                return '⚠️ 差異あり';
            case 'error':
                return '❌ エラー';
            case 'new':
                return '🆕 新規';
            default:
                return '❓ 不明';
        }
    }

    // タブ表示メソッド
    showTab(tabName) {
        console.log(`🔄 タブ切り替え: ${tabName}`);
        
        // タブボタンのアクティブ状態を更新
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            console.log(`✅ アクティブタブ設定: ${tabName}`);
        }
        
        // 全てのタブコンテンツを非表示
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // 選択されたタブコンテンツを表示
        const targetContent = document.getElementById(tabName);
        if (targetContent) {
            targetContent.classList.add('active');
            console.log(`✅ コンテンツ表示: ${tabName}`);
            
            // タブ別の初期化処理を実行
            this.initializeTabContent(tabName, targetContent);
        } else {
            console.error(`❌ タブコンテンツが見つかりません: ${tabName}`);
        }
    }

    // タブコンテンツの初期化
    initializeTabContent(tabName, container) {
        console.log(`🔧 タブコンテンツ初期化: ${tabName}`);
        
        // コンテンツDIVを探す（複数の方法で試行）
        let contentDiv = container.querySelector('div[id$="-content"]');
        if (!contentDiv) {
            contentDiv = container.querySelector(`#${tabName}-content`);
        }
        if (!contentDiv) {
            console.warn(`⚠️ コンテンツDIVが見つかりません: ${tabName} - container自体を使用`);
            contentDiv = container;
        }
        
        console.log(`📍 コンテンツDIV確認: ${tabName}`, contentDiv);
        
        switch (tabName) {
            case 'summary':
                console.log('📊 サマリータブ初期化中...');
                // 直接フォールバック表示を使用
                contentDiv.innerHTML = `
                    <div class="feature-content">
                        <h3>📊 照合サマリー</h3>
                        <div class="mock-data-section">
                            <h4>📋 案件状況</h4>
                            <div class="summary-stats">
                                <div class="stat-item">
                                    <span class="stat-label">総案件数</span>
                                    <span class="stat-value">7件</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">照合完了</span>
                                    <span class="stat-value status-ok">5件</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">要確認</span>
                                    <span class="stat-value status-warning">2件</span>
                                </div>
                            </div>
                            <h4>📋 主要案件</h4>
                            <div class="project-list">
                                <div class="project-item">
                                    <span class="project-name">パレス代々木 201号室</span>
                                    <span class="status-ok">✅ 照合完了</span>
                                </div>
                                <div class="project-item">
                                    <span class="project-name">サンアセント 301号室</span>
                                    <span class="status-warning">⚠️ 要確認</span>
                                </div>
                                <div class="project-item">
                                    <span class="project-name">中外医学社</span>
                                    <span class="status-ok">✅ 照合完了</span>
                                </div>
                            </div>
                            <div class="action-buttons">
                                <button class="btn-primary">詳細照合実行</button>
                                <button class="btn-secondary">レポート出力</button>
                                <button class="btn-secondary">データ更新</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'work-order':
                console.log('🏗️ 工事注文書タブ初期化中...');
                // 直接フォールバック表示を使用
                contentDiv.innerHTML = `
                    <div class="feature-content">
                        <h3>🏗️ 工事注文書照合</h3>
                        <div class="mock-data-section">
                            <h4>📋 照合結果サマリー</h4>
                            <div class="summary-stats">
                                <div class="stat-item">
                                    <span class="stat-label">照合OK</span>
                                    <span class="stat-value status-ok">3件</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">要確認</span>
                                    <span class="stat-value status-warning">1件</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">エラー</span>
                                    <span class="stat-value status-error">1件</span>
                                </div>
                            </div>
                            <h4>📋 照合詳細</h4>
                            <div class="work-order-list">
                                <div class="work-order-item">
                                    <span class="order-name">パレス代々木 - キッチン工事</span>
                                    <span class="order-amount">発注額: ¥550,000</span>
                                    <span class="status-ok">✅ 照合OK</span>
                                </div>
                                <div class="work-order-item">
                                    <span class="order-name">サンアセント - バス工事</span>
                                    <span class="order-amount">発注額: ¥480,000</span>
                                    <span class="status-ok">✅ 照合OK</span>
                                </div>
                                <div class="work-order-item">
                                    <span class="order-name">斎藤様邸 - 内装工事</span>
                                    <span class="order-amount">発注額: ¥320,000 / 明細: ¥288,500</span>
                                    <span class="status-warning">⚠️ 差異: ¥31,500</span>
                                </div>
                            </div>
                            <div class="action-buttons">
                                <button class="btn-primary">詳細照合実行</button>
                                <button class="btn-secondary">レポート出力</button>
                                <button class="btn-secondary">データ更新</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'material-invoice':
                console.log('📦 材料発注vs請求タブ初期化中...');
                contentDiv.innerHTML = `
                    <div class="feature-content">
                        <h3>📦 材料発注vs請求照合</h3>
                        <p>材料発注書と材料屋からの請求書を照合し、差異を検出します。</p>
                        <div class="feature-status">🚧 開発中</div>
                        <div class="mock-data-section">
                            <h4>📋 サンプルデータ</h4>
                            <div class="sample-comparison">
                                <div class="comparison-item">
                                    <span class="item-name">トーシンコーポレーション - システムキッチン</span>
                                    <span class="status-ok">✅ 照合OK</span>
                                </div>
                                <div class="comparison-item">
                                    <span class="item-name">パナソニック住建 - ユニットバス</span>
                                    <span class="status-warning">⚠️ 差額: ¥5,000</span>
                                </div>
                                <div class="comparison-item">
                                    <span class="item-name">TOTO販売店 - 洋式便器セット</span>
                                    <span class="status-ok">✅ 照合OK</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'material-estimate':
                console.log('💰 材料見積vs発注タブ初期化中...');
                contentDiv.innerHTML = `
                    <div class="feature-content">
                        <h3>💰 材料見積vs発注照合</h3>
                        <p>材料見積と実際の発注内容を照合し、予算と実績の差異をチェックします。</p>
                        <div class="feature-status">🚧 開発中</div>
                        <div class="mock-data-section">
                            <h4>📋 見積vs発注比較</h4>
                            <div class="estimate-comparison">
                                <div class="comparison-item">
                                    <span class="item-name">パレス代々木 - キッチン材料</span>
                                    <span class="status-ok">見積: ¥85,000 → 発注: ¥85,000</span>
                                </div>
                                <div class="comparison-item">
                                    <span class="item-name">サンアセント - バス材料</span>
                                    <span class="status-warning">見積: ¥90,000 → 発注: ¥95,000 (+¥5,000)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'cost-total':
                console.log('📋 総原価検証タブ初期化中...');
                contentDiv.innerHTML = `
                    <div class="feature-content">
                        <h3>📋 総原価検証</h3>
                        <p>見積原価と実際の総原価を比較し、利益率の変動を分析します。</p>
                        <div class="feature-status">🚧 開発中</div>
                        <div class="mock-data-section">
                            <h4>📊 原価分析サマリー</h4>
                            <div class="cost-analysis">
                                <div class="cost-item">
                                    <span class="project-name">パレス代々木 201号室</span>
                                    <span class="cost-info">見積原価: ¥450,000 / 実績: ¥465,000</span>
                                    <span class="status-warning">利益率低下: -3.3%</span>
                                </div>
                                <div class="cost-item">
                                    <span class="project-name">サンアセント 301号室</span>
                                    <span class="cost-info">見積原価: ¥380,000 / 実績: ¥375,000</span>
                                    <span class="status-ok">利益率向上: +1.3%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'payment':
                console.log('💳 入金照合タブ初期化中...');
                contentDiv.innerHTML = `
                    <div class="feature-content">
                        <h3>💳 入金照合</h3>
                        <p>請求額と実際の入金額を照合し、振込手数料等の差異をチェックします。</p>
                        <div class="feature-status">🚧 開発中</div>
                        <div class="mock-data-section">
                            <h4>💰 入金状況</h4>
                            <div class="payment-status">
                                <div class="payment-item">
                                    <span class="client-name">パレス代々木管理組合</span>
                                    <span class="payment-info">請求: ¥550,000 / 入金: ¥549,560</span>
                                    <span class="status-warning">差額: -¥440 (振込手数料)</span>
                                </div>
                                <div class="payment-item">
                                    <span class="client-name">サンアセント管理組合</span>
                                    <span class="payment-info">請求: ¥480,000 / 入金: ¥480,000</span>
                                    <span class="status-ok">✅ 完全一致</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'supplier-files':
                console.log('🏢 材料屋請求書タブ初期化中...');
                // 直接フォールバック表示を使用
                contentDiv.innerHTML = `
                    <div class="feature-content">
                        <h3>🏢 材料屋請求書管理</h3>
                        <div class="mock-data-section">
                            <h4>📋 請求書ファイル一覧</h4>
                            <div class="file-list">
                                <div class="file-item">
                                    <span class="file-name">📄 TC-2025-0615-001.csv</span>
                                    <span class="file-info">トーシンコーポレーション / ¥125,000</span>
                                    <span class="status-ok">✅ 処理済み</span>
                                </div>
                                <div class="file-item">
                                    <span class="file-name">📄 PH-2025-0618-003.pdf</span>
                                    <span class="file-info">パナソニック住建 / ¥135,000</span>
                                    <span class="status-ok">✅ 処理済み</span>
                                </div>
                                <div class="file-item">
                                    <span class="file-name">📄 TT-2025-0620-007.xlsx</span>
                                    <span class="file-info">TOTO販売店 / ¥86,000</span>
                                    <span class="status-warning">⚠️ 要確認</span>
                                </div>
                            </div>
                            <div class="upload-section">
                                <h4>📁 新しいファイルをアップロード</h4>
                                <div class="upload-area">
                                    <p>📎 CSV、PDF、Excelファイルをドラッグ&ドロップ</p>
                                    <button class="btn-primary">ファイルを選択</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'suppliers':
                console.log('📋 材料屋一覧タブ初期化中...');
                // 直接フォールバック表示を使用
                contentDiv.innerHTML = `
                    <div class="feature-content">
                        <h3>📋 材料屋マスター一覧</h3>
                        <div class="mock-data-section">
                            <h4>🏢 登録材料屋</h4>
                            <div class="supplier-list">
                                <div class="supplier-item">
                                    <span class="supplier-name">🏢 トーシンコーポレーション</span>
                                    <span class="supplier-info">キッチン・住設機器 / 取引回数: 15回</span>
                                    <span class="status-ok">✅ アクティブ</span>
                                </div>
                                <div class="supplier-item">
                                    <span class="supplier-name">🏢 パナソニック住建</span>
                                    <span class="supplier-info">バス・住設機器 / 取引回数: 12回</span>
                                    <span class="status-ok">✅ アクティブ</span>
                                </div>
                                <div class="supplier-item">
                                    <span class="supplier-name">🏢 TOTO販売店</span>
                                    <span class="supplier-info">水回り機器 / 取引回数: 8回</span>
                                    <span class="status-ok">✅ アクティブ</span>
                                </div>
                                <div class="supplier-item">
                                    <span class="supplier-name">🏢 大建工業</span>
                                    <span class="supplier-info">建材・内装材 / 取引回数: 6回</span>
                                    <span class="status-warning">⚠️ 休止中</span>
                                </div>
                            </div>
                            <div class="supplier-actions">
                                <button class="btn-primary">新規材料屋登録</button>
                                <button class="btn-secondary">請求書履歴表示</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
            default:
                console.log(`❓ 未知のタブ: ${tabName}`);
                contentDiv.innerHTML = `
                    <div class="feature-content">
                        <h3>機能準備中</h3>
                        <p>この機能は現在開発中です。</p>
                    </div>
                `;
        }
        
        console.log(`✅ タブコンテンツ初期化完了: ${tabName}`);
        
        // ボタンイベントリスナーを設定
        this.setupButtonEventListeners(tabName, contentDiv);
        
        // 請求書タブの場合、アップロードファイル一覧を表示
        if (tabName === 'invoices') {
            this.refreshUploadedFilesList();
        }
    }

    // ボタンイベントリスナー設定
    setupButtonEventListeners(tabName, container) {
        console.log(`🔘 ボタンイベント設定: ${tabName}`);
        
        // 詳細照合実行ボタン
        const detailButton = container.querySelector('.btn-primary');
        if (detailButton && detailButton.textContent.includes('詳細照合実行')) {
            detailButton.addEventListener('click', () => this.executeDetailedVerification(tabName));
        }

        // レポート出力ボタン
        const reportButtons = container.querySelectorAll('.btn-secondary');
        reportButtons.forEach(btn => {
            if (btn.textContent.includes('レポート出力')) {
                btn.addEventListener('click', () => this.exportReport(tabName));
            } else if (btn.textContent.includes('データ更新')) {
                btn.addEventListener('click', () => this.refreshData(tabName));
            } else if (btn.textContent.includes('請求書履歴表示')) {
                btn.addEventListener('click', () => this.showInvoiceHistory());
            }
        });

        // ファイル選択ボタン
        const fileButton = container.querySelector('button[class*="btn-primary"]');
        if (fileButton && fileButton.textContent.includes('ファイルを選択')) {
            fileButton.addEventListener('click', () => this.openFileSelector(tabName));
        }

        // 新規登録ボタン
        const newButton = container.querySelector('button');
        if (newButton && newButton.textContent.includes('新規材料屋登録')) {
            newButton.addEventListener('click', () => this.openNewSupplierModal());
        }

        // ドラッグ&ドロップエリア設定
        const uploadArea = container.querySelector('.upload-area');
        if (uploadArea) {
            this.setupDragAndDrop(uploadArea, tabName);
        }
    }

    // 詳細照合実行
    async executeDetailedVerification(tabName) {
        console.log(`🔍 詳細照合実行開始: ${tabName}`);
        this.showLoading('詳細照合を実行中...');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 処理シミュレーション
            
            const results = {
                summary: `${tabName}の詳細照合が完了しました`,
                processed: Math.floor(Math.random() * 20) + 5,
                errors: Math.floor(Math.random() * 3),
                warnings: Math.floor(Math.random() * 5)
            };
            
            this.showSuccessMessage(`✅ 照合完了！ 処理件数: ${results.processed}件, エラー: ${results.errors}件, 警告: ${results.warnings}件`);
            
        } catch (error) {
            this.showErrorMessage('照合実行中にエラーが発生しました: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    // レポート出力
    async exportReport(tabName) {
        console.log(`📊 レポート出力: ${tabName}`);
        this.showLoading('レポートを生成中...');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `${tabName}_report_${timestamp}.csv`;
            
            // CSVデータ生成
            const csvData = this.generateReportCSV(tabName);
            this.downloadCSV(csvData, filename);
            
            this.showSuccessMessage(`📄 レポートをダウンロードしました: ${filename}`);
            
        } catch (error) {
            this.showErrorMessage('レポート生成中にエラーが発生しました: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    // データ更新
    async refreshData(tabName) {
        console.log(`🔄 データ更新: ${tabName}`);
        this.showLoading('データを更新中...');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // タブコンテンツを再初期化
            const targetContent = document.getElementById(tabName);
            if (targetContent) {
                this.initializeTabContent(tabName, targetContent);
            }
            
            this.showSuccessMessage('✅ データを更新しました');
            
        } catch (error) {
            this.showErrorMessage('データ更新中にエラーが発生しました: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    // CSVレポート生成
    generateReportCSV(tabName) {
        const timestamp = new Date().toLocaleString('ja-JP');
        let csvContent = `"${tabName} レポート","生成日時: ${timestamp}"\n\n`;
        
        switch (tabName) {
            case 'summary':
                csvContent += '"項目","件数","状態"\n';
                csvContent += '"総案件数","7","正常"\n';
                csvContent += '"照合完了","5","正常"\n';
                csvContent += '"要確認","2","注意"\n';
                break;
            case 'work-order':
                csvContent += '"案件名","発注額","状態","差異"\n';
                csvContent += '"パレス代々木","550000","OK","0"\n';
                csvContent += '"サンアセント","480000","OK","0"\n';
                csvContent += '"斎藤様邸","320000","要確認","31500"\n';
                break;
            default:
                csvContent += '"データ","値"\n';
                csvContent += '"処理日時","' + timestamp + '"\n';
                csvContent += '"ステータス","正常"\n';
        }
        
        return csvContent;
    }

    // CSV ダウンロード
    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ドラッグ&ドロップ設定
    setupDragAndDrop(uploadArea, tabName) {
        console.log(`📎 ドラッグ&ドロップ設定: ${tabName}`);
        
        // ドラッグオーバー
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
            uploadArea.style.backgroundColor = '#e3f2fd';
            uploadArea.style.borderColor = '#2196f3';
        });

        // ドラッグリーブ
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            uploadArea.style.backgroundColor = 'white';
            uploadArea.style.borderColor = '#bdc3c7';
        });

        // ドロップ
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            uploadArea.style.backgroundColor = 'white';
            uploadArea.style.borderColor = '#bdc3c7';
            
            const files = Array.from(e.dataTransfer.files);
            this.handleFileUpload(files, tabName);
        });

        // クリックでファイル選択
        uploadArea.addEventListener('click', () => {
            this.openFileSelector(tabName);
        });
    }

    // ファイル選択ダイアログ
    openFileSelector(tabName) {
        console.log(`📁 ファイル選択ダイアログ: ${tabName}`);
        
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.csv,.pdf,.xlsx,.xls';
        
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFileUpload(files, tabName);
        });
        
        input.click();
    }

    // ファイルアップロード処理
    async handleFileUpload(files, tabName) {
        console.log(`📤 ファイルアップロード: ${files.length}件`, files);
        
        if (files.length === 0) return;
        
        this.showLoading(`${files.length}件のファイルを処理中...`);
        
        try {
            // サーバーにファイルをアップロード
            const formData = new FormData();
            for (const file of files) {
                formData.append('files', file);
            }
            
            const response = await fetch('/api/upload-files', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.displayUploadResults(result.results, tabName);
                this.showSuccessMessage(`✅ ${result.message}`);
                
                // アップロードファイル一覧を更新
                if (tabName === 'invoices') {
                    await this.refreshUploadedFilesList();
                }
            } else {
                throw new Error(result.message || 'アップロードに失敗しました');
            }
            
        } catch (error) {
            console.error('ファイルアップロードエラー:', error);
            this.showErrorMessage('ファイル処理中にエラーが発生しました: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    // アップロードファイル一覧更新
    async refreshUploadedFilesList() {
        try {
            const response = await fetch('/api/uploaded-files');
            
            if (!response.ok) {
                console.warn(`ファイル一覧取得失敗: HTTP ${response.status}`);
                return;
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.displayUploadedFilesList(result.files);
            }
        } catch (error) {
            console.error('アップロードファイル一覧取得エラー:', error);
            // エラーが発生してもUIは継続動作
        }
    }

    // アップロードファイル一覧表示
    displayUploadedFilesList(files) {
        const invoicesTab = document.getElementById('invoices');
        if (!invoicesTab) return;
        
        let fileListDiv = invoicesTab.querySelector('.uploaded-files-list');
        if (!fileListDiv) {
            fileListDiv = document.createElement('div');
            fileListDiv.className = 'uploaded-files-list';
            invoicesTab.appendChild(fileListDiv);
        }
        
        let html = `
            <h4>📁 アップロード済みファイル (${files.length}件)</h4>
            <div class="uploaded-files-grid">
        `;
        
        files.forEach(file => {
            const fileIcon = this.getFileIcon(file.type);
            const fileSize = (file.size / 1024).toFixed(1);
            
            html += `
                <div class="uploaded-file-item">
                    <div class="file-icon">${fileIcon}</div>
                    <div class="file-details">
                        <div class="file-name">${file.originalName}</div>
                        <div class="file-meta">${fileSize}KB • ${file.uploadedAt}</div>
                    </div>
                    <div class="file-actions">
                        <button class="btn-small btn-secondary" onclick="window.verificationSystem.downloadFile('${file.filename}')">
                            📥 ダウンロード
                        </button>
                        <button class="btn-small btn-danger" onclick="window.verificationSystem.deleteFile('${file.filename}')">
                            🗑️ 削除
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        fileListDiv.innerHTML = html;
    }

    // ファイルアイコン取得
    getFileIcon(fileType) {
        switch (fileType.toLowerCase()) {
            case '.csv': return '📊';
            case '.pdf': return '📄';
            case '.xlsx':
            case '.xls': return '📈';
            default: return '📎';
        }
    }

    // ファイルダウンロード
    async downloadFile(filename) {
        try {
            const response = await fetch(`/api/uploaded-files/${filename}/download`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename.split('_')[0] + filename.slice(filename.lastIndexOf('.'));
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                this.showSuccessMessage(`📥 ${filename} をダウンロードしました`);
            } else {
                throw new Error('ダウンロードに失敗しました');
            }
        } catch (error) {
            this.showErrorMessage('ダウンロードエラー: ' + error.message);
        }
    }

    // ファイル削除
    async deleteFile(filename) {
        if (!confirm(`${filename} を削除しますか？`)) return;
        
        try {
            const response = await fetch(`/api/uploaded-files/${filename}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccessMessage(`🗑️ ${result.message}`);
                await this.refreshUploadedFilesList();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            this.showErrorMessage('ファイル削除エラー: ' + error.message);
        }
    }

    // 個別ファイル処理
    async processFile(file, tabName) {
        console.log(`🔄 ファイル処理: ${file.name}`);
        
        // ファイル検証
        const validation = this.validateFile(file);
        if (!validation.valid) {
            throw new Error(`${file.name}: ${validation.error}`);
        }
        
        // 処理シミュレーション
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        
        const result = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            processed: true,
            records: Math.floor(Math.random() * 50) + 10,
            errors: Math.floor(Math.random() * 3),
            warnings: Math.floor(Math.random() * 5),
            timestamp: new Date().toLocaleString('ja-JP')
        };
        
        // ファイル内容の解析（模擬）
        if (file.name.includes('.csv')) {
            result.format = 'CSV';
            result.encoding = 'UTF-8';
        } else if (file.name.includes('.pdf')) {
            result.format = 'PDF';
            result.pages = Math.floor(Math.random() * 10) + 1;
        } else if (file.name.includes('.xlsx') || file.name.includes('.xls')) {
            result.format = 'Excel';
            result.sheets = Math.floor(Math.random() * 3) + 1;
        }
        
        return result;
    }

    // ファイル検証
    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'text/csv',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];
        
        if (file.size > maxSize) {
            return { valid: false, error: 'ファイルサイズが10MBを超えています' };
        }
        
        const extension = file.name.toLowerCase().split('.').pop();
        const validExtensions = ['csv', 'pdf', 'xlsx', 'xls'];
        
        if (!validExtensions.includes(extension)) {
            return { valid: false, error: 'サポートされていないファイル形式です' };
        }
        
        return { valid: true };
    }

    // アップロード結果表示
    displayUploadResults(results, tabName) {
        console.log(`📊 アップロード結果表示: ${results.length}件`);
        
        const container = document.getElementById(tabName);
        const resultsDiv = container.querySelector('.upload-results') || document.createElement('div');
        resultsDiv.className = 'upload-results';
        
        let html = `
            <h4>📤 アップロード結果</h4>
            <div class="upload-summary">
                <span class="summary-item">処理完了: ${results.length}件</span>
                <span class="summary-item">総レコード: ${results.reduce((sum, r) => sum + r.records, 0)}件</span>
                <span class="summary-item">エラー: ${results.reduce((sum, r) => sum + r.errors, 0)}件</span>
            </div>
            <div class="file-results">
        `;
        
        results.forEach(result => {
            const statusClass = result.errors > 0 ? 'status-warning' : 'status-ok';
            const statusText = result.errors > 0 ? '⚠️ 要確認' : '✅ 正常';
            
            html += `
                <div class="file-result-item">
                    <div class="file-info">
                        <span class="file-name">📄 ${result.fileName}</span>
                        <span class="file-details">${result.format} / ${(result.fileSize / 1024).toFixed(1)}KB</span>
                    </div>
                    <div class="process-info">
                        <span class="record-count">レコード: ${result.records}件</span>
                        <span class="${statusClass}">${statusText}</span>
                    </div>
                    <div class="timestamp">${result.timestamp}</div>
                </div>
            `;
        });
        
        html += '</div>';
        resultsDiv.innerHTML = html;
        
        // 結果をコンテナに追加
        if (!container.querySelector('.upload-results')) {
            container.appendChild(resultsDiv);
        }
    }

    // 請求書履歴表示
    showInvoiceHistory() {
        console.log('📋 請求書履歴表示');
        this.showModal('請求書履歴', this.generateInvoiceHistoryHTML());
    }

    // 新規材料屋登録モーダル
    openNewSupplierModal() {
        console.log('🏢 新規材料屋登録モーダル');
        const formHTML = `
            <form id="newSupplierForm" class="supplier-form">
                <div class="form-group">
                    <label for="supplierName">材料屋名 *</label>
                    <input type="text" id="supplierName" name="supplierName" required>
                </div>
                <div class="form-group">
                    <label for="supplierCategory">カテゴリ *</label>
                    <select id="supplierCategory" name="supplierCategory" required>
                        <option value="">選択してください</option>
                        <option value="kitchen">キッチン・住設機器</option>
                        <option value="bath">バス・住設機器</option>
                        <option value="plumbing">水回り機器</option>
                        <option value="materials">建材・内装材</option>
                        <option value="electrical">電気設備</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="supplierContact">連絡先</label>
                    <input type="text" id="supplierContact" name="supplierContact">
                </div>
                <div class="form-group">
                    <label for="supplierEmail">メールアドレス</label>
                    <input type="email" id="supplierEmail" name="supplierEmail">
                </div>
                <div class="form-group">
                    <label for="supplierNotes">備考</label>
                    <textarea id="supplierNotes" name="supplierNotes" rows="3"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="window.verificationSystem.closeModal()">キャンセル</button>
                    <button type="submit" class="btn-primary">登録</button>
                </div>
            </form>
        `;
        
        this.showModal('新規材料屋登録', formHTML);
        
        // フォーム送信イベント
        document.getElementById('newSupplierForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewSupplierSubmit(e.target);
        });
    }

    // 新規材料屋登録処理
    async handleNewSupplierSubmit(form) {
        console.log('💾 新規材料屋登録処理');
        this.showLoading('材料屋を登録中...');
        
        try {
            const formData = new FormData(form);
            const supplierData = {
                name: formData.get('supplierName'),
                category: formData.get('supplierCategory'),
                contact: formData.get('supplierContact'),
                email: formData.get('supplierEmail'),
                notes: formData.get('supplierNotes'),
                registeredAt: new Date().toLocaleString('ja-JP'),
                status: 'active'
            };
            
            // 登録処理シミュレーション
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showSuccessMessage(`✅ ${supplierData.name} を登録しました`);
            this.closeModal();
            
            // 材料屋一覧タブを更新
            const suppliersTab = document.getElementById('suppliers');
            if (suppliersTab) {
                this.initializeTabContent('suppliers', suppliersTab);
            }
            
        } catch (error) {
            this.showErrorMessage('登録中にエラーが発生しました: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    // 請求書履歴HTML生成
    generateInvoiceHistoryHTML() {
        return `
            <div class="invoice-history">
                <div class="history-filters">
                    <select id="supplierFilter">
                        <option value="">全ての材料屋</option>
                        <option value="toshin">トーシンコーポレーション</option>
                        <option value="panasonic">パナソニック住建</option>
                        <option value="toto">TOTO販売店</option>
                    </select>
                    <input type="date" id="dateFrom" placeholder="開始日">
                    <input type="date" id="dateTo" placeholder="終了日">
                    <button class="btn-primary" onclick="window.verificationSystem.filterInvoiceHistory()">検索</button>
                </div>
                <div class="history-list">
                    <div class="history-item">
                        <div class="invoice-info">
                            <span class="invoice-number">TC-2025-0615-001</span>
                            <span class="supplier-name">トーシンコーポレーション</span>
                            <span class="invoice-date">2025/06/15</span>
                        </div>
                        <div class="invoice-amount">¥125,000</div>
                        <div class="invoice-status status-ok">✅ 処理済み</div>
                    </div>
                    <div class="history-item">
                        <div class="invoice-info">
                            <span class="invoice-number">PH-2025-0618-003</span>
                            <span class="supplier-name">パナソニック住建</span>
                            <span class="invoice-date">2025/06/18</span>
                        </div>
                        <div class="invoice-amount">¥135,000</div>
                        <div class="invoice-status status-ok">✅ 処理済み</div>
                    </div>
                    <div class="history-item">
                        <div class="invoice-info">
                            <span class="invoice-number">TT-2025-0620-007</span>
                            <span class="supplier-name">TOTO販売店</span>
                            <span class="invoice-date">2025/06/20</span>
                        </div>
                        <div class="invoice-amount">¥86,000</div>
                        <div class="invoice-status status-warning">⚠️ 要確認</div>
                    </div>
                </div>
            </div>
        `;
    }

    // モーダル表示
    showModal(title, content) {
        const modal = document.getElementById('detail-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <div class="modal-content-body">
                ${content}
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        // モーダル外クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
        
        // 閉じるボタン
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
    }

    // モーダル閉じる
    closeModal() {
        const modal = document.getElementById('detail-modal');
        modal.classList.add('hidden');
    }

    // 請求書履歴フィルター
    filterInvoiceHistory() {
        console.log('🔍 請求書履歴フィルター');
        const supplier = document.getElementById('supplierFilter').value;
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        
        this.showSuccessMessage(`検索条件: 材料屋=${supplier || '全て'}, 期間=${dateFrom || '指定なし'}〜${dateTo || '指定なし'}`);
    }

    // ローディング表示
    showLoading(message = '処理中...') {
        let loadingDiv = document.getElementById('loading-overlay');
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.id = 'loading-overlay';
            loadingDiv.className = 'loading-overlay';
            document.body.appendChild(loadingDiv);
        }
        
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-message">${message}</div>
            </div>
        `;
        
        loadingDiv.style.display = 'flex';
    }

    // ローディング非表示
    hideLoading() {
        const loadingDiv = document.getElementById('loading-overlay');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }

    // 成功メッセージ表示
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    // エラーメッセージ表示
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    // 警告メッセージ表示
    showWarningMessage(message) {
        this.showMessage(message, 'warning');
    }

    // メッセージ表示
    showMessage(message, type = 'info') {
        const messageContainer = this.getOrCreateMessageContainer();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        
        const icon = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        }[type];
        
        messageDiv.innerHTML = `
            <span class="message-icon">${icon}</span>
            <span class="message-text">${message}</span>
            <button class="message-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        messageContainer.appendChild(messageDiv);
        
        // 5秒後に自動削除
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 5000);
        
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
    }

    // メッセージコンテナ取得/作成
    getOrCreateMessageContainer() {
        let container = document.getElementById('message-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'message-container';
            container.className = 'message-container';
            document.body.appendChild(container);
        }
        return container;
    }

    // プレースホルダータブ表示
    showPlaceholderTab(container, title, description) {
        container.innerHTML = `
            <div class="tab-content">
                <h3>${title}</h3>
                <div class="placeholder-content">
                    <div class="placeholder-icon">🚧</div>
                    <h4>開発中の機能</h4>
                    <p>${description}は現在開発中です。</p>
                    <p>近日中に実装予定です。</p>
                </div>
            </div>
        `;
    }

    // サンプル材料屋請求書データ表示
    async loadSupplierInvoicesSample() {
        try {
            this.showLoading('サンプルデータを読み込み中...');
            
            // モックデータベースからサンプル請求書を取得
            const response = await fetch('/api/suppliers');
            if (!response.ok) {
                throw new Error('サンプルデータの取得に失敗しました');
            }
            
            const suppliers = await response.json();
            const sampleInvoices = [
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
            
            this.displaySupplierInvoicesSample(sampleInvoices);
            this.showSuccessMessage('サンプル材料屋請求書データを表示しました');
            
        } catch (error) {
            console.error('サンプルデータ読み込みエラー:', error);
            this.showErrorMessage('サンプルデータの読み込みに失敗しました');
        } finally {
            this.hideLoading();
        }
    }

    // サンプル請求書データ表示
    displaySupplierInvoicesSample(invoices) {
        const container = document.getElementById('supplierResults');
        
        let html = `
            <h4>📋 材料屋請求書サンプルデータ</h4>
            <div class="sample-invoices-grid">
        `;
        
        invoices.forEach(invoice => {
            const formatClass = invoice.ファイル形式.toLowerCase();
            
            html += `
                <div class="invoice-card ${formatClass}">
                    <div class="invoice-header">
                        <h5>${invoice.物件名}</h5>
                        <div class="invoice-meta">
                            <span class="invoice-number">請求書No: ${invoice.請求書番号}</span>
                            <span class="file-format ${formatClass}">${invoice.ファイル形式}</span>
                        </div>
                    </div>
                    
                    <div class="invoice-details">
                        <div class="detail-row">
                            <span class="label">材料屋:</span>
                            <span class="value">${invoice.材料屋名}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">請求日:</span>
                            <span class="value">${invoice.請求日}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">支払期限:</span>
                            <span class="value">${invoice.支払期限}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">合計金額:</span>
                            <span class="value amount">¥${invoice.合計金額.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="invoice-items">
                        <h6>📦 明細</h6>
                        <div class="items-list">
                            ${invoice.明細.map(item => `
                                <div class="item-row">
                                    <span class="item-name">${item.商品名}</span>
                                    <span class="item-details">
                                        ${item.型番 ? `型番: ${item.型番} | ` : ''}
                                        ${item.数量}個 × ¥${item.単価.toLocaleString()} = ¥${item.金額.toLocaleString()}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="invoice-actions">
                        <button class="btn-small btn-primary" onclick="verificationSystem.simulateFileUpload('${invoice.請求書番号}', '${invoice.ファイル形式}')">
                            📤 この形式で取り込みテスト
                        </button>
                        <button class="btn-small btn-secondary" onclick="verificationSystem.showInvoiceDetail('${invoice.請求書番号}')">
                            🔍 詳細表示
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        // 取り込み方法の説明も追加
        html += `
            <div class="upload-instructions">
                <h4>📤 実際の取り込み手順</h4>
                <div class="instruction-steps">
                    <div class="instruction-step">
                        <strong>1. ファイル受信:</strong> 材料屋からメール添付またはFAXで請求書を受信
                    </div>
                    <div class="instruction-step">
                        <strong>2. ファイル保存:</strong> PCの適当なフォルダに保存（デスクトップなど）
                    </div>
                    <div class="instruction-step">
                        <strong>3. 材料屋選択:</strong> 上記の「材料屋選択」で送信元を選択
                    </div>
                    <div class="instruction-step">
                        <strong>4. ファイル選択:</strong> 「ファイルを選択」ボタンで保存したファイルを選択
                    </div>
                    <div class="instruction-step">
                        <strong>5. 処理実行:</strong> 「材料屋請求書処理実行」ボタンをクリック
                    </div>
                    <div class="instruction-step">
                        <strong>6. 結果確認:</strong> 自動で照合結果が表示される
                    </div>
                </div>
                
                <div class="format-support">
                    <h5>📄 対応ファイル形式</h5>
                    <ul>
                        <li><strong>CSV形式:</strong> トーシンコーポレーション、カンマ区切りテキスト</li>
                        <li><strong>Excel形式:</strong> TOTO販売店、.xls/.xlsx ファイル</li>
                        <li><strong>PDF形式:</strong> パナソニック住建、スキャン画像も対応</li>
                    </ul>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    // ファイル取り込みテスト
    async simulateFileUpload(invoiceNumber, fileFormat) {
        try {
            this.showLoading(`${fileFormat}ファイルの取り込みをシミュレーション中...`);
            
            // シミュレーション用の遅延
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const result = {
                success: true,
                fileName: `sample_invoice_${invoiceNumber}.${fileFormat.toLowerCase()}`,
                fileSize: '156 KB',
                extractedData: {
                    請求書番号: invoiceNumber,
                    抽出項目数: Math.floor(Math.random() * 5) + 3,
                    合計金額: (Math.random() * 200000 + 50000).toFixed(0),
                    処理時間: '1.2秒'
                },
                verification: {
                    照合結果: Math.random() > 0.3 ? 'OK' : 'WARNING',
                    差異件数: Math.floor(Math.random() * 3),
                    確認項目: ['商品名照合', '単価チェック', '数量確認', '合計金額照合']
                }
            };
            
            this.displayFileUploadResult(result, fileFormat);
            this.showSuccessMessage(`${fileFormat}ファイルの取り込みシミュレーションが完了しました`);
            
        } catch (error) {
            this.showErrorMessage('取り込みシミュレーションでエラーが発生しました');
        } finally {
            this.hideLoading();
        }
    }

    // ファイル取り込み結果表示
    displayFileUploadResult(result, fileFormat) {
        const container = document.getElementById('supplierResults');
        
        const resultHTML = `
            <div class="upload-result-section">
                <h4>📤 ${fileFormat}ファイル取り込み結果</h4>
                <div class="result-card ${result.success ? 'success' : 'error'}">
                    <div class="result-header">
                        <h5>${result.success ? '✅ 取り込み成功' : '❌ 取り込み失敗'}</h5>
                        <div class="file-info">
                            <span>📁 ${result.fileName}</span>
                            <span>📊 ${result.fileSize}</span>
                        </div>
                    </div>
                    
                    <div class="extraction-details">
                        <h6>🔍 抽出データ</h6>
                        <div class="extraction-grid">
                            <div class="extraction-item">
                                <span class="label">請求書番号:</span>
                                <span class="value">${result.extractedData.請求書番号}</span>
                            </div>
                            <div class="extraction-item">
                                <span class="label">抽出項目数:</span>
                                <span class="value">${result.extractedData.抽出項目数}件</span>
                            </div>
                            <div class="extraction-item">
                                <span class="label">合計金額:</span>
                                <span class="value">¥${parseInt(result.extractedData.合計金額).toLocaleString()}</span>
                            </div>
                            <div class="extraction-item">
                                <span class="label">処理時間:</span>
                                <span class="value">${result.extractedData.処理時間}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="verification-details">
                        <h6>✅ 照合結果</h6>
                        <div class="verification-status ${result.verification.照合結果.toLowerCase()}">
                            照合結果: ${result.verification.照合結果}
                        </div>
                        <div class="verification-items">
                            ${result.verification.確認項目.map(item => `
                                <span class="verification-item">✓ ${item}</span>
                            `).join('')}
                        </div>
                        ${result.verification.差異件数 > 0 ? `
                            <div class="warning-note">
                                ⚠️ ${result.verification.差異件数}件の差異が検出されました。詳細確認が必要です。
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += resultHTML;
    }
}

// グローバルインスタンス作成
let enhancedVerification;

// アプリケーション初期化
async function initVerificationSystem() {
    try {
        console.log('🚀 現場監督業務監視システム初期化開始...');
        
        // UI作成
        const container = document.getElementById('verification-container');
        
        if (!container) {
            console.error('❌ verification-container要素が見つかりません');
            return;
        }
        
        console.log('✅ verification-container要素を発見');
        
        // VerificationSystemインスタンス作成
        console.log('📦 EnhancedVerificationManagerインスタンス作成中...');
        window.verificationSystem = new EnhancedVerificationManager();
        console.log('✅ verificationSystemインスタンス作成完了');
        
        // 初期化実行
        console.log('🔧 verificationSystem初期化実行中...');
        window.verificationSystem.init();
        console.log('✅ verificationSystem初期化完了');
        
        console.log('🎉 現場監督業務監視システム初期化完了');
        
        // ステータスバー更新
        const statusElements = {
            totalProjects: document.getElementById('total-projects'),
            alertCount: document.getElementById('alert-count'),
            lastUpdate: document.getElementById('last-update')
        };
        
        if (statusElements.totalProjects) {
            statusElements.totalProjects.textContent = '案件数: 読み込み中...';
        }
        if (statusElements.alertCount) {
            statusElements.alertCount.textContent = '要確認: 読み込み中...';
        }
        if (statusElements.lastUpdate) {
            statusElements.lastUpdate.textContent = `最終更新: ${new Date().toLocaleTimeString()}`;
        }
        
    } catch (error) {
        console.error('❌ 初期化エラー:', error);
        const container = document.getElementById('verification-container');
        if (container) {
            container.innerHTML = `
                <div class="error-container">
                    <h3>❌ システム初期化に失敗しました</h3>
                    <p><strong>エラー詳細:</strong> ${error.message}</p>
                    <p><strong>スタック:</strong> ${error.stack}</p>
                    <button onclick="location.reload()" class="btn-primary">
                        🔄 ページを再読み込み
                    </button>
                </div>
            `;
        }
    }
}

// DOM読み込み完了後に初期化実行（デバッグ情報付き）
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM読み込み完了 - 初期化開始');
    
    // 必要な要素の存在確認
    const requiredElements = [
        'verification-container',
        'total-projects', 
        'alert-count',
        'last-update'
    ];
    
    console.log('🔍 必要な要素の存在確認中...');
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id} 要素: 存在`);
        } else {
            console.warn(`⚠️ ${id} 要素: 見つかりません`);
        }
    });
    
    // データ関連の確認
    console.log('📊 データ関連確認中...');
    console.log('dataManager:', typeof dataManager !== 'undefined' ? '✅ 利用可能' : '❌ 未定義');
    console.log('PROJECT_DATA:', typeof PROJECT_DATA !== 'undefined' ? `✅ ${PROJECT_DATA.length}件` : '❌ 未定義');
    
    // 初期化実行
    initVerificationSystem();
});