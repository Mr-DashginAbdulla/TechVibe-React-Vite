const API_URL = "http://localhost:3000";

export const addressService = {
  // Get all addresses for user
  async getByUserId(userId) {
    const response = await fetch(`${API_URL}/addresses?userId=${userId}`);
    if (!response.ok) throw new Error("Ünvanlar yüklənmədi");
    return response.json();
  },

  // Get single address
  async getById(id) {
    const response = await fetch(`${API_URL}/addresses/${id}`);
    if (!response.ok) throw new Error("Ünvan tapılmadı");
    return response.json();
  },

  // Create address
  async create(addressData) {
    const response = await fetch(`${API_URL}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error("Ünvan əlavə edilmədi");
    return response.json();
  },

  // Update address
  async update(id, data) {
    const response = await fetch(`${API_URL}/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Ünvan yenilənmədi");
    return response.json();
  },

  // Delete address
  async delete(id) {
    const response = await fetch(`${API_URL}/addresses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Ünvan silinmədi");
    return true;
  },

  // Set as default
  async setDefault(id, userId) {
    // First, unset all defaults for this user
    const addresses = await this.getByUserId(userId);
    await Promise.all(
      addresses
        .filter((a) => a.isDefault)
        .map((a) => this.update(a.id, { isDefault: false })),
    );
    // Then set the new default
    return this.update(id, { isDefault: true });
  },
};

export default addressService;
