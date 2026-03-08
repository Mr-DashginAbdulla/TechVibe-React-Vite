import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Tag, Plus } from "lucide-react";
import { promoCodeService } from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import PromoCodesTable from "@/components/promoCodes/PromoCodesTable";
import PromoCodeFormModal from "@/components/promoCodes/PromoCodeFormModal";

const PromoCodes = () => {
  const { t } = useTranslation();
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [codeToDelete, setCodeToDelete] = useState(null);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const data = await promoCodeService.getAll();
      setPromoCodes(data);
    } catch {
      toast.error(t("messages.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingCode) {
        const updated = await promoCodeService.update(editingCode.id, formData);
        setPromoCodes(
          promoCodes.map((p) => (p.id === editingCode.id ? updated : p)),
        );
        toast.success(t("promoCodes.updateSuccess"));
      } else {
        const newCode = await promoCodeService.create({
          ...formData,
          usedCount: 0,
        });
        setPromoCodes([...promoCodes, newCode]);
        toast.success(t("promoCodes.createSuccess"));
      }
      setShowFormModal(false);
      setEditingCode(null);
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const handleToggleActive = async (promo) => {
    try {
      const updated = await promoCodeService.update(promo.id, {
        isActive: !promo.isActive,
      });
      setPromoCodes(promoCodes.map((p) => (p.id === promo.id ? updated : p)));
      toast.success(
        updated.isActive
          ? t("promoCodes.activated")
          : t("promoCodes.deactivated"),
      );
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const handleDelete = async () => {
    try {
      await promoCodeService.delete(codeToDelete.id);
      setPromoCodes(promoCodes.filter((p) => p.id !== codeToDelete.id));
      toast.success(t("promoCodes.deleteSuccess"));
      setCodeToDelete(null);
    } catch {
      toast.error(t("messages.error"));
    }
  };

  const openEdit = (promo) => {
    setEditingCode(promo);
    setShowFormModal(true);
  };

  const openCreate = () => {
    setEditingCode(null);
    setShowFormModal(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-[20px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px]">
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-foreground flex items-center gap-[10px]">
            <Tag className="w-[24px] h-[24px] text-primary" />
            {t("promoCodes.title")}
          </h1>
          <p className="text-[13px] sm:text-[14px] text-muted-foreground mt-[2px]">
            {promoCodes.length} {t("promoCodes.total")}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-[8px] px-[16px] py-[10px] bg-primary hover:bg-primary/90 text-primary-foreground text-[14px] font-semibold rounded-[12px] transition-colors"
        >
          <Plus className="w-[18px] h-[18px]" />
          {t("promoCodes.addCode")}
        </button>
      </div>

      <div className="bg-card rounded-[16px] border border-border overflow-hidden">
        <PromoCodesTable
          promoCodes={promoCodes}
          onEdit={openEdit}
          onDelete={setCodeToDelete}
          onToggleActive={handleToggleActive}
        />
        {promoCodes.length === 0 && (
          <div className="p-[50px] text-center">
            <Tag className="w-[44px] h-[44px] text-muted-foreground mx-auto mb-[10px]" />
            <p className="text-[15px] text-muted-foreground">
              {t("promoCodes.noCodes")}
            </p>
          </div>
        )}
      </div>

      {showFormModal && (
        <PromoCodeFormModal
          promo={editingCode}
          onSave={handleSave}
          onClose={() => {
            setShowFormModal(false);
            setEditingCode(null);
          }}
        />
      )}

      {codeToDelete && (
        <DeleteConfirmModal
          title={t("promoCodes.deleteCode")}
          message={t("promoCodes.deleteConfirm")}
          onConfirm={handleDelete}
          onCancel={() => setCodeToDelete(null)}
        />
      )}
    </div>
  );
};

export default PromoCodes;
