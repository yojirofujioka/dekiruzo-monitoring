// 現場監督業務監視システム メインアプリケーション
class SupervisorMonitoringApp {
    constructor() {
        this.currentTab = 'dashboard';
        this.currentFilters = {};
        this.currentSearch = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateFilters();
        this.updateDashboard();
        this.updateStatusBar();
        console.log('🏗️ 現場監督業務監視システム 起動完了');
    }

    setupEventListeners() {
        // タブ切り替え
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 検索・フィルター
        document.getElementById('project-search').addEventListener('input', 
            this.handleSearch.bind(this));
        
        document.getElementById('supervisor-filter').addEventListener('change', 
            this.handleFilterChange.bind(this));
        
        document.getElementById('category-filter').addEventListener('change', 
            this.handleFilterChange.bind(this));
        
        document.getElementById('status-filter').addEventListener('change', 
            this.handleFilterChange.bind(this));

        // 照合チェック
        document.getElementById('run-verification').addEventListener('click', 
            this.runVerification.bind(this));

        // 設定タブのイベント
        document.getElementById('import-data').addEventListener('click', 
            this.importData.bind(this));
        
        document.getElementById('export-report').addEventListener('click', 
            this.exportReport.bind(this));
            
        // 設定値の変更イベント
        document.getElementById('profit-threshold').addEventListener('change', 
            this.updateSettings.bind(this));
            
        document.getElementById('amount-threshold').addEventListener('change', 
            this.updateSettings.bind(this));
            
        document.getElementById('auto-verification').addEventListener('change', 
            this.updateSettings.bind(this));
            
        document.getElementById('email-alerts').addEventListener('change', 
            this.updateSettings.bind(this));

        // CSVファイル選択
        document.getElementById('csv-file').addEventListener('change', 
            this.handleFileSelect.bind(this));

        // モーダル
        document.querySelector('.close').addEventListener('click', 
            this.closeModal.bind(this));
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });
    }

    switchTab(tabName) {
        // タブボタンの状態更新
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // タブコンテンツの表示切り替え
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // タブ別の初期化処理
        switch (tabName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'projects':
                this.renderProjectsTable();
                break;
            case 'verification':
                this.renderVerificationResults();
                break;
            case 'patterns':
                this.renderPatternAnalysis();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    populateFilters() {
        const supervisorSelect = document.getElementById('supervisor-filter');
        const supervisors = [...new Set(PROJECT_DATA.map(p => p.supervisor))].sort();
        
        supervisors.forEach(supervisor => {
            const option = document.createElement('option');
            option.value = supervisor;
            option.textContent = supervisor;
            supervisorSelect.appendChild(option);
        });
    }

    handleSearch(e) {
        this.currentSearch = e.target.value;
        if (this.currentTab === 'projects') {
            this.renderProjectsTable();
        }
    }

    handleFilterChange() {
        this.currentFilters = {
            supervisor: document.getElementById('supervisor-filter').value,
            workType: document.getElementById('category-filter').value,
            status: document.getElementById('status-filter').value
        };
        
        if (this.currentTab === 'projects') {
            this.renderProjectsTable();
        }
    }

    updateStatusBar() {
        const totalProjects = PROJECT_DATA.length;
        const alerts = generateAlerts();

        document.getElementById('total-projects').textContent = `案件数: ${totalProjects}件`;
        document.getElementById('alert-count').textContent = `要確認: ${alerts.length}件`;
        document.getElementById('last-update').textContent = 
            `最終更新: ${new Date().toLocaleString('ja-JP')}`;
    }

    updateDashboard() {
        this.renderMetrics();
        this.renderAlerts();
        this.renderSupervisorStats();
        this.renderProfitChart();
    }

    renderMetrics() {
        const activeProjects = PROJECT_DATA.filter(p => p.status === '進行中').length;
        const pendingVerification = PROJECT_DATA.filter(p => p.status === '照合待ち').length;

        document.getElementById('active-projects').textContent = activeProjects;
        document.getElementById('pending-verification').textContent = pendingVerification;
    }

    renderAlerts() {
        const container = document.getElementById('alert-list');
        const alerts = generateAlerts();

        container.innerHTML = '';

        if (alerts.length === 0) {
            container.innerHTML = '<div class="text-muted text-center">アラートはありません</div>';
            return;
        }

        alerts.slice(0, 5).forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = `alert-item ${alert.type}`;
            alertElement.innerHTML = `
                <strong>${alert.supervisor}</strong><br>
                ${alert.message}
            `;
            container.appendChild(alertElement);
        });
    }

    renderSupervisorStats() {
        const container = document.getElementById('supervisor-stats');
        const stats = calculateSupervisorStats();

        container.innerHTML = '';

        stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.className = 'supervisor-item';
            statElement.innerHTML = `
                <div class="supervisor-name">${stat.name}</div>
                <div class="supervisor-metrics">
                    <div class="supervisor-metric">
                        <span class="value">${stat.projectCount}</span>
                        <span class="label">案件</span>
                    </div>
                    <div class="supervisor-metric">
                        <span class="value">${formatPercent(stat.avgProfitRate)}</span>
                        <span class="label">利益率</span>
                    </div>
                    <div class="supervisor-metric">
                        <span class="value">${formatCurrency(stat.totalContract)}</span>
                        <span class="label">売上</span>
                    </div>
                </div>
            `;
            container.appendChild(statElement);
        });
    }

    renderProfitChart() {
        const canvas = document.getElementById('profit-chart');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const stats = calculateSupervisorStats();
        const maxProfit = Math.max(...stats.map(s => s.avgProfitRate));
        const barWidth = canvas.width / (stats.length + 1);
        
        stats.forEach((stat, index) => {
            const barHeight = (stat.avgProfitRate / maxProfit) * (canvas.height - 40);
            const x = (index + 1) * barWidth - barWidth/2;
            const y = canvas.height - barHeight - 20;
            
            ctx.fillStyle = '#3498db';
            ctx.fillRect(x - 20, y, 40, barHeight);
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(stat.name, x, canvas.height - 5);
            ctx.fillText(`${formatPercent(stat.avgProfitRate)}`, x, y - 5);
        });
    }

    renderProjectsTable() {
        const tbody = document.getElementById('projects-tbody');
        const results = searchProjects(this.currentSearch, this.currentFilters);

        tbody.innerHTML = '';

        if (results.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted">該当する案件がありません</td>
                </tr>
            `;
            return;
        }

        results.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.projectNo}</td>
                <td>${project.projectName}</td>
                <td>${project.supervisor}</td>
                <td>${project.workType}</td>
                <td class="text-right">${formatCurrency(project.contractAmount)}</td>
                <td class="text-right ${project.profitRate < 15 ? 'text-danger' : project.profitRate > 30 ? 'text-success' : ''}">${formatPercent(project.profitRate)}</td>
                <td><span class="status-badge ${getStatusBadgeClass(project.status)}">${project.status}</span></td>
                <td>
                    <button class="btn-primary btn-small" onclick="app.showProjectDetail('${project.projectNo}')">詳細</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showProjectDetail(projectNo) {
        const project = PROJECT_DATA.find(p => p.projectNo === projectNo);
        const estimate = ESTIMATE_DATA.find(e => e.projectNo === projectNo);
        const orders = ORDER_DATA.filter(o => o.projectNo === projectNo);

        const modal = document.getElementById('detail-modal');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
            <h2>案件詳細: ${project.projectName}</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h3>基本情報</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td><strong>物件No:</strong></td><td>${project.projectNo}</td></tr>
                        <tr><td><strong>顧客:</strong></td><td>${project.customer}</td></tr>
                        <tr><td><strong>担当者:</strong></td><td>${project.supervisor}</td></tr>
                        <tr><td><strong>工事区分:</strong></td><td>${project.workType}</td></tr>
                        <tr><td><strong>ステータス:</strong></td><td><span class="status-badge ${getStatusBadgeClass(project.status)}">${project.status}</span></td></tr>
                    </table>
                </div>
                
                <div>
                    <h3>金額情報</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td><strong>契約額:</strong></td><td class="text-right">${formatCurrency(project.contractAmount)}</td></tr>
                        <tr><td><strong>原価:</strong></td><td class="text-right">${formatCurrency(project.costAmount)}</td></tr>
                        <tr><td><strong>利益:</strong></td><td class="text-right">${formatCurrency(project.profitAmount)}</td></tr>
                        <tr><td><strong>利益率:</strong></td><td class="text-right ${project.profitRate < 15 ? 'text-danger' : project.profitRate > 30 ? 'text-success' : ''}">${formatPercent(project.profitRate)}</td></tr>
                    </table>
                </div>
            </div>

            ${estimate ? `
                <div style="margin-bottom: 20px;">
                    <h3>見積もり内容（${estimate.supervisor}監督）</h3>
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                        <thead style="background: #f8f9fa;">
                            <tr>
                                <th style="border: 1px solid #ddd; padding: 8px;">カテゴリ</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">内容</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">金額</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">備考</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${estimate.items.map(item => `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${item.category}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(item.amount)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${item.note}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}

            ${orders.length > 0 ? `
                <div>
                    <h3>発注情報</h3>
                    ${orders.map(order => `
                        <div style="margin-bottom: 15px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
                            <h4>${order.supplier} (${order.orderDate})</h4>
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead style="background: #f8f9fa;">
                                    <tr>
                                        <th style="border: 1px solid #ddd; padding: 5px;">品番</th>
                                        <th style="border: 1px solid #ddd; padding: 5px;">商品名</th>
                                        <th style="border: 1px solid #ddd; padding: 5px;">数量</th>
                                        <th style="border: 1px solid #ddd; padding: 5px;">単価</th>
                                        <th style="border: 1px solid #ddd; padding: 5px;">金額</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.items.map(item => `
                                        <tr>
                                            <td style="border: 1px solid #ddd; padding: 5px;">${item.itemCode}</td>
                                            <td style="border: 1px solid #ddd; padding: 5px;">${item.itemName}</td>
                                            <td style="border: 1px solid #ddd; padding: 5px; text-align: center;">${item.quantity}</td>
                                            <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">${formatCurrency(item.unitPrice)}</td>
                                            <td style="border: 1px solid #ddd; padding: 5px; text-align: right;">${formatCurrency(item.amount)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;

        modal.classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('detail-modal').classList.add('hidden');
    }

    runVerification() {
        this.showLoading();
        
        setTimeout(() => {
            this.renderVerificationResults();
            this.hideLoading();
            
            // 実装例を表示
            alert(`照合チェック完了！

✅ 照合OK: 2件
⚠️ 要確認: 1件  
❌ エラー: 2件

詳細は画面でご確認ください。
実運用では、アクセスDBと仕入れ先データを自動照合します。`);
        }, 1500);
    }

    renderVerificationResults() {
        const okContainer = document.getElementById('verification-ok');
        const warningContainer = document.getElementById('verification-warning');
        const errorContainer = document.getElementById('verification-error');

        okContainer.innerHTML = `
            <div class="verification-item ok">
                <strong>37.04.004 - 本厚木スカイハイツ233</strong><br>
                見積もりと発注が正常に一致しています
            </div>
            <div class="verification-item ok">
                <strong>37.04.211 - カーサヴィア船堀</strong><br>
                金額・数量に問題ありません
            </div>
        `;

        warningContainer.innerHTML = `
            <div class="verification-item warning">
                <strong>37.04.002 - 府中住吉町住宅</strong><br>
                見積もり「キッチン推薦」¥800,000 vs 発注合計¥693,000<br>
                <small>→ 工事費が別途計上されている可能性</small>
            </div>
        `;

        errorContainer.innerHTML = `
            <div class="verification-item error">
                <strong>37.04.008 - 国立市泉3丁目</strong><br>
                見積もり「UB-1616」に対応する発注が見つかりません<br>
                <small>→ 発注漏れの可能性があります</small>
            </div>
            <div class="verification-item error">
                <strong>37.04.470 - TYビル</strong><br>
                発注金額が見積もりを20%超過しています<br>
                <small>→ 原価管理の確認が必要</small>
            </div>
        `;
    }

    renderPatternAnalysis() {
        this.renderSupervisorPatterns();
        this.renderNamingPatterns();
        this.renderCostPatterns();
        this.renderImprovementSuggestions();
    }

    renderSupervisorPatterns() {
        const container = document.getElementById('supervisor-patterns');
        container.innerHTML = '';

        Object.entries(SUPERVISOR_PATTERNS).forEach(([name, pattern]) => {
            const patternElement = document.createElement('div');
            patternElement.className = 'pattern-item';
            patternElement.innerHTML = `
                <div class="pattern-label">${name} (${pattern.totalProjects}件)</div>
                <div class="pattern-value">
                    平均利益率: ${formatPercent(pattern.avgProfitRate)}<br>
                    よく使う仕入れ先: ${pattern.preferredSuppliers.join(', ')}<br>
                    ${pattern.characteristics.join('、')}
                </div>
            `;
            container.appendChild(patternElement);
        });
    }

    renderNamingPatterns() {
        const container = document.getElementById('naming-patterns');
        container.innerHTML = '';

        Object.entries(SUPERVISOR_PATTERNS).forEach(([name, pattern]) => {
            pattern.namingPatterns.forEach(naming => {
                const patternElement = document.createElement('div');
                patternElement.className = 'pattern-item';
                patternElement.innerHTML = `
                    <div class="pattern-label">"${naming.pattern}" (${name})</div>
                    <div class="pattern-value">${naming.meaning}</div>
                `;
                container.appendChild(patternElement);
            });
        });
    }

    renderCostPatterns() {
        const container = document.getElementById('cost-patterns');
        const stats = calculateSupervisorStats();

        container.innerHTML = '';

        stats.forEach(stat => {
            const patternElement = document.createElement('div');
            patternElement.className = 'pattern-item';
            patternElement.innerHTML = `
                <div class="pattern-label">${stat.name}</div>
                <div class="pattern-value">
                    平均案件規模: ${formatCurrency(stat.totalContract / stat.projectCount)}<br>
                    利益率: ${formatPercent(stat.avgProfitRate)}
                </div>
            `;
            container.appendChild(patternElement);
        });
    }

    renderImprovementSuggestions() {
        const container = document.getElementById('improvement-suggestions');
        
        container.innerHTML = `
            <div class="pattern-item">
                <div class="pattern-label">見積もり表記の標準化</div>
                <div class="pattern-value">
                    現場監督別の独自表記を統一することで照合効率が向上します
                </div>
            </div>
            <div class="pattern-item">
                <div class="pattern-label">低利益率案件の改善</div>
                <div class="pattern-value">
                    田原監督の案件で利益率17.5%と低め。原価管理の見直しを推奨
                </div>
            </div>
            <div class="pattern-item">
                <div class="pattern-label">仕入れ先の集約</div>
                <div class="pattern-value">
                    LIXIL・TOTOの使用率が高い。ボリューム割引交渉の余地あり
                </div>
            </div>
        `;
    }

    // 設定関連の機能
    loadSettings() {
        // ローカルストレージから設定を読み込み
        const savedSettings = localStorage.getItem('supervisorMonitorSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('profit-threshold').value = settings.profitThreshold || 15;
            document.getElementById('amount-threshold').value = settings.amountThreshold || 10;
            document.getElementById('auto-verification').checked = settings.autoVerification || false;
            document.getElementById('email-alerts').checked = settings.emailAlerts || false;
        }
    }

    updateSettings() {
        // 設定値を保存
        const settings = {
            profitThreshold: document.getElementById('profit-threshold').value,
            amountThreshold: document.getElementById('amount-threshold').value,
            autoVerification: document.getElementById('auto-verification').checked,
            emailAlerts: document.getElementById('email-alerts').checked
        };
        
        localStorage.setItem('supervisorMonitorSettings', JSON.stringify(settings));
        
        // アラート設定を更新
        ALERT_SETTINGS.profitRateThreshold = parseInt(settings.profitThreshold);
        ALERT_SETTINGS.amountThreshold = parseInt(settings.amountThreshold);
        
        // 画面を更新
        this.updateDashboard();
        
        console.log('設定を更新しました:', settings);
    }

    importData() {
        document.getElementById('csv-file').click();
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            this.processCSVFile(file);
        } else {
            alert('CSVファイルを選択してください');
        }
    }

    processCSVFile(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const csvData = e.target.result;
            console.log('CSVデータ読み込み成功:', file.name);
            
            try {
                // CSVパーサーを使用してデータを解析
                const parser = new CSVParser();
                const parsedData = parser.parseCSV(csvData);
                const projectData = parser.convertToProjectData(parsedData);
                
                // データ統計を計算
                const totalProjects = projectData.length;
                const totalAmount = projectData.reduce((sum, p) => sum + p.contractAmount, 0);
                const avgProfitRate = projectData.reduce((sum, p) => sum + p.profitRate, 0) / totalProjects;
                
                // 確認ダイアログ
                const confirmMessage = `
ファイル「${file.name}」を読み込みました！

【読み込み結果】
✅ 案件数: ${totalProjects}件
✅ 合計契約額: ${formatCurrency(totalAmount)}
✅ 平均利益率: ${formatPercent(avgProfitRate)}

【データ例】
${projectData.slice(0, 3).map(p => `・${p.projectNo} ${p.projectName} (${p.supervisor})`).join('\n')}

このデータをシステムに反映しますか？`;
                
                if (confirm(confirmMessage)) {
                    // 既存データに追加（実際の運用では重複チェックが必要）
                    PROJECT_DATA.push(...projectData);
                    
                    // 見積もりデータも生成（仮実装）
                    const estimateData = parser.extractEstimateData(parsedData);
                    ESTIMATE_DATA.push(...estimateData);
                    
                    // 画面を更新
                    this.updateStatusBar();
                    this.populateFilters(); // フィルターを再構築
                    
                    if (this.currentTab === 'dashboard') {
                        this.updateDashboard();
                    } else if (this.currentTab === 'projects') {
                        this.renderProjectsTable();
                    }
                    
                    alert(`✅ データの取り込みが完了しました！

追加された案件: ${totalProjects}件
現在の総案件数: ${PROJECT_DATA.length}件

ダッシュボードまたは案件一覧でご確認ください。`);
                }
                
            } catch (error) {
                console.error('CSVパースエラー:', error);
                alert(`データの読み込みに失敗しました。

エラー: ${error.message}

CSVファイルの形式を確認してください。
・タブ区切りであること
・ヘッダー行が正しいこと
・文字コードがShift-JISであること`);
            }
        };
        
        reader.onerror = () => {
            alert('ファイルの読み込みに失敗しました');
        };
        
        reader.readAsText(file, 'Shift_JIS'); // 日本語エンコーディング対応
    }

    exportReport() {
        const stats = calculateSupervisorStats();
        const alerts = generateAlerts();
        
        const reportData = {
            generatedAt: new Date().toISOString(),
            totalProjects: PROJECT_DATA.length,
            supervisorStats: stats,
            alerts: alerts,
            averageProfitRate: stats.reduce((sum, s) => sum + s.avgProfitRate, 0) / stats.length
        };

        // JSON形式でダウンロード
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `監督業務レポート_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        // 実装予定のExcel出力について説明
        alert(`レポートを出力しました！

【現在】JSONファイルで出力
【実装予定】
- Excel形式での出力
- グラフ・チャート付き
- 月次比較レポート
- メール自動送信機能

実運用時は御社の報告書フォーマットに
合わせてカスタマイズします。`);
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }
}

// アプリケーション初期化
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new SupervisorMonitoringApp();
    
    console.log('📊 システム機能:');
    console.log('  ✅ 案件管理・検索');
    console.log('  ✅ 担当者別分析');
    console.log('  ✅ 利益率監視');
    console.log('  ✅ アラート機能');
    console.log('  ✅ 見積もり vs 発注照合');
    console.log('  ✅ パターン分析');
    console.log('  ✅ 改善提案');
}); 