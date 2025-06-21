class WebSocketClient {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.handlers = new Map();
        this.connect();
    }
    
    connect() {
        if (this.socket && this.connected) {
            console.log('WebSocket already connected');
            return;
        }
        
        // Socket.IOクライアントライブラリをロード
        if (typeof io === 'undefined') {
            console.error('Socket.IO client library not loaded');
            return;
        }
        
        const wsUrl = window.location.origin;
        this.socket = io(wsUrl, {
            reconnection: true,
            reconnectionDelay: this.reconnectDelay,
            reconnectionAttempts: this.maxReconnectAttempts
        });
        
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        // 接続イベント
        this.socket.on('connect', () => {
            console.log('✅ WebSocket接続成功');
            this.connected = true;
            this.reconnectAttempts = 0;
            this.showNotification('リアルタイム通知が有効になりました', 'success');
            
            // デフォルトのルームに参加
            this.joinRoom('activities');
            this.joinRoom('projects');
            this.joinRoom('verification');
            this.joinRoom('files');
            
            // 通知タイプを購読
            this.subscribeNotifications(['all']);
        });
        
        // 切断イベント
        this.socket.on('disconnect', () => {
            console.log('❌ WebSocket切断');
            this.connected = false;
            this.showNotification('リアルタイム接続が切断されました', 'error');
        });
        
        // エラーイベント
        this.socket.on('error', (error) => {
            console.error('WebSocketエラー:', error);
        });
        
        // 通知イベント
        this.socket.on('notification', (data) => {
            this.handleNotification(data);
        });
        
        // システム通知
        this.socket.on('system-notification', (data) => {
            this.showNotification(data.message, data.type);
        });
        
        // アラート
        this.socket.on('alert', (data) => {
            this.handleAlert(data);
        });
        
        // アクティビティログ
        this.socket.on('activity-log', (data) => {
            this.handleActivityLog(data);
        });
        
        // データ更新
        this.socket.on('data-update', (data) => {
            this.handleDataUpdate(data);
        });
        
        // Pong応答
        this.socket.on('pong', () => {
            this.lastPong = new Date();
        });
        
        // 定期的なPing送信
        setInterval(() => {
            if (this.connected) {
                this.socket.emit('ping');
            }
        }, 30000);
    }
    
    // ルームに参加
    joinRoom(room) {
        if (this.connected) {
            this.socket.emit('join-room', room);
        }
    }
    
    // ルームから退出
    leaveRoom(room) {
        if (this.connected) {
            this.socket.emit('leave-room', room);
        }
    }
    
    // 通知購読
    subscribeNotifications(types) {
        if (this.connected) {
            this.socket.emit('subscribe-notifications', types);
        }
    }
    
    // 通知処理
    handleNotification(data) {
        console.log('📬 通知受信:', data);
        
        const notification = {
            title: data.title || '通知',
            message: data.message || '',
            type: data.type || 'info',
            timestamp: new Date(data.timestamp)
        };
        
        // UI更新
        this.updateNotificationUI(notification);
        
        // ブラウザ通知（許可されている場合）
        if (Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/favicon.ico',
                tag: data.type
            });
        }
    }
    
    // アラート処理
    handleAlert(data) {
        console.log('🚨 アラート受信:', data);
        
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${data.priority || 'medium'} alert-dismissible`;
        alertElement.innerHTML = `
            <strong>${data.title || 'アラート'}</strong>
            <p>${data.message}</p>
            <span class="alert-time">${new Date(data.timestamp).toLocaleTimeString()}</span>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            alertContainer.insertBefore(alertElement, alertContainer.firstChild);
        }
    }
    
    // アクティビティログ処理
    handleActivityLog(data) {
        console.log('📋 アクティビティ:', data);
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item new';
        activityItem.innerHTML = `
            <span class="activity-time">${this.formatTime(data.timestamp)}</span>
            <span class="activity-text">${data.message}</span>
        `;
        
        const activityList = document.getElementById('activityList');
        if (activityList) {
            activityList.insertBefore(activityItem, activityList.firstChild);
            
            // 古いアイテムを削除（最大20件）
            while (activityList.children.length > 20) {
                activityList.removeChild(activityList.lastChild);
            }
            
            // アニメーション後にクラスを削除
            setTimeout(() => {
                activityItem.classList.remove('new');
            }, 1000);
        }
    }
    
    // データ更新処理
    handleDataUpdate(data) {
        console.log('🔄 データ更新:', data.dataType);
        
        // データタイプに応じた処理
        switch (data.dataType) {
            case 'kpi':
                this.updateKPIData(data.data);
                break;
            case 'projects':
                this.updateProjectList(data.data);
                break;
            case 'verification':
                this.updateVerificationStatus(data.data);
                break;
            default:
                console.log('未知のデータタイプ:', data.dataType);
        }
    }
    
    // KPIデータ更新
    updateKPIData(data) {
        if (data.activeProjects !== undefined) {
            const element = document.getElementById('activeProjects');
            if (element) element.textContent = data.activeProjects;
        }
        
        if (data.totalRevenue !== undefined) {
            const element = document.getElementById('totalRevenue');
            if (element) element.textContent = this.formatCurrency(data.totalRevenue);
        }
        
        if (data.profitMargin !== undefined) {
            const element = document.getElementById('profitMargin');
            if (element) element.textContent = data.profitMargin + '%';
        }
        
        if (data.pendingIssues !== undefined) {
            const element = document.getElementById('pendingIssues');
            if (element) element.textContent = data.pendingIssues;
        }
    }
    
    // 通知表示
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(notification);
        
        // 自動削除
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // 通知UI更新
    updateNotificationUI(notification) {
        const notificationBadge = document.getElementById('notification-badge');
        if (notificationBadge) {
            const count = parseInt(notificationBadge.textContent || '0') + 1;
            notificationBadge.textContent = count;
            notificationBadge.style.display = 'inline-block';
        }
    }
    
    // 時刻フォーマット
    formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        if (diff < 60000) {
            return '今';
        } else if (diff < 3600000) {
            return Math.floor(diff / 60000) + '分前';
        } else if (diff < 86400000) {
            return Math.floor(diff / 3600000) + '時間前';
        } else {
            return time.toLocaleDateString('ja-JP');
        }
    }
    
    // 金額フォーマット
    formatCurrency(amount) {
        return '¥' + amount.toLocaleString('ja-JP');
    }
    
    // カスタムイベントハンドラ登録
    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event).push(handler);
        
        if (this.socket) {
            this.socket.on(event, handler);
        }
    }
    
    // イベント送信
    emit(event, data) {
        if (this.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('WebSocket未接続: イベント送信できません');
        }
    }
    
    // 切断
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }
}

// グローバルインスタンス作成
let wsClient = null;

// ページロード時に初期化
document.addEventListener('DOMContentLoaded', () => {
    // Socket.IOクライアントライブラリをロード
    const script = document.createElement('script');
    script.src = '/socket.io/socket.io.js';
    script.onload = () => {
        wsClient = new WebSocketClient();
        window.wsClient = wsClient;
    };
    document.head.appendChild(script);
});