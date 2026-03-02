const API_URL = import.meta.env.VITE_API_URL;

const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
};

export const authService = {
  async register(userData) {
    const existingUsers = await fetch(
      `${API_URL}/users?email=${userData.email}`,
    );
    const users = await existingUsers.json();

    if (users.length > 0) {
      throw new Error("EMAIL_EXISTS");
    }

    const now = new Date().toISOString();

    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: generateUniqueId(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: "",
        isVerified: false,
        avatar: "",
        createdAt: now,
        memberSince: now,
      }),
    });

    if (!response.ok) {
      throw new Error("REGISTER_FAILED");
    }

    const newUser = await response.json();

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/users?email=${email}`);
    const users = await response.json();

    if (users.length === 0) {
      throw new Error("USER_NOT_FOUND");
    }

    const user = users[0];

    if (user.password !== password) {
      throw new Error("WRONG_PASSWORD");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async checkEmailExists(email) {
    const response = await fetch(`${API_URL}/users?email=${email}`);
    const users = await response.json();
    return users.length > 0;
  },

  async getUserById(id) {
    const response = await fetch(`${API_URL}/users/${id}`);

    if (!response.ok) {
      throw new Error("USER_NOT_FOUND");
    }

    const user = await response.json();
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async updatePassword(email, newPassword) {
    const response = await fetch(`${API_URL}/users?email=${email}`);
    const users = await response.json();

    if (users.length === 0) {
      throw new Error("USER_NOT_FOUND");
    }

    const user = users[0];

    const updateResponse = await fetch(`${API_URL}/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!updateResponse.ok) {
      throw new Error("PASSWORD_UPDATE_FAILED");
    }

    return true;
  },
};

export default authService;
