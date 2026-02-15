import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { categoryService } from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
import CategoryList from "@/components/categories/CategoryList";

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
    } catch {
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
    } catch {
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
    } catch {
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

  if (loading) return <LoadingSpinner />;

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
        <CategoryList
          parentCategories={parentCategories}
          getChildren={getChildren}
          onEdit={openEditModal}
          onDelete={(cat) => {
            setCategoryToDelete(cat);
            setShowDeleteModal(true);
          }}
        />
      </div>

      {showModal && (
        <CategoryFormModal
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={closeModal}
          isEditing={!!editingCategory}
          parentCategories={parentCategories.filter(
            (p) => p.id !== editingCategory?.id,
          )}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          title={t("categories.deleteCategory")}
          message={t("categories.deleteConfirm")}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Categories;
