class ExportManager {
    constructor() {
        this.exportFormats = ['csv', 'excel', 'pdf'];
        this.initializeUI();
    }
    
    initializeUI() {
        // エクスポートボタンを各タブに追加
        this.addExportButtons();
    }
    
    addExportButtons() {
        // エクスポートボタンのHTMLテンプレート
        const exportButtonsHTML = `
            <div class="export-buttons">
                <button class="btn-export" onclick="exportManager.showExportDialog()">
                    📥 データエクスポート
                </button>
            </div>
        `;
        
        // 各タブコンテンツにボタンを追加
        document.querySelectorAll('.tab-content').forEach(tab => {
            if (!tab.querySelector('.export-buttons')) {
                const div = document.createElement('div');
                div.innerHTML = exportButtonsHTML;
                tab.insertBefore(div.firstElementChild, tab.firstChild);
            }
        });
    }
    
    showExportDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'export-dialog';
        dialog.innerHTML = `
            <div class="export-dialog-content">
                <h3>データエクスポート</h3>
                <div class="export-options">
                    <div class="export-format-section">
                        <h4>形式を選択</h4>
                        <label class="export-option">
                            <input type="radio" name="exportFormat" value="csv" checked>
                            <span>CSV形式</span>
                            <small>Excel等で開ける汎用形式</small>
                        </label>
                        <label class="export-option">
                            <input type="radio" name="exportFormat" value="excel">
                            <span>Excel形式 (.xlsx)</span>
                            <small>書式設定付きのExcelファイル</small>
                        </label>
                        <label class="export-option">
                            <input type="radio" name="exportFormat" value="pdf">
                            <span>PDF形式</span>
                            <small>印刷・共有に最適</small>
                        </label>
                    </div>
                    
                    <div class="export-content-section">
                        <h4>エクスポート内容</h4>
                        <label class="export-checkbox">
                            <input type="checkbox" id="exportFiltered" checked>
                            <span>フィルタ適用済みデータのみ</span>
                        </label>
                        <label class="export-checkbox">
                            <input type="checkbox" id="exportSummary" checked>
                            <span>サマリー情報を含める</span>
                        </label>
                    </div>
                    
                    <div class="export-actions">
                        <button class="btn-primary" onclick="exportManager.executeExport()">
                            エクスポート実行
                        </button>
                        <button class="btn-secondary" onclick="exportManager.closeDialog()">
                            キャンセル
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
    }
    
    closeDialog() {
        const dialog = document.querySelector('.export-dialog');
        if (dialog) {
            dialog.remove();
        }
    }
    
    async executeExport() {
        const format = document.querySelector('input[name="exportFormat"]:checked').value;
        const includeFiltered = document.getElementById('exportFiltered').checked;
        const includeSummary = document.getElementById('exportSummary').checked;
        
        // 現在のタブを特定
        const activeTab = document.querySelector('.tab-btn.active').textContent;
        const data = this.getDataForExport(activeTab, includeFiltered);
        
        if (!data || data.length === 0) {
            alert('エクスポートするデータがありません');
            return;
        }
        
        try {
            switch (format) {
                case 'csv':
                    await this.exportToCSV(data, activeTab, includeSummary);
                    break;
                case 'excel':
                    await this.exportToExcel(data, activeTab, includeSummary);
                    break;
                case 'pdf':
                    await this.exportToPDF(data, activeTab, includeSummary);
                    break;
            }
            
            this.closeDialog();
            this.showSuccessNotification(format);
        } catch (error) {
            console.error('エクスポートエラー:', error);
            alert('エクスポートに失敗しました: ' + error.message);
        }
    }
    
    getDataForExport(activeTab, includeFiltered) {
        // タブに応じたデータを取得
        let data = [];
        
        switch (activeTab) {
            case '照合サマリー':
                data = this.getVerificationSummaryData();
                break;
            case '工事注文書照合':
                data = this.getWorkOrderData();
                break;
            case '材料発注vs請求':
                data = this.getMaterialData();
                break;
            case '総原価検証':
                data = this.getCostVerificationData();
                break;
            default:
                // searchFilterが存在する場合はフィルタ済みデータを使用
                if (includeFiltered && window.searchFilter && window.searchFilter.filteredData) {
                    data = window.searchFilter.filteredData;
                } else if (window.projectData) {
                    data = window.projectData;
                }
        }
        
        return data;
    }
    
    async exportToCSV(data, tabName, includeSummary) {
        let csvContent = '\uFEFF'; // BOM for UTF-8
        
        // タイトル
        csvContent += `${tabName} - エクスポート\n`;
        csvContent += `エクスポート日時: ${new Date().toLocaleString('ja-JP')}\n\n`;
        
        // サマリー情報
        if (includeSummary) {
            const summary = this.generateSummary(data);
            csvContent += 'サマリー情報\n';
            Object.entries(summary).forEach(([key, value]) => {
                csvContent += `${key},${value}\n`;
            });
            csvContent += '\n';
        }
        
        // データ本体
        if (data.length > 0) {
            // ヘッダー
            const headers = Object.keys(data[0]);
            csvContent += headers.join(',') + '\n';
            
            // データ行
            data.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header];
                    // カンマや改行を含む場合はクォートで囲む
                    if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value ?? '';
                });
                csvContent += values.join(',') + '\n';
            });
        }
        
        // ダウンロード
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${tabName}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    }
    
    async exportToExcel(data, tabName, includeSummary) {
        // 動的にXLSXライブラリをロード
        if (typeof XLSX === 'undefined') {
            await this.loadScript('/node_modules/xlsx/dist/xlsx.full.min.js');
        }
        
        const wb = XLSX.utils.book_new();
        
        // サマリーシート
        if (includeSummary) {
            const summary = this.generateSummary(data);
            const summaryData = Object.entries(summary).map(([key, value]) => ({ 項目: key, 値: value }));
            const summaryWs = XLSX.utils.json_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, summaryWs, 'サマリー');
        }
        
        // データシート
        const ws = XLSX.utils.json_to_sheet(data);
        
        // 列幅の自動調整
        const colWidths = {};
        Object.keys(data[0] || {}).forEach((key, i) => {
            const maxLength = Math.max(
                key.length,
                ...data.map(row => String(row[key] || '').length)
            );
            colWidths[i] = { wch: Math.min(maxLength + 2, 50) };
        });
        ws['!cols'] = Object.values(colWidths);
        
        XLSX.utils.book_append_sheet(wb, ws, 'データ');
        
        // エクスポート
        XLSX.writeFile(wb, `${tabName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
    
    async exportToPDF(data, tabName, includeSummary) {
        // 動的にjsPDFライブラリをロード
        if (typeof jsPDF === 'undefined') {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js');
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4'); // 横向き
        
        // フォント設定（日本語対応）
        doc.setFont('helvetica');
        
        // タイトル
        doc.setFontSize(16);
        doc.text(tabName, 14, 15);
        
        doc.setFontSize(10);
        doc.text(`Export Date: ${new Date().toLocaleString('ja-JP')}`, 14, 22);
        
        let yPosition = 30;
        
        // サマリー情報
        if (includeSummary) {
            const summary = this.generateSummary(data);
            doc.setFontSize(12);
            doc.text('Summary', 14, yPosition);
            yPosition += 8;
            
            doc.setFontSize(10);
            Object.entries(summary).forEach(([key, value]) => {
                doc.text(`${key}: ${value}`, 14, yPosition);
                yPosition += 6;
            });
            yPosition += 5;
        }
        
        // データテーブル
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            const tableData = data.map(row => headers.map(h => row[h] ?? ''));
            
            doc.autoTable({
                head: [headers],
                body: tableData,
                startY: yPosition,
                styles: {
                    fontSize: 8,
                    cellPadding: 2
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                }
            });
        }
        
        // 保存
        doc.save(`${tabName}_${new Date().toISOString().slice(0, 10)}.pdf`);
    }
    
    generateSummary(data) {
        const summary = {
            'データ件数': data.length,
            'エクスポート日時': new Date().toLocaleString('ja-JP')
        };
        
        // 数値フィールドの合計・平均を計算
        if (data.length > 0) {
            const numericFields = Object.keys(data[0]).filter(key => 
                typeof data[0][key] === 'number'
            );
            
            numericFields.forEach(field => {
                const values = data.map(row => row[field]).filter(v => v != null);
                if (values.length > 0) {
                    const sum = values.reduce((a, b) => a + b, 0);
                    const avg = sum / values.length;
                    
                    if (field.includes('金額') || field.includes('額')) {
                        summary[`${field}合計`] = `¥${sum.toLocaleString()}`;
                        summary[`${field}平均`] = `¥${Math.round(avg).toLocaleString()}`;
                    } else if (field.includes('率')) {
                        summary[`${field}平均`] = `${avg.toFixed(1)}%`;
                    }
                }
            });
        }
        
        return summary;
    }
    
    getVerificationSummaryData() {
        // 照合サマリーデータの取得
        const summaryElement = document.querySelector('.summary-stats');
        if (!summaryElement) return [];
        
        const data = [];
        summaryElement.querySelectorAll('.stat-card').forEach(card => {
            const label = card.querySelector('h3')?.textContent || '';
            const value = card.querySelector('.stat-value')?.textContent || '';
            const subValue = card.querySelector('.stat-subvalue')?.textContent || '';
            
            data.push({
                項目: label,
                値: value,
                詳細: subValue
            });
        });
        
        return data;
    }
    
    getWorkOrderData() {
        // 工事注文書データの取得
        const table = document.querySelector('.work-order-table');
        if (!table) return [];
        
        return this.tableToJSON(table);
    }
    
    getMaterialData() {
        // 材料データの取得
        const table = document.querySelector('.material-table');
        if (!table) return [];
        
        return this.tableToJSON(table);
    }
    
    getCostVerificationData() {
        // 原価検証データの取得
        const table = document.querySelector('.cost-table');
        if (!table) return [];
        
        return this.tableToJSON(table);
    }
    
    tableToJSON(table) {
        const data = [];
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        
        table.querySelectorAll('tbody tr').forEach(row => {
            const rowData = {};
            row.querySelectorAll('td').forEach((cell, index) => {
                if (headers[index]) {
                    rowData[headers[index]] = cell.textContent.trim();
                }
            });
            data.push(rowData);
        });
        
        return data;
    }
    
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    showSuccessNotification(format) {
        const notification = document.createElement('div');
        notification.className = 'export-notification success';
        notification.textContent = `${format.toUpperCase()}形式でエクスポートしました`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// スタイル追加
const style = document.createElement('style');
style.textContent = `
.export-buttons {
    margin-bottom: 20px;
}

.btn-export {
    padding: 10px 20px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.btn-export:hover {
    background: #218838;
}

.export-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.export-dialog-content {
    background: white;
    border-radius: 8px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.export-dialog-content h3 {
    margin: 0 0 20px 0;
    font-size: 20px;
}

.export-dialog-content h4 {
    margin: 20px 0 10px 0;
    font-size: 16px;
    color: #666;
}

.export-option, .export-checkbox {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
    cursor: pointer;
}

.export-option input, .export-checkbox input {
    margin-right: 10px;
    margin-top: 3px;
}

.export-option span, .export-checkbox span {
    font-weight: 500;
}

.export-option small {
    display: block;
    color: #666;
    font-size: 12px;
    margin-top: 2px;
    margin-left: 24px;
}

.export-actions {
    display: flex;
    gap: 10px;
    margin-top: 30px;
    justify-content: flex-end;
}

.btn-primary, .btn-secondary {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #5a6268;
}

.export-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    z-index: 1001;
    animation: slideIn 0.3s ease;
}

.export-notification.success {
    background: #28a745;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);

// グローバルインスタンス
const exportManager = new ExportManager();