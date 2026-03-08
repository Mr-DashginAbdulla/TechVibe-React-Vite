import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Award, Search } from "lucide-react";
import { toast } from "react-toastify";
import { brandService } from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import BrandRow from "@/components/brands/BrandRow";
import BrandFormModal from "@/components/brands/BrandFormModal";

const emptyForm = {
  name: "",
  logo: { light: "", dark: "" },
  website: "",
  isActive: true,
};

function Brands() {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState(emptyForm);

  const fetchBrands = async () => {
    try {
      const data = await brandService.getAll();
      setBrands(data);
    } catch {
      toast.error(t("messages.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await brandService.update(editingBrand.id, form);
        toast.success(t("brands.saveSuccess"));
      } else {
        await brandService.create({
          ...form,
          id: `brand-${Date.now()}`,
        });
        toast.success(t("brands.saveSuccess"));
      }
      fetchBrands();
      closeModal();
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const handleDelete = async () => {
    try {
      await brandService.delete(deleteId);
      setBrands(brands.filter((b) => b.id !== deleteId));
      toast.success(t("brands.deleteSuccess"));
      setDeleteId(null);
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const handleToggle = async (brand) => {
    try {
      await brandService.update(brand.id, { isActive: !brand.isActive });
      fetchBrands();
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const normalizeLogo = (logo) => {
    if (!logo) return { light: "", dark: "" };
    if (typeof logo === "string") return { light: logo, dark: logo };
    return { light: logo.light || "", dark: logo.dark || "" };
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setForm({
      name: brand.name,
      logo: normalizeLogo(brand.logo),
      website: brand.website || "",
      isActive: brand.isActive ?? true,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setForm(emptyForm);
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-[24px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[16px]">
        <div>
          <h1 className="text-[24px] font-bold text-foreground">
            {t("brands.title")}
          </h1>
          <p className="text-[14px] text-muted-foreground mt-[4px]">
            {t("brands.subtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-[8px] px-[20px] py-[10px] bg-primary text-primary-foreground font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-[18px] h-[18px]" />
          {t("brands.addBrand")}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
        <input
          type="text"
          placeholder={t("categories.searchCategories")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-[42px] pr-[14px] py-[10px] bg-card border border-border rounded-[12px] text-[14px] text-foreground"
        />
      </div>

      {filteredBrands.length > 0 ? (
        <div className="bg-card rounded-[16px] border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="text-left px-[24px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase">
                    {t("brands.brandName")}
                  </th>
                  <th className="text-left px-[24px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase">
                    {t("brands.logo")}
                  </th>
                  <th className="text-left px-[24px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase">
                    {t("brands.website")}
                  </th>
                  <th className="text-left px-[24px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase">
                    {t("common.status")}
                  </th>
                  <th className="text-right px-[24px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((brand) => (
                  <BrandRow
                    key={brand.id}
                    brand={brand}
                    onEdit={handleEdit}
                    onDelete={setDeleteId}
                    onToggle={handleToggle}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-[16px] border border-border p-[60px] text-center">
          <Award className="w-[48px] h-[48px] text-muted-foreground mx-auto mb-[12px]" />
          <p className="text-[15px] text-muted-foreground">
            {t("brands.noBrands")}
          </p>
        </div>
      )}

      {showModal && (
        <BrandFormModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={closeModal}
          isEditing={!!editingBrand}
        />
      )}

      {deleteId && (
        <DeleteConfirmModal
          title={t("brands.deleteBrand")}
          message={t("brands.deleteConfirm")}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

export default Brands;
