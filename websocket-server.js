const { Server } = require('socket.io');

class WebSocketServer {
    constructor(httpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.clients = new Map();
        this.initializeHandlers();
    }
    
    initializeHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`🔌 新規WebSocket接続: ${socket.id}`);
            
            // クライアント情報を保存
            this.clients.set(socket.id, {
                connectedAt: new Date(),
                lastActivity: new Date()
            });
            
            // 接続確立通知
            socket.emit('connected', {
                message: 'WebSocket接続が確立されました',
                socketId: socket.id,
                timestamp: new Date()
            });
            
            // ルームへの参加
            socket.on('join-room', (room) => {
                socket.join(room);
                console.log(`📍 ${socket.id} が ${room} に参加`);
            });
            
            // ルームからの退出
            socket.on('leave-room', (room) => {
                socket.leave(room);
                console.log(`📤 ${socket.id} が ${room} から退出`);
            });
            
            // 通知購読
            socket.on('subscribe-notifications', (types) => {
                const client = this.clients.get(socket.id);
                if (client) {
                    client.subscriptions = types;
                }
            });
            
            // 切断処理
            socket.on('disconnect', () => {
                console.log(`🔌 WebSocket切断: ${socket.id}`);
                this.clients.delete(socket.id);
            });
            
            // Ping/Pong
            socket.on('ping', () => {
                socket.emit('pong', { timestamp: new Date() });
            });
        });
    }
    
    // 全クライアントへの通知送信
    broadcast(event, data) {
        this.io.emit(event, {
            ...data,
            timestamp: new Date()
        });
    }
    
    // 特定のルームへの通知送信
    broadcastToRoom(room, event, data) {
        this.io.to(room).emit(event, {
            ...data,
            timestamp: new Date()
        });
    }
    
    // 個別クライアントへの通知送信
    sendToClient(socketId, event, data) {
        this.io.to(socketId).emit(event, {
            ...data,
            timestamp: new Date()
        });
    }
    
    // 通知タイプ別配信
    sendNotification(type, data) {
        switch (type) {
            case 'project-update':
                this.broadcastToRoom('projects', 'notification', {
                    type,
                    title: 'プロジェクト更新',
                    ...data
                });
                break;
                
            case 'verification-complete':
                this.broadcastToRoom('verification', 'notification', {
                    type,
                    title: '照合完了',
                    ...data
                });
                break;
                
            case 'file-upload':
                this.broadcastToRoom('files', 'notification', {
                    type,
                    title: 'ファイルアップロード',
                    ...data
                });
                break;
                
            case 'alert':
                this.broadcast('alert', {
                    type,
                    title: 'アラート',
                    priority: data.priority || 'medium',
                    ...data
                });
                break;
                
            default:
                this.broadcast('notification', {
                    type,
                    ...data
                });
        }
    }
    
    // システム通知送信
    sendSystemNotification(message, type = 'info') {
        this.broadcast('system-notification', {
            message,
            type,
            timestamp: new Date()
        });
    }
    
    // アクティビティログ配信
    sendActivityLog(activity) {
        this.broadcastToRoom('activities', 'activity-log', {
            ...activity,
            timestamp: new Date()
        });
    }
    
    // リアルタイムデータ更新
    sendDataUpdate(dataType, data) {
        this.broadcast('data-update', {
            dataType,
            data,
            timestamp: new Date()
        });
    }
    
    // 接続状態取得
    getConnectionStats() {
        return {
            totalConnections: this.clients.size,
            connections: Array.from(this.clients.entries()).map(([id, info]) => ({
                id,
                connectedAt: info.connectedAt,
                lastActivity: info.lastActivity,
                subscriptions: info.subscriptions || []
            }))
        };
    }
}

module.exports = WebSocketServer;