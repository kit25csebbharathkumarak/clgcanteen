// Orders Management JavaScript

let allOrders = [];
let filteredOrders = [];

// Load orders on page load
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    setupFilter();
    
    // Auto-refresh orders every 5 seconds
    setInterval(loadOrders, 5000);
});

// Load orders from localStorage
function loadOrders() {
    allOrders = DataManager.getOrders();
    // Sort by creation date (newest first)
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    applyFilter();
}

// Setup filter
function setupFilter() {
    const filter = document.getElementById('statusFilter');
    filter.addEventListener('change', applyFilter);
}

// Apply filter
function applyFilter() {
    const filterValue = document.getElementById('statusFilter').value;
    
    if (filterValue === 'all') {
        filteredOrders = allOrders;
    } else {
        filteredOrders = allOrders.filter(order => order.status === filterValue);
    }
    
    displayOrders();
}

// Display orders
function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<p class="empty-message">No orders found.</p>';
        return;
    }

    ordersList.innerHTML = filteredOrders.map(order => {
        const statusClass = order.status === 'completed' ? 'status-completed' : 'status-pending';
        const date = new Date(order.createdAt).toLocaleString();
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h3>Order #${order.id}</h3>
                        <p class="order-meta">${order.customerName} • ${date}</p>
                    </div>
                    <span class="status ${statusClass}">${order.status.toUpperCase()}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item-row">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>₹${item.subtotal.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        <strong>Total: ₹${order.total.toFixed(2)}</strong>
                    </div>
                    <div class="order-actions">
                        ${order.status === 'pending' ? 
                            `<button class="btn btn-complete" onclick="completeOrder(${order.id})">Mark as Completed</button>` : 
                            `<button class="btn btn-pending" onclick="pendingOrder(${order.id})">Mark as Pending</button>`
                        }
                        <button class="btn btn-bill" onclick="generateBill(${order.id})">Generate Bill</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Complete order
function completeOrder(id) {
    try {
        const updated = DataManager.updateOrderStatus(id, 'completed');
        if (updated) {
            loadOrders();
        } else {
            alert('Failed to update order status.');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        alert('Failed to update order status.');
    }
}

// Mark order as pending
function pendingOrder(id) {
    try {
        const updated = DataManager.updateOrderStatus(id, 'pending');
        if (updated) {
            loadOrders();
        } else {
            alert('Failed to update order status.');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        alert('Failed to update order status.');
    }
}

// Generate bill
function generateBill(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    // Create bill HTML
    const billHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Bill - Order #${order.id}</title>
            <style>
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
                body {
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                }
                .bill-header {
                    text-align: center;
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .bill-info {
                    margin-bottom: 20px;
                }
                .bill-items {
                    margin: 20px 0;
                }
                .bill-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                }
                .bill-total {
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 2px solid #333;
                    text-align: right;
                    font-size: 1.2em;
                }
                .btn-print {
                    background: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    cursor: pointer;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="bill-header">
                <h1>🍽️ CANTEEN BILL</h1>
            </div>
            <div class="bill-info">
                <p><strong>Order Number:</strong> #${order.id}</p>
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
            </div>
            <div class="bill-items">
                <h3>Items:</h3>
                ${order.items.map(item => `
                    <div class="bill-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>₹${item.subtotal.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="bill-total">
                <strong>Total Amount: ₹${order.total.toFixed(2)}</strong>
            </div>
            <div class="no-print">
                <button class="btn-print" onclick="window.print()">Print Bill</button>
            </div>
        </body>
        </html>
    `;

    // Open bill in new window
    const billWindow = window.open('', '_blank');
    billWindow.document.write(billHTML);
    billWindow.document.close();
}

