// Client-side Data Manager using localStorage

const DataManager = {
    // Storage keys
    MENU_KEY: 'canteen_menu',
    ORDERS_KEY: 'canteen_orders',

    // Initialize with default data if empty
    init() {
        if (!localStorage.getItem(this.MENU_KEY)) {
            const defaultMenu = [
                { id: 1, name: 'Dosa', price: 25 },
                { id: 2, name: 'Idli', price: 20 },
                { id: 3, name: 'Vada', price: 15 }
            ];
            localStorage.setItem(this.MENU_KEY, JSON.stringify(defaultMenu));
        }
        if (!localStorage.getItem(this.ORDERS_KEY)) {
            localStorage.setItem(this.ORDERS_KEY, JSON.stringify([]));
        }
    },

    // Menu operations
    getMenu() {
        const menu = localStorage.getItem(this.MENU_KEY);
        return menu ? JSON.parse(menu) : [];
    },

    saveMenu(menu) {
        localStorage.setItem(this.MENU_KEY, JSON.stringify(menu));
    },

    addMenuItem(name, price) {
        const menu = this.getMenu();
        const newId = menu.length > 0 ? Math.max(...menu.map(item => item.id)) + 1 : 1;
        const newItem = {
            id: newId,
            name: name.trim(),
            price: parseFloat(price)
        };
        menu.push(newItem);
        this.saveMenu(menu);
        return newItem;
    },

    updateMenuItem(id, name, price) {
        const menu = this.getMenu();
        const index = menu.findIndex(item => item.id === id);
        if (index === -1) return null;

        if (name) menu[index].name = name.trim();
        if (price !== undefined) menu[index].price = parseFloat(price);
        this.saveMenu(menu);
        return menu[index];
    },

    deleteMenuItem(id) {
        const menu = this.getMenu();
        const filteredMenu = menu.filter(item => item.id !== id);
        if (menu.length === filteredMenu.length) return false;
        this.saveMenu(filteredMenu);
        return true;
    },

    // Order operations
    getOrders() {
        const orders = localStorage.getItem(this.ORDERS_KEY);
        return orders ? JSON.parse(orders) : [];
    },

    saveOrders(orders) {
        localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    },

    addOrder(items, customerName) {
        const orders = this.getOrders();
        const menu = this.getMenu();
        
        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const menuItem = menu.find(m => m.id === item.id);
            if (!menuItem) {
                throw new Error(`Menu item with id ${item.id} not found`);
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
        this.saveOrders(orders);
        return newOrder;
    },

    updateOrderStatus(id, status) {
        const orders = this.getOrders();
        const index = orders.findIndex(order => order.id === id);
        if (index === -1) return null;

        orders[index].status = status;
        this.saveOrders(orders);
        return orders[index];
    }
};

// Initialize on load
DataManager.init();

