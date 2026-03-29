import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = API_URL ? API_URL.replace("/api", "") : "http://localhost:5000";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem("admin_auth_token");
      const response = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
        setUnreadCount((data.data || []).filter(n => !n.read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (isLoggedIn && user?.role) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true
      });

      newSocket.on("connect", () => {
        newSocket.emit("join", user.role === "admin" || user.role === "super-admin" ? "admin" : user._id);
      });

      newSocket.on("new_notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Optional sound play if browser allows
        try {
          const audio = new Audio('/notification.mp3'); 
          audio.play().catch(e => console.log("Audio play prevented:", e));
        } catch(e) {}
      });

      newSocket.on("notification_read", (notifId) => {
        setNotifications(prev => {
          const updated = prev.map(n => n._id === notifId ? { ...n, read: true } : n);
          setUnreadCount(updated.filter(n => !n.read).length);
          return updated;
        });
      });

      newSocket.on("all_notifications_read", () => {
        setNotifications(prev => {
          const updated = prev.map(n => ({ ...n, read: true }));
          setUnreadCount(0);
          return updated;
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
    }
  }, [isLoggedIn, user]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("admin_auth_token");
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("admin_auth_token");
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export default NotificationContext;
