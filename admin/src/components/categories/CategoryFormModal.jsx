import { useTranslation } from "react-i18next";

const CategoryFormModal = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  isEditing,
  parentCategories,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
      <div className="bg-white rounded-[20px] p-[24px] w-full max-w-[450px]">
        <h3 className="text-[18px] font-bold text-[#111827] mb-[20px]">
          {isEditing
            ? t("categories.editCategory")
            : t("categories.addCategory")}
        </h3>
        <form onSubmit={onSubmit} className="space-y-[16px]">
          <div>
            <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
              {t("categories.categoryId")} *
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  id: e.target.value.toLowerCase().replace(/\s/g, "-"),
                })
              }
              required
              disabled={isEditing}
              className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px] disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
              {t("categories.categoryName")} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px]"
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
              {t("categories.imageUrl")}
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px]"
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium text-[#374151] mb-[8px]">
              {t("categories.parentCategory")}
            </label>
            <select
              value={formData.parentId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parentId: e.target.value || null,
                })
              }
              className="w-full px-[16px] py-[12px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[14px]"
            >
              <option value="">{t("categories.noParent")}</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-[12px] pt-[8px]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-[20px] py-[12px] border border-[#E5E7EB] text-[#374151] font-medium rounded-[12px] hover:bg-[#F3F4F6]"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 px-[20px] py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-[12px]"
            >
              {t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
