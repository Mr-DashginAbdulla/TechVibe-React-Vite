import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

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
  getAll: (params = "") => fetchApi(`/products?_limit=1000${params ? "&" + params : ""}`).then(res => res.data || res),
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
  getAll: () => fetchApi("/orders?_limit=1000").then(res => res.data || res),
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
  downloadInvoice: async (id) => {
    const token = localStorage.getItem("admin_auth_token");
    const response = await fetch(`${API_URL}/orders/${id}/invoice`, {
      method: 'GET',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!response.ok) {
        throw new Error("Download failed");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
};

export const userService = {
  getAll: () => fetchApi("/users?_limit=1000").then(res => res.data || res),
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
  getAll: () => fetchApi("/reviews?_limit=1000").then(res => res.data || res),
  getByProductId: (productId) => fetchApi(`/reviews?productId=${productId}&_limit=1000`).then(res => res.data || res),
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
  getAll: () => fetchApi("/promoCodes?_limit=1000").then(res => res.data || res),
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

export const auditLogService = {
  getAll: (params = "") => fetchApi(`/audit-logs${params ? "?" + params : ""}`),
  getById: (id) => fetchApi(`/audit-logs/${id}`),
};

export const authService = {
  login: async (email, password) => {
    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get ID Token
      const idToken = await user.getIdToken();

      // Login to our Backend using the token
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "LOGIN_FAILED");
      }

      const userData = await response.json();

      if (userData.role !== "admin" && userData.role !== "super-admin") {
        throw new Error("UNAUTHORIZED_ROLE");
      }

      // Store token
      localStorage.setItem("admin_auth_token", userData.token);

      return userData;
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
         throw new Error("WRONG_PASSWORD"); // To match admin UI translation
      }
      throw error;
    }
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
  auditLogService,
};
