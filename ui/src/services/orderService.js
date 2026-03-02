const API_URL = import.meta.env.VITE_API_URL;

export const orderService = {
  async getByUserId(userId) {
    const response = await fetch(
      `${API_URL}/orders?userId=${userId}&_sort=createdAt&_order=desc`,
    );
    if (!response.ok) throw new Error("ORDERS_LOAD_FAILED");
    return response.json();
  },

  async getByStatus(userId, status) {
    if (status === "all") {
      return this.getByUserId(userId);
    }
    const response = await fetch(
      `${API_URL}/orders?userId=${userId}&status=${status}&_sort=createdAt&_order=desc`,
    );
    if (!response.ok) throw new Error("ORDERS_LOAD_FAILED");
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error("ORDER_NOT_FOUND");
    return response.json();
  },

  async create(orderData) {
    const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...orderData,
        orderNumber,
        status: "pending",
        timeline: [
          {
            status: "ordered",
            date: new Date().toISOString(),
            description: "Order placed",
          },
        ],
        createdAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) throw new Error("ORDER_CREATE_FAILED");
    return response.json();
  },

  async updateStatus(id, status, description) {
    const order = await this.getById(id);
    const timeline = [
      ...order.timeline,
      { status, date: new Date().toISOString(), description },
    ];
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, timeline }),
    });
    if (!response.ok) throw new Error("ORDER_STATUS_UPDATE_FAILED");
    return response.json();
  },

  async cancelOrder(id) {
    const order = await this.getById(id);

    if (!["pending", "processing"].includes(order.status)) {
      throw new Error("ORDER_CANCEL_NOT_ALLOWED");
    }

    const timeline = [
      ...order.timeline,
      {
        status: "cancelled",
        date: new Date().toISOString(),
        description: "Order cancelled by customer",
      },
    ];

    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled", timeline }),
    });
    if (!response.ok) throw new Error("ORDER_CANCEL_FAILED");
    return response.json();
  },

  async updateOrderItems(id, items) {
    const order = await this.getById(id);

    if (order.status !== "pending") {
      throw new Error("ORDER_EDIT_NOT_ALLOWED");
    }

    const subtotal = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0,
    );
    const shippingCost = subtotal >= 50 ? 0 : 5;
    const tax = subtotal * 0.18;
    const total = subtotal + shippingCost + tax - (order.discount || 0);

    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, subtotal, shippingCost, tax, total }),
    });
    if (!response.ok) throw new Error("ORDER_ITEMS_UPDATE_FAILED");
    return response.json();
  },
};

export default orderService;
