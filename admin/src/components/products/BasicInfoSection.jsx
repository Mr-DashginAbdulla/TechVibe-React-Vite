import { useTranslation } from "react-i18next";

const BasicInfoSection = ({ formData, setFormData, categories, brands }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-[16px] border border-border p-[20px]">
      <h2 className="text-[16px] font-semibold text-foreground mb-[16px]">
        {t("products.basicInfo")}
      </h2>
      <div className="space-y-[14px]">
        <div>
          <label className="block text-[13px] font-medium text-foreground mb-[6px]">
            {t("products.productName")} *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t("productForm.enterName")}
            required
            className="w-full px-[14px] py-[10px] bg-secondary border border-border rounded-[10px] text-[14px] text-foreground"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
          <div>
            <label className="block text-[13px] font-medium text-foreground mb-[6px]">
              {t("products.brand")} *
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              placeholder={t("productForm.enterBrand")}
              required
              list="brand-list"
              className="w-full px-[14px] py-[10px] bg-secondary border border-border rounded-[10px] text-[14px] text-foreground"
            />
            {brands && (
              <datalist id="brand-list">
                {brands.map((b) => (
                  <option key={b.id} value={b.name} />
                ))}
              </datalist>
            )}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-foreground mb-[6px]">
              {t("products.category")} *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              required
              className="w-full px-[14px] py-[10px] bg-secondary border border-border rounded-[10px] text-[14px] text-foreground"
            >
              <option value="">{t("productForm.selectCategory")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-foreground mb-[6px]">
            {t("products.description")}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder={t("productForm.enterDescription")}
            rows={3}
            className="w-full px-[14px] py-[10px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] text-[14px] resize-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
          <div>
            <label className="block text-[13px] font-medium text-foreground mb-[6px]">
              {t("products.price")} *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              placeholder={t("productForm.enterPrice")}
              required
              min="0"
              step="0.01"
              className="w-full px-[14px] py-[10px] bg-secondary border border-border rounded-[10px] text-[14px] text-foreground"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-foreground mb-[6px]">
              {t("products.stock")} *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: parseInt(e.target.value) || 0,
                })
              }
              placeholder={t("productForm.enterStock")}
              required
              min="0"
              className="w-full px-[14px] py-[10px] bg-secondary border border-border rounded-[10px] text-[14px] text-foreground"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-foreground mb-[6px]">
              {t("products.discountPercent")}
            </label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount: parseInt(e.target.value) || 0,
                })
              }
              placeholder={t("productForm.enterDiscount")}
              min="0"
              max="100"
              className="w-full px-[14px] py-[10px] bg-secondary border border-border rounded-[10px] text-[14px] text-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
