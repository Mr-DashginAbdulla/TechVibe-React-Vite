import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2, FolderTree, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { categoryService } from "@/services/api";

const Categories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    image: "",
    parentId: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error(t("messages.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        toast.success(t("categories.saveSuccess"));
      } else {
        await categoryService.create(formData);
        toast.success(t("messages.created"));
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      toast.error(t("messages.error"));
    }
  };

  const handleDelete = async () => {
    try {
      await categoryService.delete(categoryToDelete.id);
      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      toast.success(t("categories.deleteSuccess"));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(t("messages.error"));
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      image: category.image || "",
      parentId: category.parentId,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ id: "", name: "", image: "", parentId: null });
  };

  const parentCategories = categories.filter((c) => c.parentId === null);

  const getChildren = (parentId) =>
    categories.filter((c) => c.parentId === parentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-[24px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px]">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">
            {t("categories.title")}
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-[4px]">
            {categories.length} {t("categories.totalCategories")}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-[8px] px-[20px] py-[12px] bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-[12px] transition-colors"
        >
          <Plus className="w-[20px] h-[20px]" />
          {t("categories.addCategory")}
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB]">
        {parentCategories.length > 0 ? (
          <div className="divide-y divide-[#E5E7EB]">
            {parentCategories.map((parent) => {
              const children = getChildren(parent.id);
              return (
                <div key={parent.id}>
                  <div className="flex items-center justify-between p-[20px] hover:bg-[#F9FAFB]">
                    <div className="flex items-center gap-[16px]">
                      <div className="w-[48px] h-[48px] bg-linear-to-br from-[#3B82F6] to-[#6366F1] rounded-[12px] flex items-center justify-center">
                        <FolderTree className="w-[24px] h-[24px] text-white" />
                      </div>
                      <div>
                        <p className="text-[16px] font-semibold text-[#111827]">
                          {parent.name}
                        </p>
                        <p className="text-[13px] text-[#6B7280]">
                          {children.length} {t("categories.subcategories")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <button
                        onClick={() => openEditModal(parent)}
                        className="p-[10px] hover:bg-[#F3F4F6] rounded-[10px]"
                      >
                        <Edit className="w-[18px] h-[18px] text-[#6B7280]" />
                      </button>
                      <button
                        onClick={() => {
                          setCategoryToDelete(parent);
                          setShowDeleteModal(true);
                        }}
                        className="p-[10px] hover:bg-red-50 rounded-[10px]"
                      >
                        <Trash2 className="w-[18px] h-[18px] text-[#EF4444]" />
                      </button>
                    </div>
                  </div>

                  {children.length > 0 && (
                    <div className="bg-[#F9FAFB] border-t border-[#E5E7EB]">
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between px-[14px] py-[14px] pl-[36px] sm:px-[20px] sm:py-[16px] sm:pl-[64px] hover:bg-[#F3F4F6]"
                        >
                          <div className="flex items-center gap-[12px]">
                            <ChevronRight className="w-[16px] h-[16px] text-[#9CA3AF]" />
                            {child.image && (
                              <img
                                src={child.image}
                                alt=""
                                className="w-[36px] h-[36px] rounded-[8px] object-cover"
                              />
                            )}
                            <span className="text-[14px] font-medium text-[#374151]">
                              {child.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-[8px]">
                            <button
                              onClick={() => openEditModal(child)}
                              className="p-[8px] hover:bg-white rounded-[8px]"
                            >
                              <Edit className="w-[16px] h-[16px] text-[#6B7280]" />
                            </button>
                            <button
                              onClick={() => {
                                setCategoryToDelete(child);
                                setShowDeleteModal(true);
                              }}
                              className="p-[8px] hover:bg-red-50 rounded-[8px]"
                            >
                              <Trash2 className="w-[16px] h-[16px] text-[#EF4444]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-[60px] text-center">
            <FolderTree className="w-[48px] h-[48px] text-[#D1D5DB] mx-auto mb-[12px]" />
            <p className="text-[16px] font-medium text-[#6B7280]">
              {t("categories.noCategories")}
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-white rounded-[20px] p-[24px] w-full max-w-[450px]">
            <h3 className="text-[18px] font-bold text-[#111827] mb-[20px]">
              {editingCategory
                ? t("categories.editCategory")
                : t("categories.addCategory")}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-[16px]">
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
                  disabled={!!editingCategory}
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
                  {parentCategories
                    .filter((p) => p.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-[12px] pt-[8px]">
                <button
                  type="button"
                  onClick={closeModal}
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
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
          <div className="bg-white rounded-[20px] p-[24px] w-full max-w-[400px]">
            <h3 className="text-[18px] font-bold text-[#111827] mb-[12px]">
              {t("categories.deleteCategory")}
            </h3>
            <p className="text-[14px] text-[#6B7280] mb-[24px]">
              {t("categories.deleteConfirm")}
            </p>
            <div className="flex gap-[12px]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-[20px] py-[12px] border border-[#E5E7EB] text-[#374151] font-medium rounded-[12px] hover:bg-[#F3F4F6]"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-[20px] py-[12px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium rounded-[12px]"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
