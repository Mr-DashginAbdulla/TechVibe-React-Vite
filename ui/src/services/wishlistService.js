const API_URL = "http://localhost:3000";

export const wishlistService = {
  // Get all wishlist items for user
  async getByUserId(userId) {
    const response = await fetch(
      `${API_URL}/wishlist?userId=${userId}&_sort=addedAt&_order=desc`,
    );
    if (!response.ok) throw new Error("İstək siyahısı yüklənmədi");
    return response.json();
  },

  // Check if product is in wishlist
  async isInWishlist(userId, productId) {
    const response = await fetch(
      `${API_URL}/wishlist?userId=${userId}&productId=${productId}`,
    );
    const items = await response.json();
    return items.length > 0 ? items[0] : null;
  },

  // Add to wishlist
  async add(wishlistData) {
    // Check if already exists
    const existing = await this.isInWishlist(
      wishlistData.userId,
      wishlistData.productId,
    );
    if (existing) {
      throw new Error("Məhsul artıq istək siyahısındadır");
    }

    const response = await fetch(`${API_URL}/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...wishlistData,
        addedAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) throw new Error("Məhsul əlavə edilmədi");
    return response.json();
  },

  // Remove from wishlist
  async remove(id) {
    const response = await fetch(`${API_URL}/wishlist/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Məhsul silinmədi");
    return true;
  },

  // Remove by productId
  async removeByProductId(userId, productId) {
    const item = await this.isInWishlist(userId, productId);
    if (item) {
      return this.remove(item.id);
    }
    return false;
  },

  // Get count
  async getCount(userId) {
    const items = await this.getByUserId(userId);
    return items.length;
  },
};

export default wishlistService;
