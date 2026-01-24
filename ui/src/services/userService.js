const API_URL = "http://localhost:3000";

export const userService = {
  // Get user by ID
  async getById(id) {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) throw new Error("İstifadəçi tapılmadı");
    const user = await response.json();
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Update user profile
  async updateProfile(id, data) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Profil yenilənmədi");
    const user = await response.json();
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Update avatar (base64)
  async updateAvatar(id, avatarBase64) {
    return this.updateProfile(id, { avatar: avatarBase64 });
  },

  // Change password
  async changePassword(id, currentPassword, newPassword) {
    // First verify current password
    const user = await fetch(`${API_URL}/users/${id}`).then((r) => r.json());
    if (user.password !== currentPassword) {
      throw new Error("Cari şifrə yanlışdır");
    }
    return this.updateProfile(id, { password: newPassword });
  },

  // Get user stats
  async getStats(userId) {
    const [orders, wishlist] = await Promise.all([
      fetch(`${API_URL}/orders?userId=${userId}`).then((r) => r.json()),
      fetch(`${API_URL}/wishlist?userId=${userId}`).then((r) => r.json()),
    ]);

    const totalOrders = orders.length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const wishlistItems = wishlist.length;

    return { totalOrders, delivered, totalSpent, wishlistItems };
  },
};

export default userService;
