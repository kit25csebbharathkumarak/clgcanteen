// Owner Dashboard JavaScript

let editingItemId = null;

// Load menu on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    setupForm();
    setupQRCode();
});

// Load menu items from localStorage
function loadMenu() {
    const menu = DataManager.getMenu();
    displayMenu(menu);
}

// Display menu items
function displayMenu(menu) {
    const menuList = document.getElementById('menuList');
    
    if (menu.length === 0) {
        menuList.innerHTML = '<p class="empty-message">No menu items yet. Add your first item above!</p>';
        return;
    }

    menuList.innerHTML = menu.map(item => `
        <div class="menu-item">
            <div class="menu-item-info">
                <h3>${item.name}</h3>
                <p class="price">₹${item.price.toFixed(2)}</p>
            </div>
            <div class="menu-item-actions">
                <button class="btn btn-edit" onclick="editItem(${item.id}, '${item.name}', ${item.price})">Edit</button>
                <button class="btn btn-delete" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Setup form handlers
function setupForm() {
    const form = document.getElementById('foodForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveItem();
    });

    cancelBtn.addEventListener('click', () => {
        resetForm();
    });
}

// Save item (add or update)
function saveItem() {
    const name = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);

    try {
        if (editingItemId) {
            // Update existing item
            const updated = DataManager.updateMenuItem(editingItemId, name, price);
            if (updated) {
                loadMenu();
                resetForm();
            } else {
                alert('Failed to update item. Please try again.');
            }
        } else {
            // Add new item
            DataManager.addMenuItem(name, price);
            loadMenu();
            resetForm();
        }
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item. Please try again.');
    }
}

// Edit item
function editItem(id, name, price) {
    editingItemId = id;
    document.getElementById('itemId').value = id;
    document.getElementById('itemName').value = name;
    document.getElementById('itemPrice').value = price;
    document.getElementById('formTitle').textContent = 'Edit Food Item';
    document.getElementById('submitBtn').textContent = 'Update Item';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    document.getElementById('itemName').focus();
}

// Delete item
function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        const deleted = DataManager.deleteMenuItem(id);
        if (deleted) {
            loadMenu();
        } else {
            alert('Failed to delete item. Please try again.');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
    }
}

// Reset form
function resetForm() {
    editingItemId = null;
    document.getElementById('foodForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Food Item';
    document.getElementById('submitBtn').textContent = 'Add Item';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Setup QR Code generation
function setupQRCode() {
    const generateBtn = document.getElementById('generateQRBtn');
    const downloadBtn = document.getElementById('downloadQRBtn');
    
    generateBtn.addEventListener('click', () => {
        try {
            // Get current page URL and change to customer.html
            let customerUrl;
            const currentUrl = window.location.href;
            
            // Handle both file:// and http:// protocols
            if (currentUrl.startsWith('file://')) {
                // For file:// protocol, use the full path
                const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
                customerUrl = baseUrl + '/customer.html';
            } else {
                // For http:// or https://, use relative URL
                const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
                customerUrl = baseUrl + '/customer.html';
            }
            
            // Generate QR code using QRCode library
            QRCode.toDataURL(customerUrl, {
                width: 300,
                margin: 2,
                errorCorrectionLevel: 'M'
            }, (err, url) => {
                if (err) {
                    console.error('Error generating QR code:', err);
                    alert('Failed to generate QR code. Please try again.');
                    return;
                }
                
                document.getElementById('qrImage').src = url;
                document.getElementById('qrUrl').textContent = customerUrl;
                document.getElementById('qrDisplay').classList.remove('hidden');
            });
        } catch (error) {
            console.error('Error generating QR code:', error);
            alert('Failed to generate QR code. Please try again.');
        }
    });

    downloadBtn.addEventListener('click', () => {
        const qrImage = document.getElementById('qrImage');
        if (!qrImage.src || qrImage.src === '') {
            alert('Please generate QR code first.');
            return;
        }
        const link = document.createElement('a');
        link.download = 'canteen-qr-code.png';
        link.href = qrImage.src;
        link.click();
    });
}

