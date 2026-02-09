const API_URL = "http://localhost:3000";

const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

export const productService = {
  getAll: () => fetchApi("/products"),
  getById: (id) => fetchApi(`/products/${id}`),
  create: (data) =>
    fetchApi("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchApi(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchApi(`/products/${id}`, {
      method: "DELETE",
    }),
};

export const categoryService = {
  getAll: () => fetchApi("/categories"),
  getById: (id) => fetchApi(`/categories/${id}`),
  create: (data) =>
    fetchApi("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchApi(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchApi(`/categories/${id}`, {
      method: "DELETE",
    }),
};

export const orderService = {
  getAll: () => fetchApi("/orders"),
  getById: (id) => fetchApi(`/orders/${id}`),
  updateStatus: (id, status, timeline) =>
    fetchApi(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, timeline }),
    }),
  delete: (id) =>
    fetchApi(`/orders/${id}`, {
      method: "DELETE",
    }),
};

export const userService = {
  getAll: () => fetchApi("/users"),
  getById: (id) => fetchApi(`/users/${id}`),
  create: (data) =>
    fetchApi("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchApi(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchApi(`/users/${id}`, {
      method: "DELETE",
    }),
};

export const reviewService = {
  getAll: () => fetchApi("/reviews"),
  getByProductId: (productId) => fetchApi(`/reviews?productId=${productId}`),
  delete: (id) =>
    fetchApi(`/reviews/${id}`, {
      method: "DELETE",
    }),
};

export const authService = {
  login: async (email, password) => {
    const users = await fetchApi(`/users?email=${email}`);
    if (users.length === 0) {
      throw new Error("İstifadəçi tapılmadı");
    }
    const user = users[0];
    if (user.password !== password) {
      throw new Error("Şifrə yanlışdır");
    }
    if (user.role !== "admin" && user.role !== "super-admin") {
      throw new Error("Admin səlahiyyəti yoxdur");
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};

export default {
  productService,
  categoryService,
  orderService,
  userService,
  reviewService,
  authService,
};
