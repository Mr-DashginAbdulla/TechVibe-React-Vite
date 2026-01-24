const API_URL = "http://localhost:3000";

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
      throw new Error("Bu email artıq qeydiyyatdan keçib");
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
      throw new Error("Qeydiyyat uğursuz oldu");
    }

    const newUser = await response.json();

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/users?email=${email}`);
    const users = await response.json();

    if (users.length === 0) {
      throw new Error("Bu email ilə istifadəçi tapılmadı");
    }

    const user = users[0];

    if (user.password !== password) {
      throw new Error("Şifrə yanlışdır");
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
      throw new Error("İstifadəçi tapılmadı");
    }

    const user = await response.json();
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async updatePassword(email, newPassword) {

    const response = await fetch(`${API_URL}/users?email=${email}`);
    const users = await response.json();

    if (users.length === 0) {
      throw new Error("İstifadəçi tapılmadı");
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
      throw new Error("Şifrə yenilənərkən xəta baş verdi");
    }

    return true;
  },
};

export default authService;
