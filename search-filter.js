class SearchFilter {
    constructor() {
        this.filters = {
            projectName: '',
            customer: '',
            supervisor: '',
            workType: '',
            status: '',
            dateFrom: '',
            dateTo: '',
            amountFrom: null,
            amountTo: null,
            profitRateFrom: null,
            profitRateTo: null
        };
        
        this.sortBy = 'projectNo';
        this.sortOrder = 'asc';
        this.currentData = [];
        this.filteredData = [];
        
        this.initializeUI();
    }
    
    initializeUI() {
        // 検索・フィルタUIを作成
        const filterContainer = document.createElement('div');
        filterContainer.className = 'search-filter-container';
        filterContainer.innerHTML = this.createFilterHTML();
        
        // 既存のコンテナに挿入
        const mainContainer = document.querySelector('.tab-content.active');
        if (mainContainer) {
            mainContainer.insertBefore(filterContainer, mainContainer.firstChild);
        }
        
        this.attachEventListeners();
    }
    
    createFilterHTML() {
        return `
            <div class="filter-section">
                <h3>🔍 高度な検索・フィルタリング</h3>
                
                <div class="filter-toggle">
                    <button class="btn-filter-toggle" onclick="searchFilter.toggleFilterPanel()">
                        フィルタ表示/非表示
                    </button>
                    <button class="btn-reset-filter" onclick="searchFilter.resetFilters()">
                        フィルタリセット
                    </button>
                </div>
                
                <div class="filter-panel" id="filterPanel">
                    <div class="filter-grid">
                        <!-- テキスト検索 -->
                        <div class="filter-group">
                            <label>物件名</label>
                            <input type="text" id="filterProjectName" placeholder="物件名で検索...">
                        </div>
                        
                        <div class="filter-group">
                            <label>顧客名</label>
                            <input type="text" id="filterCustomer" placeholder="顧客名で検索...">
                        </div>
                        
                        <div class="filter-group">
                            <label>担当者</label>
                            <select id="filterSupervisor">
                                <option value="">全て</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>工事区分</label>
                            <select id="filterWorkType">
                                <option value="">全て</option>
                                <option value="新築">新築</option>
                                <option value="改修">改修</option>
                                <option value="リフォーム">リフォーム</option>
                                <option value="解体">解体</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>ステータス</label>
                            <select id="filterStatus">
                                <option value="">全て</option>
                                <option value="進行中">進行中</option>
                                <option value="完了">完了</option>
                                <option value="保留">保留</option>
                                <option value="キャンセル">キャンセル</option>
                            </select>
                        </div>
                        
                        <!-- 日付範囲 -->
                        <div class="filter-group">
                            <label>期間（開始）</label>
                            <input type="date" id="filterDateFrom">
                        </div>
                        
                        <div class="filter-group">
                            <label>期間（終了）</label>
                            <input type="date" id="filterDateTo">
                        </div>
                        
                        <!-- 金額範囲 -->
                        <div class="filter-group">
                            <label>契約額（下限）</label>
                            <input type="number" id="filterAmountFrom" placeholder="0">
                        </div>
                        
                        <div class="filter-group">
                            <label>契約額（上限）</label>
                            <input type="number" id="filterAmountTo" placeholder="999999999">
                        </div>
                        
                        <!-- 利益率範囲 -->
                        <div class="filter-group">
                            <label>利益率（下限）%</label>
                            <input type="number" id="filterProfitFrom" min="0" max="100" step="0.1">
                        </div>
                        
                        <div class="filter-group">
                            <label>利益率（上限）%</label>
                            <input type="number" id="filterProfitTo" min="0" max="100" step="0.1">
                        </div>
                    </div>
                    
                    <div class="filter-actions">
                        <button class="btn-apply-filter" onclick="searchFilter.applyFilters()">
                            フィルタ適用
                        </button>
                        <span class="filter-result-count" id="filterResultCount"></span>
                    </div>
                </div>
                
                <!-- ソート機能 -->
                <div class="sort-section">
                    <label>並び替え：</label>
                    <select id="sortBy" onchange="searchFilter.applySorting()">
                        <option value="projectNo">物件番号</option>
                        <option value="projectName">物件名</option>
                        <option value="contractAmount">契約額</option>
                        <option value="profitRate">利益率</option>
                        <option value="status">ステータス</option>
                        <option value="invoiceDate">請求日</option>
                    </select>
                    <select id="sortOrder" onchange="searchFilter.applySorting()">
                        <option value="asc">昇順</option>
                        <option value="desc">降順</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        // リアルタイム検索
        const textInputs = ['filterProjectName', 'filterCustomer'];
        textInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', debounce(() => this.applyFilters(), 300));
            }
        });
        
        // Enterキーで検索
        document.querySelectorAll('.filter-panel input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyFilters();
                }
            });
        });
    }
    
    toggleFilterPanel() {
        const panel = document.getElementById('filterPanel');
        panel.classList.toggle('hidden');
    }
    
    applyFilters() {
        // フィルタ値を取得
        this.filters.projectName = document.getElementById('filterProjectName').value;
        this.filters.customer = document.getElementById('filterCustomer').value;
        this.filters.supervisor = document.getElementById('filterSupervisor').value;
        this.filters.workType = document.getElementById('filterWorkType').value;
        this.filters.status = document.getElementById('filterStatus').value;
        this.filters.dateFrom = document.getElementById('filterDateFrom').value;
        this.filters.dateTo = document.getElementById('filterDateTo').value;
        this.filters.amountFrom = parseFloat(document.getElementById('filterAmountFrom').value) || null;
        this.filters.amountTo = parseFloat(document.getElementById('filterAmountTo').value) || null;
        this.filters.profitRateFrom = parseFloat(document.getElementById('filterProfitFrom').value) || null;
        this.filters.profitRateTo = parseFloat(document.getElementById('filterProfitTo').value) || null;
        
        // フィルタリング実行
        this.filteredData = this.currentData.filter(item => {
            // テキストフィルタ
            if (this.filters.projectName && !item.projectName.toLowerCase().includes(this.filters.projectName.toLowerCase())) {
                return false;
            }
            
            if (this.filters.customer && !item.customer.toLowerCase().includes(this.filters.customer.toLowerCase())) {
                return false;
            }
            
            // セレクトフィルタ
            if (this.filters.supervisor && item.supervisor !== this.filters.supervisor) {
                return false;
            }
            
            if (this.filters.workType && item.workType !== this.filters.workType) {
                return false;
            }
            
            if (this.filters.status && item.status !== this.filters.status) {
                return false;
            }
            
            // 日付範囲フィルタ
            if (this.filters.dateFrom && item.invoiceDate) {
                const itemDate = new Date(item.invoiceDate);
                const fromDate = new Date(this.filters.dateFrom);
                if (itemDate < fromDate) return false;
            }
            
            if (this.filters.dateTo && item.invoiceDate) {
                const itemDate = new Date(item.invoiceDate);
                const toDate = new Date(this.filters.dateTo);
                if (itemDate > toDate) return false;
            }
            
            // 金額範囲フィルタ
            if (this.filters.amountFrom !== null && item.contractAmount < this.filters.amountFrom) {
                return false;
            }
            
            if (this.filters.amountTo !== null && item.contractAmount > this.filters.amountTo) {
                return false;
            }
            
            // 利益率範囲フィルタ
            if (this.filters.profitRateFrom !== null && item.profitRate < this.filters.profitRateFrom) {
                return false;
            }
            
            if (this.filters.profitRateTo !== null && item.profitRate > this.filters.profitRateTo) {
                return false;
            }
            
            return true;
        });
        
        // ソート適用
        this.applySorting();
        
        // 結果数を表示
        this.updateResultCount();
        
        // フィルタ結果を表示
        this.displayFilteredResults();
    }
    
    applySorting() {
        this.sortBy = document.getElementById('sortBy').value;
        this.sortOrder = document.getElementById('sortOrder').value;
        
        this.filteredData.sort((a, b) => {
            let valueA = a[this.sortBy];
            let valueB = b[this.sortBy];
            
            // null/undefinedの処理
            if (valueA == null) valueA = '';
            if (valueB == null) valueB = '';
            
            // 数値の場合
            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return this.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
            }
            
            // 文字列の場合
            valueA = String(valueA).toLowerCase();
            valueB = String(valueB).toLowerCase();
            
            if (this.sortOrder === 'asc') {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
        });
        
        this.displayFilteredResults();
    }
    
    resetFilters() {
        // フィルタをリセット
        document.getElementById('filterProjectName').value = '';
        document.getElementById('filterCustomer').value = '';
        document.getElementById('filterSupervisor').value = '';
        document.getElementById('filterWorkType').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        document.getElementById('filterAmountFrom').value = '';
        document.getElementById('filterAmountTo').value = '';
        document.getElementById('filterProfitFrom').value = '';
        document.getElementById('filterProfitTo').value = '';
        
        // 全データを表示
        this.filteredData = [...this.currentData];
        this.applySorting();
    }
    
    updateResultCount() {
        const countElement = document.getElementById('filterResultCount');
        if (countElement) {
            countElement.textContent = `検索結果: ${this.filteredData.length}件 / 全${this.currentData.length}件`;
        }
    }
    
    displayFilteredResults() {
        // 既存の表示更新関数を呼び出す
        if (typeof updateProjectDisplay === 'function') {
            updateProjectDisplay(this.filteredData);
        }
    }
    
    setData(data) {
        this.currentData = data;
        this.filteredData = [...data];
        
        // 担当者リストを更新
        this.updateSupervisorList();
    }
    
    updateSupervisorList() {
        const supervisors = [...new Set(this.currentData.map(item => item.supervisor))].filter(s => s);
        const select = document.getElementById('filterSupervisor');
        
        if (select) {
            select.innerHTML = '<option value="">全て</option>';
            supervisors.sort().forEach(supervisor => {
                const option = document.createElement('option');
                option.value = supervisor;
                option.textContent = supervisor;
                select.appendChild(option);
            });
        }
    }
    
    exportResults() {
        // フィルタ結果をCSVエクスポート
        const csv = this.convertToCSV(this.filteredData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `filtered_results_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(row => {
            return headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            }).join(',');
        });
        
        return [csvHeaders, ...csvRows].join('\n');
    }
}

// デバウンス関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// グローバルインスタンス
const searchFilter = new SearchFilter();