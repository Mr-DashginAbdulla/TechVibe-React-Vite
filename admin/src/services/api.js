const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
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

export const brandService = {
  getAll: () => fetchApi("/brands"),
  getById: (id) => fetchApi(`/brands/${id}`),
  create: (data) =>
    fetchApi("/brands", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchApi(`/brands/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchApi(`/brands/${id}`, {
      method: "DELETE",
    }),
};

export const promoCodeService = {
  getAll: () => fetchApi("/promoCodes"),
  getById: (id) => fetchApi(`/promoCodes/${id}`),
  create: (data) =>
    fetchApi("/promoCodes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchApi(`/promoCodes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchApi(`/promoCodes/${id}`, {
      method: "DELETE",
    }),
};

export const statsService = {
  getStats: () => fetchApi("/stats"),
};

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "LOGIN_FAILED");
    }

    const userData = await response.json();

    if (userData.role !== "admin" && userData.role !== "super-admin") {
      throw new Error("UNAUTHORIZED_ROLE");
    }

    // Store admin token
    localStorage.setItem("admin_auth_token", userData.token);

    return userData;
  },
};

export default {
  productService,
  categoryService,
  orderService,
  userService,
  reviewService,
  brandService,
  authService,
  statsService,
};
