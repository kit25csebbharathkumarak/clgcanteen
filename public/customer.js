// Customer Page JavaScript

let menu = [];
let cart = [];

// Load menu on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    setupCart();
    setupOrderSubmission();
    setupModal();
});

// Load menu items from localStorage
function loadMenu() {
    menu = DataManager.getMenu();
    displayMenu();
}

// Display menu items
function displayMenu() {
    const menuList = document.getElementById('menuList');
    
    if (menu.length === 0) {
        menuList.innerHTML = '<p class="empty-message">No items available at the moment.</p>';
        return;
    }

    menuList.innerHTML = menu.map(item => {
        const cartItem = cart.find(c => c.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        return `
            <div class="menu-item">
                <div class="menu-item-info">
                    <h3>${item.name}</h3>
                    <p class="price">₹${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="btn-quantity" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="quantity">${quantity}</span>
                    <button class="btn-quantity" onclick="increaseQuantity(${item.id})">+</button>
                </div>
            </div>
        `;
    }).join('');
}

// Increase quantity
function increaseQuantity(itemId) {
    const item = menu.find(m => m.id === itemId);
    if (!item) return;

    const cartItem = cart.find(c => c.id === itemId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ id: itemId, quantity: 1 });
    }

    updateCart();
    displayMenu();
}

// Decrease quantity
function decreaseQuantity(itemId) {
    const cartItem = cart.find(c => c.id === itemId);
    if (!cartItem) return;

    cartItem.quantity--;
    if (cartItem.quantity <= 0) {
        cart = cart.filter(c => c.id !== itemId);
    }

    updateCart();
    displayMenu();
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const submitBtn = document.getElementById('submitOrderBtn');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        submitBtn.disabled = true;
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(cartItem => {
        const menuItem = menu.find(m => m.id === cartItem.id);
        const subtotal = menuItem.price * cartItem.quantity;
        total += subtotal;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${menuItem.name}</span>
                    <span class="cart-item-details">${cartItem.quantity} × ₹${menuItem.price.toFixed(2)}</span>
                </div>
                <span class="cart-item-subtotal">₹${subtotal.toFixed(2)}</span>
            </div>
        `;
    }).join('');

    cartTotal.textContent = total.toFixed(2);
    submitBtn.disabled = false;
}

// Setup cart
function setupCart() {
    updateCart();
}

// Setup order submission
function setupOrderSubmission() {
    const submitBtn = document.getElementById('submitOrderBtn');
    submitBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        const customerName = document.getElementById('customerName').value.trim() || 'Customer';
        
        try {
            const order = DataManager.addOrder(cart, customerName);
            showOrderConfirmation(order);
            cart = [];
            updateCart();
            displayMenu();
            document.getElementById('customerName').value = '';
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to place order: ' + error.message);
        }
    });
}

// Show order confirmation
function showOrderConfirmation(order) {
    const modal = document.getElementById('orderModal');
    const orderDetails = document.getElementById('orderDetails');
    const orderNumber = document.getElementById('orderNumber');

    orderNumber.textContent = order.id;
    
    orderDetails.innerHTML = `
        <div class="order-summary">
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>₹${item.subtotal.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <strong>Total: ₹${order.total.toFixed(2)}</strong>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

// Setup modal
function setupModal() {
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.close');
    const newOrderBtn = document.getElementById('newOrderBtn');

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    newOrderBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

