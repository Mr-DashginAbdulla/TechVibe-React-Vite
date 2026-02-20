import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetAllProductsQuery } from "@/store/api/productsApi";

const useProductComparison = (product) => {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const { data: allProducts = [] } = useGetAllProductsQuery();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPicker(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showPicker && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showPicker]);

  const selectedProduct = useMemo(
    () => allProducts.find((p) => p.id === selectedId) || null,
    [selectedId, allProducts],
  );

  const availableProducts = useMemo(() => {
    const excludeIds = new Set([product.id]);
    if (selectedId) excludeIds.add(selectedId);
    return allProducts
      .filter((p) => !excludeIds.has(p.id))
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
        );
      });
  }, [allProducts, product.id, selectedId, searchQuery]);

  const allSpecKeys = useMemo(() => {
    const compared = selectedProduct ? [product, selectedProduct] : [product];
    const keysSet = new Set();
    compared.forEach((p) => {
      if (p.specs) Object.keys(p.specs).forEach((k) => keysSet.add(k));
    });
    return Array.from(keysSet);
  }, [product, selectedProduct]);

  const translateSpecKey = (key) => {
    const translationKey = `specs.${key.replace(/\s+/g, "")}`;
    const translation = t(translationKey, { defaultValue: "" });
    return translation || key;
  };

  const handleAddProduct = (productId) => {
    setSelectedId(productId);
    setShowPicker(false);
    setSearchQuery("");
  };

  const handleRemoveProduct = () => setSelectedId(null);

  const togglePicker = () => {
    setShowPicker((prev) => !prev);
    setSearchQuery("");
  };

  return {
    selectedProduct,
    availableProducts,
    allSpecKeys,
    showPicker,
    searchQuery,
    setSearchQuery,
    dropdownRef,
    searchInputRef,
    translateSpecKey,
    handleAddProduct,
    handleRemoveProduct,
    togglePicker,
  };
};

export default useProductComparison;
