const API_URL = import.meta.env.VITE_API_URL;

export const orderService = {
  async getByUserId(userId) {
    const response = await fetch(
      `${API_URL}/orders?userId=${userId}&_sort=createdAt&_order=desc`,
    );
    if (!response.ok) throw new Error("Sifarişlər yüklənmədi");
    return response.json();
  },

  async getByStatus(userId, status) {
    if (status === "all") {
      return this.getByUserId(userId);
    }
    const response = await fetch(
      `${API_URL}/orders?userId=${userId}&status=${status}&_sort=createdAt&_order=desc`,
    );
    if (!response.ok) throw new Error("Sifarişlər yüklənmədi");
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error("Sifariş tapılmadı");
    return response.json();
  },

  async create(orderData) {
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
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
    if (!response.ok) throw new Error("Sifariş yaradılmadı");
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
    if (!response.ok) throw new Error("Sifariş statusu yenilənmədi");
    return response.json();
  },

  async cancelOrder(id) {
    const order = await this.getById(id);

    if (!["pending", "processing"].includes(order.status)) {
      throw new Error("Bu sifariş artıq ləğv edilə bilməz");
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
    if (!response.ok) throw new Error("Sifariş ləğv ediləbilmədi");
    return response.json();
  },

  async updateOrderItems(id, items) {
    const order = await this.getById(id);

    if (order.status !== "pending") {
      throw new Error("Bu sifariş artıq dəyişdirilə bilməz");
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
    if (!response.ok) throw new Error("Sifariş məhsulları yenilənmədi");
    return response.json();
  },
};

export default orderService;
