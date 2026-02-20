import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "@/services/orderService";

export const useOrderSuccess = (orderId) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  const estimatedDelivery = new Date();
  if (order) {
    const orderDate = new Date(order.createdAt);
    estimatedDelivery.setDate(orderDate.getDate() + 5);
  } else {
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  }

  return { order, isLoading, estimatedDelivery };
};
