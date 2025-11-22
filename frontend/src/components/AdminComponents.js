// AdminComponents.js - Reusable components for Admin Dashboard

export function createDashboard(stats) {
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Today's Sales</h3>
                <div class="value">₹${stats.todaySales?.amount || 0}</div>
                <small>${stats.todaySales?.count || 0} bills</small>
            </div>
            <div class="stat-card success">
                <h3>Total Products</h3>
                <div class="value">${stats.productStats?.total || 0}</div>
                <small>${stats.productStats?.total_stock || 0} in stock</small>
            </div>
            <div class="stat-card warning">
                <h3>Low Stock Alert</h3>
                <div class="value">${stats.lowStock?.count || 0}</div>
                <small>Products need restocking</small>
            </div>
            <div class="stat-card danger">
                <h3>Today's Fraud</h3>
                <div class="value">${stats.todayFraud?.count || 0}</div>
                <small>Attempts detected</small>
            </div>
        </div>

        <div class="dashboard-cards">
            <div class="card">
                <h3>🚨 Recent Fraud Attempts</h3>
                <div class="fraud-list">
                    ${(stats.recentFraud || []).map(fraud => `
                        <div class="fraud-item">
                            <div class="fraud-type ${fraud.action_type}">${formatActionType(fraud.action_type)}</div>
                            <div class="fraud-details">
                                <strong>${fraud.cashier_name}</strong> - ${fraud.product_name || 'N/A'}
                                <br>
                                <small>${getFraudDescription(fraud)}</small>
                            </div>
                            <div class="fraud-time">${new Date(fraud.created_at).toLocaleTimeString()}</div>
                        </div>
                    `).join('')}
                    ${(!stats.recentFraud || stats.recentFraud.length === 0) ? 
                        '<p class="text-center">🎉 No fraud attempts detected today!</p>' : ''}
                </div>
            </div>

            <div class="card">
                <h3>⚡ Quick Actions</h3>
                <div class="quick-actions">
                    <button class="btn btn-primary" onclick="admin.switchView('products')">
                        📦 Manage Products
                    </button>
                    <button class="btn btn-warning" onclick="admin.switchView('fraud')">
                        🚨 View Fraud Logs
                    </button>
                    <button class="btn btn-success" onclick="admin.switchView('billing')">
                        🧾 View Bills
                    </button>
                    <button class="btn btn-info" onclick="admin.loadReports()">
                        📈 Generate Reports
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function createProductsView(products) {
    return `
        <div class="table-header">
            <h2>📦 Product Management</h2>
            <div class="header-actions">
                <button class="btn btn-primary" id="addProductBtn">
                    + Add New Product
                </button>
                <button class="btn btn-success" id="refreshProducts">
                    🔄 Refresh
                </button>
            </div>
        </div>
        
        <div class="products-grid" id="productsGrid">
            ${products.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-header">
                        <h3>${product.name}</h3>
                        <span class="product-category">${product.category}</span>
                    </div>
                    <div class="product-price">₹${product.price}</div>
                    <div class="product-stock ${product.stock_quantity <= product.min_stock_alert ? 'low-stock' : ''}">
                        📦 Stock: ${product.stock_quantity}
                        ${product.stock_quantity <= product.min_stock_alert ? ' ⚠️' : ''}
                    </div>
                    <div class="product-gst">💰 GST: ${product.gst_rate}%</div>
                    ${product.description ? `<div class="product-description">${product.description}</div>` : ''}
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm edit-product" data-id="${product.id}">
                            ✏️ Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-product" data-id="${product.id}">
                            🗑️ Delete
                        </button>
                        <button class="btn btn-warning btn-sm update-stock" data-id="${product.id}">
                            📊 Update Stock
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>

        ${products.length === 0 ? `
            <div class="empty-state">
                <h3>📦 No Products Found</h3>
                <p>Get started by adding your first product to the inventory.</p>
                <button class="btn btn-primary" id="addFirstProduct">+ Add First Product</button>
            </div>
        ` : ''}
    `;
}

export function createBillingView(bills) {
    return `
        <div class="table-container">
            <div class="table-header">
                <h2>🧾 Bill History</h2>
                <div class="header-actions">
                    <button class="btn btn-success" id="exportBills">
                        📤 Export to CSV
                    </button>
                </div>
            </div>
            
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Bill Number</th>
                            <th>Cashier</th>
                            <th>Total Amount</th>
                            <th>Discount</th>
                            <th>Tax</th>
                            <th>Final Amount</th>
                            <th>Payment Method</th>
                            <th>Date & Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bills.map(bill => `
                            <tr>
                                <td>
                                    <strong>${bill.bill_number}</strong>
                                    ${bill.fraud_detected ? '<span class="fraud-indicator" title="Fraud detected in this bill">🚨</span>' : ''}
                                </td>
                                <td>${bill.cashier_name}</td>
                                <td>₹${bill.total_amount}</td>
                                <td>₹${bill.discount_amount}</td>
                                <td>₹${bill.tax_amount}</td>
                                <td><strong>₹${bill.final_amount}</strong></td>
                                <td>
                                    <span class="payment-method ${bill.payment_method}">
                                        ${formatPaymentMethod(bill.payment_method)}
                                    </span>
                                </td>
                                <td>${new Date(bill.created_at).toLocaleString()}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn btn-primary btn-sm view-bill" data-id="${bill.id}" title="View Bill Details">
                                            👁️ View
                                        </button>
                                        <button class="btn btn-info btn-sm print-bill" data-id="${bill.id}" title="Print Bill">
                                            🖨️ Print
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            ${bills.length === 0 ? `
                <div class="empty-state">
                    <h3>🧾 No Bills Found</h3>
                    <p>No bills have been generated yet. Cashiers can start creating bills from their dashboard.</p>
                </div>
            ` : ''}
        </div>
    `;
}

export function createFraudView(stats, logs) {
    return `
        <div class="fraud-header">
            <h2>🚨 Fraud Detection Dashboard</h2>
            <p>Real-time monitoring of suspicious activities and fraud attempts</p>
        </div>

        <!-- Fraud Overview Cards -->
        <div class="stats-grid">
            <div class="stat-card danger">
                <h3>Total Fraud Attempts</h3>
                <div class="value">${stats.actionStats?.reduce((sum, stat) => sum + stat.count, 0) || 0}</div>
                <small>All time detected</small>
            </div>
            
            ${(stats.actionStats || []).map(stat => `
                <div class="stat-card warning">
                    <h3>${formatActionType(stat.action_type)}</h3>
                    <div class="value">${stat.count}</div>
                    <small>Attempts</small>
                </div>
            `).join('')}
            
            <div class="stat-card info">
                <h3>Monitored Cashiers</h3>
                <div class="value">${stats.cashierStats?.length || 0}</div>
                <small>Active cashiers</small>
            </div>
        </div>

        <!-- Cashier Fraud Statistics -->
        <div class="table-container mt-20">
            <div class="table-header">
                <h2>👥 Cashier Fraud Statistics</h2>
                <button class="btn btn-primary" id="refreshCashierStats">
                    🔄 Refresh
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Cashier Name</th>
                        <th>Total Fraud Attempts</th>
                        <th>Most Common Fraud Type</th>
                        <th>Last Activity</th>
                        <th>Risk Level</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${(stats.cashierStats || []).map(cashier => `
                        <tr>
                            <td>
                                <div class="cashier-info">
                                    <strong>${cashier.cashier_name}</strong>
                                </div>
                            </td>
                            <td>
                                <span class="fraud-count ${getRiskLevel(cashier.fraud_count)}">
                                    ${cashier.fraud_count} attempts
                                </span>
                            </td>
                            <td>${cashier.most_common_type ? formatActionType(cashier.most_common_type) : 'None'}</td>
                            <td>${cashier.last_activity || 'No activity'}</td>
                            <td>
                                <span class="risk-badge ${getRiskLevel(cashier.fraud_count)}">
                                    ${getRiskLevel(cashier.fraud_count).toUpperCase()}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-primary btn-sm view-cashier-details" 
                                        data-cashier-id="${cashier.id}">
                                    📊 Details
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Detailed Fraud Logs -->
        <div class="table-container mt-20">
            <div class="table-header">
                <h2>📋 Detailed Fraud Logs</h2>
                <div class="header-actions">
                    <button class="btn btn-success" id="exportFraudLogs">
                        📤 Export Logs
                    </button>
                    <button class="btn btn-primary" id="refreshFraudLogs">
                        🔄 Refresh
                    </button>
                </div>
            </div>
            
            <div class="table-filters">
                <select id="filterActionType" class="filter-select">
                    <option value="">All Action Types</option>
                    <option value="price_edit">Price Edit</option>
                    <option value="excess_discount">Excess Discount</option>
                    <option value="stock_bypass">Stock Bypass</option>
                    <option value="invalid_quantity">Invalid Quantity</option>
                </select>
                
                <select id="filterCashier" class="filter-select">
                    <option value="">All Cashiers</option>
                    ${(stats.cashierStats || []).map(cashier => `
                        <option value="${cashier.id}">${cashier.cashier_name}</option>
                    `).join('')}
                </select>
                
                <input type="date" id="filterDate" class="filter-select" placeholder="Filter by date">
            </div>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Cashier</th>
                            <th>Action Type</th>
                            <th>Product</th>
                            <th>Details</th>
                            <th>Bill Number</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logs.map(log => `
                            <tr class="fraud-log-row ${log.action_type}">
                                <td>
                                    <div class="timestamp">
                                        <div class="date">${new Date(log.created_at).toLocaleDateString()}</div>
                                        <div class="time">${new Date(log.created_at).toLocaleTimeString()}</div>
                                    </div>
                                </td>
                                <td>
                                    <strong>${log.cashier_name}</strong>
                                </td>
                                <td>
                                    <span class="fraud-type-badge ${log.action_type}">
                                        ${formatActionType(log.action_type)}
                                    </span>
                                </td>
                                <td>${log.product_name || 'N/A'}</td>
                                <td>
                                    <div class="fraud-details-expanded">
                                        <div class="detail-row">
                                            <span class="label">Original:</span>
                                            <span class="value">${log.original_value || 'N/A'}</span>
                                        </div>
                                        <div class="detail-row">
                                            <span class="label">Modified:</span>
                                            <span class="value modified">${log.modified_value || 'N/A'}</span>
                                        </div>
                                        <div class="detail-row">
                                            <span class="label">Expected:</span>
                                            <span class="value expected">${log.expected_value || 'N/A'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>${log.bill_number || 'N/A'}</td>
                                <td>
                                    <code class="ip-address">${log.ip_address || 'N/A'}</code>
                                </td>
                            </tr>
                        `).join('')}
                        
                        ${logs.length === 0 ? `
                            <tr>
                                <td colspan="7" class="text-center">
                                    <div class="empty-state">
                                        <h3>🎉 No Fraud Detected!</h3>
                                        <p>Great! No suspicious activities have been detected yet.</p>
                                    </div>
                                </td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

export function createReportsView() {
    return `
        <div class="reports-header">
            <h2>📈 Reports & Analytics</h2>
            <p>Generate detailed reports and analyze business performance</p>
        </div>

        <div class="reports-grid">
            <div class="report-card">
                <div class="report-icon">💰</div>
                <h3>Sales Reports</h3>
                <p>Generate detailed sales reports by date range, product category, or cashier performance</p>
                <div class="report-actions">
                    <button class="btn btn-primary" onclick="generateSalesReport()">
                        Generate Report
                    </button>
                    <button class="btn btn-outline" onclick="viewSalesAnalytics()">
                        View Analytics
                    </button>
                </div>
            </div>

            <div class="report-card">
                <div class="report-icon">📦</div>
                <h3>Inventory Report</h3>
                <p>Current stock status, low stock alerts, and inventory movement analysis</p>
                <div class="report-actions">
                    <button class="btn btn-success" onclick="generateInventoryReport()">
                        Generate Report
                    </button>
                    <button class="btn btn-outline" onclick="viewLowStock()">
                        Low Stock Alert
                    </button>
                </div>
            </div>

            <div class="report-card">
                <div class="report-icon">🚨</div>
                <h3>Fraud Analysis</h3>
                <p>Detailed fraud patterns, cashier behavior analysis, and risk assessment</p>
                <div class="report-actions">
                    <button class="btn btn-warning" onclick="generateFraudReport()">
                        Generate Report
                    </button>
                    <button class="btn btn-outline" onclick="viewFraudPatterns()">
                        View Patterns
                    </button>
                </div>
            </div>

            <div class="report-card">
                <div class="report-icon">👥</div>
                <h3>Cashier Performance</h3>
                <p>Cashier sales performance, activity logs, and efficiency metrics</p>
                <div class="report-actions">
                    <button class="btn btn-info" onclick="generateCashierReport()">
                        Generate Report
                    </button>
                    <button class="btn btn-outline" onclick="viewCashierRanking()">
                        View Ranking
                    </button>
                </div>
            </div>

            <div class="report-card">
                <div class="report-icon">📊</div>
                <h3>Financial Summary</h3>
                <p>Revenue analysis, tax reports, profit margins, and financial overview</p>
                <div class="report-actions">
                    <button class="btn btn-primary" onclick="generateFinancialReport()">
                        Generate Report
                    </button>
                    <button class="btn btn-outline" onclick="viewRevenueChart()">
                        View Charts
                    </button>
                </div>
            </div>

            <div class="report-card">
                <div class="report-icon">🕒</div>
                <h3>Time-based Analytics</h3>
                <p>Peak hours analysis, seasonal trends, and time-based performance metrics</p>
                <div class="report-actions">
                    <button class="btn btn-success" onclick="generateTimeReport()">
                        Generate Report
                    </button>
                    <button class="btn btn-outline" onclick="viewTrends()">
                        View Trends
                    </button>
                </div>
            </div>
        </div>

        <!-- Report Configuration -->
        <div class="report-configuration mt-20">
            <div class="card">
                <h3>⚙️ Report Configuration</h3>
                <div class="config-options">
                    <div class="config-group">
                        <label>Date Range:</label>
                        <div class="date-inputs">
                            <input type="date" id="reportStartDate" class="form-control">
                            <span>to</span>
                            <input type="date" id="reportEndDate" class="form-control">
                        </div>
                    </div>
                    
                    <div class="config-group">
                        <label>Report Format:</label>
                        <select id="reportFormat" class="form-control">
                            <option value="pdf">PDF Document</option>
                            <option value="excel">Excel Spreadsheet</option>
                            <option value="csv">CSV File</option>
                            <option value="html">Web Page</option>
                        </select>
                    </div>
                    
                    <div class="config-group">
                        <label>Include Charts:</label>
                        <input type="checkbox" id="includeCharts" checked>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Utility Functions
function formatActionType(actionType) {
    const typeMap = {
        'price_edit': '💰 Price Edit',
        'excess_discount': '🎫 Excess Discount',
        'stock_bypass': '📦 Stock Bypass',
        'invalid_quantity': '❌ Invalid Quantity',
        'product_update': '✏️ Product Update'
    };
    return typeMap[actionType] || actionType;
}

function formatPaymentMethod(method) {
    const methodMap = {
        'cash': '💵 Cash',
        'card': '💳 Card',
        'upi': '📱 UPI'
    };
    return methodMap[method] || method;
}

function getFraudDescription(fraud) {
    switch(fraud.action_type) {
        case 'price_edit':
            return `Price changed from ₹${fraud.original_value} to ₹${fraud.modified_value}`;
        case 'excess_discount':
            return `Applied ${fraud.modified_value}% discount (max ${fraud.expected_value}%)`;
        case 'stock_bypass':
            return `Ordered ${fraud.modified_value} units (stock: ${fraud.original_value})`;
        case 'invalid_quantity':
            return `Invalid quantity: ${fraud.modified_value}`;
        default:
            return `${fraud.original_value} → ${fraud.modified_value}`;
    }
}

function getRiskLevel(fraudCount) {
    if (fraudCount === 0) return 'low';
    if (fraudCount <= 2) return 'medium';
    if (fraudCount <= 5) return 'high';
    return 'critical';
}

// Global functions for button actions (would be implemented in AdminDashboard)
window.generateSalesReport = function() {
    alert('Sales report generation would be implemented here');
};

window.generateInventoryReport = function() {
    alert('Inventory report generation would be implemented here');
};

window.generateFraudReport = function() {
    alert('Fraud report generation would be implemented here');
};

window.generateCashierReport = function() {
    alert('Cashier report generation would be implemented here');
};

window.generateFinancialReport = function() {
    alert('Financial report generation would be implemented here');
};

window.generateTimeReport = function() {
    alert('Time-based report generation would be implemented here');
};

window.viewSalesAnalytics = function() {
    alert('Sales analytics view would be implemented here');
};

window.viewLowStock = function() {
    alert('Low stock view would be implemented here');
};

window.viewFraudPatterns = function() {
    alert('Fraud patterns view would be implemented here');
};

window.viewCashierRanking = function() {
    alert('Cashier ranking view would be implemented here');
};

window.viewRevenueChart = function() {
    alert('Revenue chart view would be implemented here');
};

window.viewTrends = function() {
    alert('Trends view would be implemented here');
};