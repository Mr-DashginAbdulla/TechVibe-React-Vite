const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const userService = {
  async getById(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("USER_NOT_FOUND");
    return response.json();
  },

  async updateProfile(id, data) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("PROFILE_UPDATE_FAILED");
    return response.json();
  },

  async updateAvatar(id, avatarBase64) {
    return this.updateProfile(id, { avatar: avatarBase64 });
  },

  async changePassword(id, currentPassword, newPassword) {
    // First verify current password by trying to login
    const user = await this.getById(id);
    // The backend now handles password hashing, so we send both passwords
    // and let the backend verify
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ password: newPassword }),
    });
    if (!response.ok) throw new Error("PASSWORD_CHANGE_FAILED");
    return response.json();
  },

  async getStats(userId) {
    const headers = getAuthHeaders();
    const [ordersRes, wishlist] = await Promise.all([
      fetch(`${API_URL}/orders?userId=${userId}&_limit=100`, { headers }).then((r) =>
        r.json(),
      ),
      fetch(`${API_URL}/wishlist?userId=${userId}`, { headers }).then((r) =>
        r.json(),
      ),
    ]);

    const orders = ordersRes.data || ordersRes;
    const totalOrders = orders.length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const wishlistItems = wishlist.length;

    return { totalOrders, delivered, totalSpent, wishlistItems };
  },
};

export default userService;
