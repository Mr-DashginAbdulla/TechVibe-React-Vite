import { useState, useEffect } from "react";
import { addressService } from "@/services/addressService";

export const useCheckoutAddress = (user) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;
      try {
        const data = await addressService.getByUserId(user.id);
        setAddresses(data);

        const defaultAddr = data.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, [user?.id]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return {
    addresses,
    setAddresses,
    selectedAddressId,
    setSelectedAddressId,
    selectedAddress,
    isLoading,
  };
};
