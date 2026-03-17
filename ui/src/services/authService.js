import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async register(userData) {
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;

      // 2. Send verification email
      await sendEmailVerification(user);

      // 3. Sync user with our MongoDB backend
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          firebaseUid: user.uid
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        // If our backend fails, we should ideally rollback Firebase user, but keeping it simple for now
        throw new Error(error.error || "REGISTER_SYNC_FAILED");
      }

      return response.json();
    } catch (error) {
       // Format Firebase errors to be readable
       if (error.code === 'auth/email-already-in-use') throw new Error("Email already in use");
       if (error.code === 'auth/weak-password') throw new Error("Password to weak");
       throw error;
    }
  },

  async login(email, password) {
    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
         throw new Error("EMAIL_NOT_VERIFIED");
      }

      // 2. Get Firebase ID Token
      const idToken = await user.getIdToken();

      // 3. Login to our Backend using the token
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "LOGIN_FAILED");
      }

      return response.json();
    } catch (error) {
       if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
           throw new Error("Invalid email or password");
       }
       if (error.message === "EMAIL_NOT_VERIFIED") {
           throw new Error("Please verify your email address before logging in. Check your inbox.");
       }
       throw error;
    }
  },

  async loginWithGoogle() {
      try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;
        const idToken = await user.getIdToken();

        // Send to backend to sync or login
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
              // Fallback names in case backend needs to create the user for first time
              firstName: user.displayName?.split(" ")[0] || "User",
              lastName: user.displayName?.split(" ")[1] || "",
              email: user.email,
          })
        });

        if (!response.ok) {
           const error = await response.json();
           throw new Error(error.error || "GOOGLE_LOGIN_FAILED");
        }

        return response.json();
      } catch (error) {
         console.error("Google Auth Error:", error);
         throw new Error("Google login failed");
      }
  },

  async resetPassword(email) {
     try {
       await sendPasswordResetEmail(auth, email);
       return true;
     } catch (error) {
       if (error.code === 'auth/user-not-found') throw new Error("User not found");
       throw error;
     }
  },

  async checkEmailExists(email) {
    const response = await fetch(`${API_URL}/auth/check-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data.exists;
  },

  async getUserById(id) {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("USER_NOT_FOUND");
    }

    return response.json();
  }
};

export default authService;
