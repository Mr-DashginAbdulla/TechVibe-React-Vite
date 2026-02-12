import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Edit,
  Trash2,
  Award,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { brandService } from "@/services/api";

const BrandRow = ({ brand, onEdit, onDelete, onToggle, t }) => (
  <tr className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
    <td className="px-[24px] py-[16px]">
      <div className="flex items-center gap-[12px]">
        <div className="w-[40px] h-[40px] bg-[#F3F4F6] rounded-[10px] flex items-center justify-center overflow-hidden">
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-[28px] h-[28px] object-contain"
            />
          ) : (
            <Award className="w-[20px] h-[20px] text-[#9CA3AF]" />
          )}
        </div>
        <span className="text-[14px] font-semibold text-[#111827]">
          {brand.name}
        </span>
      </div>
    </td>
    <td className="px-[24px] py-[16px]">
      <span className="text-[13px] text-[#6B7280] truncate max-w-[200px] block">
        {brand.logo}
      </span>
    </td>
    <td className="px-[24px] py-[16px]">
      <a
        href={brand.website}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[13px] text-[#3B82F6] hover:underline flex items-center gap-[4px]"
      >
        {brand.website}
        <ExternalLink className="w-[12px] h-[12px]" />
      </a>
    </td>
    <td className="px-[24px] py-[16px]">
      <button
        onClick={() => onToggle(brand)}
        className="flex items-center gap-[6px]"
      >
        {brand.isActive ? (
          <>
            <ToggleRight className="w-[24px] h-[24px] text-[#10B981]" />
            <span className="text-[13px] text-[#10B981] font-medium">
              {t("common.active")}
            </span>
          </>
        ) : (
          <>
            <ToggleLeft className="w-[24px] h-[24px] text-[#9CA3AF]" />
            <span className="text-[13px] text-[#9CA3AF] font-medium">
              {t("common.inactive")}
            </span>
          </>
        )}
      </button>
    </td>
    <td className="px-[24px] py-[16px] text-right">
      <div className="flex items-center justify-end gap-[8px]">
        <button
          onClick={() => onEdit(brand)}
          className="p-[8px] rounded-[8px] hover:bg-[#EFF6FF] text-[#3B82F6] transition-colors"
          title={t("common.edit")}
        >
          <Edit className="w-[16px] h-[16px]" />
        </button>
        <button
          onClick={() => onDelete(brand.id)}
          className="p-[8px] rounded-[8px] hover:bg-[#FEF2F2] text-[#EF4444] transition-colors"
          title={t("common.delete")}
        >
          <Trash2 className="w-[16px] h-[16px]" />
        </button>
      </div>
    </td>
  </tr>
);

const BrandFormModal = ({ form, setForm, onSubmit, onClose, isEditing, t }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[16px]">
    <div className="bg-white rounded-[20px] w-full max-w-[480px] shadow-2xl">
      <div className="px-[24px] py-[20px] border-b border-[#E5E7EB]">
        <h2 className="text-[18px] font-bold text-[#111827]">
          {isEditing ? t("brands.editBrand") : t("brands.addBrand")}
        </h2>
      </div>
      <form onSubmit={onSubmit} className="p-[24px]">
        <div className="space-y-[16px]">
          <FormField label={`${t("brands.brandName")} *`}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-[14px] py-[10px] rounded-[10px] border border-[#D1D5DB] text-[14px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none"
              placeholder="Apple"
              required
            />
          </FormField>
          <FormField label={`${t("brands.logoUrl")} *`}>
            <input
              type="url"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full px-[14px] py-[10px] rounded-[10px] border border-[#D1D5DB] text-[14px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none"
              placeholder="https://logo.clearbit.com/apple.com"
              required
            />
            {form.logo && (
              <div className="mt-[8px] flex items-center gap-[8px]">
                <div className="w-[40px] h-[40px] bg-[#F3F4F6] rounded-[8px] flex items-center justify-center">
                  <img
                    src={form.logo}
                    alt="Preview"
                    className="w-[28px] h-[28px] object-contain"
                  />
                </div>
                <span className="text-[12px] text-[#6B7280]">
                  {t("brands.preview")}
                </span>
              </div>
            )}
          </FormField>
          <FormField label={t("brands.website")}>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-[14px] py-[10px] rounded-[10px] border border-[#D1D5DB] text-[14px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none"
              placeholder="https://www.apple.com"
            />
          </FormField>
          <div className="flex items-center gap-[10px]">
            <label className="text-[13px] font-semibold text-[#374151]">
              {t("common.active")}
            </label>
            <button
              type="button"
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
            >
              {form.isActive ? (
                <ToggleRight className="w-[28px] h-[28px] text-[#10B981]" />
              ) : (
                <ToggleLeft className="w-[28px] h-[28px] text-[#9CA3AF]" />
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-[12px] mt-[24px] pt-[16px] border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="px-[20px] py-[10px] text-[14px] font-medium text-[#6B7280] hover:bg-[#F3F4F6] rounded-[10px] transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            className="px-[20px] py-[10px] bg-[#3B82F6] text-white text-[14px] font-medium rounded-[10px] hover:bg-[#2563EB] transition-colors"
          >
            {t("common.save")}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-[13px] font-semibold text-[#374151] mb-[6px]">
      {label}
    </label>
    {children}
  </div>
);

const DeleteConfirmModal = ({ onConfirm, onCancel, t }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[16px]">
    <div className="bg-white rounded-[20px] w-full max-w-[400px] p-[24px] shadow-2xl">
      <h3 className="text-[18px] font-bold text-[#111827] mb-[8px]">
        {t("brands.deleteBrand")}
      </h3>
      <p className="text-[14px] text-[#6B7280] mb-[24px]">
        {t("brands.deleteConfirm")}
      </p>
      <div className="flex items-center justify-end gap-[12px]">
        <button
          onClick={onCancel}
          className="px-[20px] py-[10px] text-[14px] font-medium text-[#6B7280] hover:bg-[#F3F4F6] rounded-[10px] transition-colors"
        >
          {t("common.cancel")}
        </button>
        <button
          onClick={onConfirm}
          className="px-[20px] py-[10px] bg-[#EF4444] text-white text-[14px] font-medium rounded-[10px] hover:bg-[#DC2626] transition-colors"
        >
          {t("common.delete")}
        </button>
      </div>
    </div>
  </div>
);

const INITIAL_FORM = { name: "", logo: "", website: "", isActive: true };

function Brands() {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setBrands(await brandService.getAll());
    } catch {
      toast.error(t("messages.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await brandService.update(editingBrand.id, form);
      } else {
        await brandService.create({ ...form, id: `brand-${Date.now()}` });
      }
      toast.success(t("brands.saveSuccess"));
      closeModal();
      fetchBrands();
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const handleDelete = async () => {
    try {
      await brandService.delete(deleteConfirm);
      toast.success(t("brands.deleteSuccess"));
      setDeleteConfirm(null);
      fetchBrands();
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const toggleActive = async (brand) => {
    try {
      await brandService.update(brand.id, { isActive: !brand.isActive });
      fetchBrands();
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setForm({
      name: brand.name,
      logo: brand.logo,
      website: brand.website,
      isActive: brand.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setForm(INITIAL_FORM);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="w-[40px] h-[40px] border-[4px] border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] mb-[32px]">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">
            {t("brands.title")}
          </h1>
          <p className="text-[14px] text-[#6B7280]">{t("brands.subtitle")}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-[8px] bg-[#3B82F6] text-white px-[20px] py-[10px] rounded-[10px] hover:bg-[#2563EB] transition-colors text-[14px] font-medium"
        >
          <Plus className="w-[18px] h-[18px]" />
          {t("brands.addBrand")}
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden">
        <div className="px-[24px] py-[16px] border-b border-[#E5E7EB]">
          <p className="text-[14px] text-[#6B7280]">
            {t("brands.totalBrands")}:{" "}
            <span className="font-semibold text-[#111827]">
              {brands.length}
            </span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                {[
                  "brands.brandName",
                  "brands.logo",
                  "brands.website",
                  "common.status",
                ].map((key) => (
                  <th
                    key={key}
                    className="text-left px-[24px] py-[14px] text-[13px] font-semibold text-[#6B7280] uppercase"
                  >
                    {t(key)}
                  </th>
                ))}
                <th className="text-right px-[24px] py-[14px] text-[13px] font-semibold text-[#6B7280] uppercase">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {brands.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-[48px] text-[#6B7280]"
                  >
                    {t("brands.noBrands")}
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <BrandRow
                    key={brand.id}
                    brand={brand}
                    onEdit={openEditModal}
                    onDelete={setDeleteConfirm}
                    onToggle={toggleActive}
                    t={t}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <BrandFormModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={closeModal}
          isEditing={!!editingBrand}
          t={t}
        />
      )}
      {deleteConfirm && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
          t={t}
        />
      )}
    </div>
  );
}

export default Brands;
