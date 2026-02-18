const API_URL = import.meta.env.VITE_API_URL;

export const addressService = {
  async getByUserId(userId) {
    const response = await fetch(`${API_URL}/addresses?userId=${userId}`);
    if (!response.ok) throw new Error("Ünvanlar yüklənmədi");
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/addresses/${id}`);
    if (!response.ok) throw new Error("Ünvan tapılmadı");
    return response.json();
  },

  async create(addressData) {
    const response = await fetch(`${API_URL}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error("Ünvan əlavə edilmədi");
    return response.json();
  },

  async update(id, data) {
    const response = await fetch(`${API_URL}/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Ünvan yenilənmədi");
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/addresses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Ünvan silinmədi");
    return true;
  },

  async setDefault(id, userId) {
    const addresses = await this.getByUserId(userId);
    await Promise.all(
      addresses
        .filter((a) => a.isDefault)
        .map((a) => this.update(a.id, { isDefault: false })),
    );
    return this.update(id, { isDefault: true });
  },
};

export default addressService;
