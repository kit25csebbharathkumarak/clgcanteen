const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Data file paths
const MENU_FILE = path.join(__dirname, 'data', 'menu.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// Helper functions to read/write JSON files
async function readMenu() {
  try {
    const data = await fs.readFile(MENU_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeMenu(menu) {
  await fs.writeFile(MENU_FILE, JSON.stringify(menu, null, 2));
}

async function readOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// API Routes

// Menu endpoints
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await readMenu();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read menu' });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const menu = await readMenu();
    const newId = menu.length > 0 ? Math.max(...menu.map(item => item.id)) + 1 : 1;
    const newItem = {
      id: newId,
      name: name.trim(),
      price: parseFloat(price)
    };

    menu.push(newItem);
    await writeMenu(menu);
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;

    const menu = await readMenu();
    const index = menu.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    if (name) menu[index].name = name.trim();
    if (price !== undefined) menu[index].price = parseFloat(price);

    await writeMenu(menu);
    res.json(menu[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const menu = await readMenu();
    const filteredMenu = menu.filter(item => item.id !== id);

    if (menu.length === filteredMenu.length) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    await writeMenu(filteredMenu);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Orders endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { items, customerName } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const menu = await readMenu();
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = menu.find(m => m.id === item.id);
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item with id ${item.id} not found` });
      }
      const subtotal = menuItem.price * item.quantity;
      total += subtotal;
      orderItems.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        subtotal: subtotal
      });
    }

    const orders = await readOrders();
    const orderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;

    const newOrder = {
      id: orderId,
      customerName: customerName || 'Customer',
      items: orderItems,
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    await writeOrders(orders);
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const orders = await readOrders();
    const index = orders.findIndex(order => order.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status) {
      orders[index].status = status;
    }

    await writeOrders(orders);
    res.json(orders[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// QR Code endpoint
app.get('/api/qrcode', async (req, res) => {
  try {
    const baseUrl = req.protocol + '://' + req.get('host');
    const customerUrl = `${baseUrl}/customer.html`;
    
    const qrCodeDataUrl = await QRCode.toDataURL(customerUrl);
    res.json({ 
      url: customerUrl,
      qrCode: qrCodeDataUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

