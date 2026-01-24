const API_URL = "http://localhost:3000";

export const orderService = {
  // Get all orders for user
  async getByUserId(userId) {
    const response = await fetch(
      `${API_URL}/orders?userId=${userId}&_sort=createdAt&_order=desc`,
    );
    if (!response.ok) throw new Error("Sifarişlər yüklənmədi");
    return response.json();
  },

  // Get orders by status
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

  // Get single order
  async getById(id) {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error("Sifariş tapılmadı");
    return response.json();
  },

  // Create order
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

  // Update order status
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
};

export default orderService;
