// API通信クライアント
class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const requestOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, requestOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // 案件データ取得
    async getProjects(filters = {}) {
        const queryParams = new URLSearchParams();
        
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                queryParams.append(key, filters[key]);
            }
        });

        const endpoint = `/projects${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await this.request(endpoint);
    }

    // 特定案件の見積もりデータ取得
    async getEstimates(projectNo) {
        return await this.request(`/estimates/${projectNo}`);
    }

    // 特定案件の発注データ取得
    async getOrders(projectNo) {
        return await this.request(`/orders/${projectNo}`);
    }

    // 統計データ取得
    async getStatistics() {
        return await this.request('/statistics');
    }

    // アラート取得
    async getAlerts() {
        return await this.request('/alerts');
    }

    // 照合チェック実行
    async runVerification() {
        return await this.request('/verification/run', {
            method: 'POST'
        });
    }

    // 新規案件追加
    async createProject(projectData) {
        return await this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }

    // 案件更新
    async updateProject(projectNo, projectData) {
        return await this.request(`/projects/${projectNo}`, {
            method: 'PUT',
            body: JSON.stringify(projectData)
        });
    }

    // 案件削除
    async deleteProject(projectNo) {
        return await this.request(`/projects/${projectNo}`, {
            method: 'DELETE'
        });
    }
}

// API接続状態チェック
class ConnectionManager {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.isOnline = true;
        this.retryAttempts = 0;
        this.maxRetries = 3;
        
        this.setupConnectionMonitoring();
    }

    setupConnectionMonitoring() {
        // ネットワーク状態監視
        window.addEventListener('online', () => {
            console.log('🟢 ネットワーク接続復旧');
            this.isOnline = true;
            this.retryAttempts = 0;
            this.showConnectionStatus('online');
        });

        window.addEventListener('offline', () => {
            console.log('🔴 ネットワーク接続断');
            this.isOnline = false;
            this.showConnectionStatus('offline');
        });

        // 定期的な接続チェック
        setInterval(async () => {
            await this.checkConnection();
        }, 30000); // 30秒ごと
    }

    async checkConnection() {
        try {
            // 簡単なヘルスチェック
            await fetch('/api/health', { 
                method: 'GET',
                timeout: 5000 
            });
            
            if (!this.isOnline) {
                console.log('🟢 サーバー接続復旧');
                this.isOnline = true;
                this.retryAttempts = 0;
                this.showConnectionStatus('online');
            }
        } catch (error) {
            if (this.isOnline) {
                console.log('🔴 サーバー接続エラー');
                this.isOnline = false;
                this.showConnectionStatus('offline');
            }
        }
    }

    showConnectionStatus(status) {
        const statusBar = document.querySelector('.connection-status');
        if (!statusBar) {
            // ステータスバーが存在しない場合は作成
            const newStatusBar = document.createElement('div');
            newStatusBar.className = 'connection-status';
            document.body.appendChild(newStatusBar);
        }

        const statusElement = document.querySelector('.connection-status');
        
        if (status === 'online') {
            statusElement.innerHTML = '🟢 接続中';
            statusElement.className = 'connection-status online';
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 3000);
        } else {
            statusElement.innerHTML = '🔴 接続エラー - オフラインモード';
            statusElement.className = 'connection-status offline';
            statusElement.style.display = 'block';
        }
    }

    async executeWithRetry(apiCall) {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                return await apiCall();
            } catch (error) {
                if (attempt === this.maxRetries) {
                    console.error('API呼び出し失敗（最大試行回数に達しました）:', error);
                    throw error;
                }
                
                console.warn(`API呼び出し失敗 (試行 ${attempt}/${this.maxRetries}):`, error);
                
                // 指数バックオフ
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
}

// データキャッシュ機能
class DataCache {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5分
    }

    set(key, data, ttl = this.defaultTTL) {
        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + ttl);
    }

    get(key) {
        if (!this.cache.has(key)) {
            return null;
        }

        const expiry = this.cacheExpiry.get(key);
        if (Date.now() > expiry) {
            this.cache.delete(key);
            this.cacheExpiry.delete(key);
            return null;
        }

        return this.cache.get(key);
    }

    clear() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }

    has(key) {
        return this.cache.has(key) && Date.now() <= this.cacheExpiry.get(key);
    }
}

// 統合API管理クラス
class DataManager {
    constructor() {
        this.apiClient = new ApiClient();
        this.connectionManager = new ConnectionManager(this.apiClient);
        this.cache = new DataCache();
    }

    async getProjectsWithCache(filters = {}) {
        const cacheKey = `projects_${JSON.stringify(filters)}`;
        
        // キャッシュから取得を試行
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
            console.log('📦 キャッシュからデータを取得');
            return cachedData;
        }

        try {
            // APIから取得
            const data = await this.connectionManager.executeWithRetry(
                () => this.apiClient.getProjects(filters)
            );
            
            // キャッシュに保存
            this.cache.set(cacheKey, data);
            console.log('🌐 APIからデータを取得');
            
            return data;
        } catch (error) {
            console.error('プロジェクトデータ取得エラー:', error);
            
            // オフライン時はダミーデータを返す
            if (!this.connectionManager.isOnline) {
                console.log('📱 オフラインモード - ダミーデータを使用');
                return this.getOfflineProjects();
            }
            
            throw error;
        }
    }

    async getStatisticsWithCache() {
        const cacheKey = 'statistics';
        
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        try {
            const data = await this.connectionManager.executeWithRetry(
                () => this.apiClient.getStatistics()
            );
            
            this.cache.set(cacheKey, data, 2 * 60 * 1000); // 2分キャッシュ
            return data;
        } catch (error) {
            console.error('統計データ取得エラー:', error);
            return this.getOfflineStatistics();
        }
    }

    async getAlertsWithCache() {
        const cacheKey = 'alerts';
        
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        try {
            const data = await this.connectionManager.executeWithRetry(
                () => this.apiClient.getAlerts()
            );
            
            this.cache.set(cacheKey, data, 1 * 60 * 1000); // 1分キャッシュ
            return data;
        } catch (error) {
            console.error('アラートデータ取得エラー:', error);
            return [];
        }
    }

    // オフライン時のフォールバックデータ
    getOfflineProjects() {
        return PROJECT_DATA || []; // 既存のダミーデータを使用
    }

    getOfflineStatistics() {
        return {
            supervisorStats: [],
            monthlyStats: []
        };
    }

    // キャッシュ無効化
    invalidateCache(pattern = null) {
        if (pattern) {
            // パターンに一致するキーのみ削除
            for (const key of this.cache.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.cache.delete(key);
                    this.cache.cacheExpiry.delete(key);
                }
            }
        } else {
            // 全キャッシュクリア
            this.cache.clear();
        }
    }
}

// グローバルインスタンス
const dataManager = new DataManager(); 