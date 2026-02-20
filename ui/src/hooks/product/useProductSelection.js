import { useState, useEffect } from "react";

export const useProductSelection = (product) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [transformedProductOptions, setTransformedProductOptions] = useState(
    [],
  );

  useEffect(() => {
    if (product) {
      setCalculatedPrice(product.price);

      const transformedOptions = [];

      if (product.colorOptions?.length > 0) {
        transformedOptions.push({
          id: "color",
          title: "Color",
          type: "color",
          values: product.colorOptions.map((c) => ({
            label: c.name,
            value: c.hex,
            priceModifier: 0,
          })),
        });
      }

      if (product.memoryOptions?.length > 0) {
        transformedOptions.push({
          id: "memory",
          title: "Storage",
          type: "select",
          values: product.memoryOptions.map((m) => ({
            label: m.size,
            priceModifier: m.adj || 0,
          })),
        });
      }

      if (product.options) {
        transformedOptions.push(...product.options);
      }

      const defaults = {};
      transformedOptions.forEach((opt) => {
        if (opt.values && opt.values.length > 0) {
          defaults[opt.id] = opt.values[0];
        }
      });
      setSelectedOptions(defaults);

      setTransformedProductOptions(transformedOptions);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    let basePrice = product.price;
    let modifiers = 0;

    Object.values(selectedOptions).forEach((optVal) => {
      if (optVal && optVal.priceModifier) {
        modifiers += optVal.priceModifier;
      }
    });

    setCalculatedPrice(basePrice + modifiers);
  }, [selectedOptions, product]);

  const handleOptionSelect = (optionId, valueObj) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueObj,
    }));
  };

  return {
    selectedOptions,
    calculatedPrice,
    transformedProductOptions,
    handleOptionSelect,
  };
};
