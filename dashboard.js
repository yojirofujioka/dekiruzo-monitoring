let charts = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setInterval(updateRealtimeData, 30000); // 30秒ごとに更新
});

async function initializeDashboard() {
    await loadKPIData();
    initializeCharts();
    loadRecentActivities();
}

async function loadKPIData() {
    try {
        const response = await fetch('/api/dashboard/kpi');
        const data = await response.json();
        
        document.getElementById('activeProjects').textContent = data.activeProjects || '24';
        document.getElementById('totalRevenue').textContent = formatCurrency(data.totalRevenue || 125000000);
        document.getElementById('profitMargin').textContent = (data.profitMargin || 18.5) + '%';
        document.getElementById('pendingIssues').textContent = data.pendingIssues || '3';
    } catch (error) {
        console.error('KPIデータの読み込みエラー:', error);
        // デモデータを表示
        document.getElementById('activeProjects').textContent = '24';
        document.getElementById('totalRevenue').textContent = '¥125,000,000';
        document.getElementById('profitMargin').textContent = '18.5%';
        document.getElementById('pendingIssues').textContent = '3';
    }
}

function formatCurrency(amount) {
    return '¥' + amount.toLocaleString('ja-JP');
}

function initializeCharts() {
    // 売上推移チャート
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    charts.revenue = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
                label: '売上高',
                data: [12000000, 15000000, 13500000, 18000000, 22000000, 25000000],
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '¥' + (value / 1000000) + 'M';
                        }
                    }
                }
            }
        }
    });

    // ステータス分布チャート
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    charts.status = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['進行中', '完了', '保留', '計画中'],
            datasets: [{
                data: [24, 45, 8, 12],
                backgroundColor: ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });

    // 工事種別チャート
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    charts.category = new Chart(categoryCtx, {
        type: 'bar',
        data: {
            labels: ['建築', '土木', '電気', '設備', 'その他'],
            datasets: [{
                label: '売上高',
                data: [45000000, 38000000, 22000000, 18000000, 12000000],
                backgroundColor: '#4CAF50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '¥' + (value / 1000000) + 'M';
                        }
                    }
                }
            }
        }
    });

    // 支払状況チャート
    const paymentCtx = document.getElementById('paymentChart').getContext('2d');
    charts.payment = new Chart(paymentCtx, {
        type: 'pie',
        data: {
            labels: ['入金済', '請求済', '未請求'],
            datasets: [{
                data: [65000000, 45000000, 25000000],
                backgroundColor: ['#4CAF50', '#FFC107', '#f44336']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            return label + ': ' + value;
                        }
                    }
                }
            }
        }
    });
}

async function loadRecentActivities() {
    try {
        const response = await fetch('/api/dashboard/activities');
        const activities = await response.json();
        
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <span class="activity-time">${formatTime(activity.timestamp)}</span>
                <span class="activity-text">${activity.message}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('活動履歴の読み込みエラー:', error);
    }
}

function formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 3600000) {
        return Math.floor(diff / 60000) + '分前';
    } else if (diff < 86400000) {
        return Math.floor(diff / 3600000) + '時間前';
    } else {
        return Math.floor(diff / 86400000) + '日前';
    }
}

function refreshDashboard() {
    const btn = document.querySelector('.btn-refresh');
    btn.disabled = true;
    btn.textContent = '更新中...';
    
    Promise.all([
        loadKPIData(),
        updateChartData(),
        loadRecentActivities()
    ]).then(() => {
        btn.disabled = false;
        btn.textContent = '🔄 更新';
        showNotification('ダッシュボードを更新しました', 'success');
    }).catch(error => {
        btn.disabled = false;
        btn.textContent = '🔄 更新';
        showNotification('更新に失敗しました', 'error');
    });
}

async function updateChartData() {
    const period = document.getElementById('periodSelect').value;
    
    try {
        const response = await fetch(`/api/dashboard/charts?period=${period}`);
        const data = await response.json();
        
        // チャートデータを更新
        if (data.revenue) {
            charts.revenue.data.labels = data.revenue.labels;
            charts.revenue.data.datasets[0].data = data.revenue.data;
            charts.revenue.update();
        }
        
        if (data.status) {
            charts.status.data.datasets[0].data = data.status.data;
            charts.status.update();
        }
        
        if (data.category) {
            charts.category.data.datasets[0].data = data.category.data;
            charts.category.update();
        }
        
        if (data.payment) {
            charts.payment.data.datasets[0].data = data.payment.data;
            charts.payment.update();
        }
    } catch (error) {
        console.error('チャートデータの更新エラー:', error);
    }
}

function updateRealtimeData() {
    // リアルタイムデータの更新（WebSocket実装後はこちらを使用）
    loadKPIData();
    loadRecentActivities();
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 期間選択の変更イベント
document.getElementById('periodSelect').addEventListener('change', function() {
    updateChartData();
});