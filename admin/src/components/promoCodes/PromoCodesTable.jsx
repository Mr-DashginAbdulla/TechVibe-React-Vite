import { useTranslation } from "react-i18next";
import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const PromoCodesTable = ({ promoCodes, onEdit, onDelete, onToggleActive }) => {
  const { t } = useTranslation();

  const formatDiscount = (promo) => {
    if (promo.type === "percentage") return `${promo.discount}%`;
    return `$${promo.discount}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-[20px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t("promoCodes.code")}
              </th>
              <th className="text-left px-[20px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t("promoCodes.type")}
              </th>
              <th className="text-left px-[20px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t("promoCodes.discount")}
              </th>
              <th className="text-left px-[20px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t("promoCodes.minOrder")}
              </th>
              <th className="text-left px-[20px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t("promoCodes.usage")}
              </th>
              <th className="text-left px-[20px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t("promoCodes.expires")}
              </th>
              <th className="text-left px-[20px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t("promoCodes.status")}
              </th>
              <th className="text-right px-[20px] py-[14px] text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {promoCodes.map((promo) => (
              <tr
                key={promo.id}
                className="hover:bg-secondary transition-colors"
              >
                <td className="px-[20px] py-[16px]">
                  <span className="px-[10px] py-[4px] bg-primary/10 text-primary rounded-[6px] text-[13px] font-mono font-semibold">
                    {promo.code}
                  </span>
                </td>
                <td className="px-[20px] py-[16px]">
                  <span
                    className={`px-[8px] py-[3px] rounded-[6px] text-[12px] font-medium ${
                      promo.type === "percentage"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {promo.type === "percentage"
                      ? t("promoCodes.percentage")
                      : t("promoCodes.fixed")}
                  </span>
                </td>
                <td className="px-[20px] py-[16px] text-[14px] font-semibold text-foreground">
                  {formatDiscount(promo)}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-foreground">
                  ${promo.minOrder}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-foreground">
                  {promo.usedCount}
                  {promo.maxUses !== null ? ` / ${promo.maxUses}` : ""}
                </td>
                <td className="px-[20px] py-[16px] text-[14px] text-foreground">
                  {formatDate(promo.expiresAt)}
                </td>
                <td className="px-[20px] py-[16px]">
                  <button
                    onClick={() => onToggleActive(promo)}
                    className="flex items-center gap-[6px] text-[13px] font-medium transition-colors"
                  >
                    {promo.isActive ? (
                      <>
                        <ToggleRight className="w-[20px] h-[20px] text-emerald-500" />
                        <span className="text-emerald-600">
                          {t("promoCodes.active")}
                        </span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-[20px] h-[20px] text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {t("promoCodes.inactive")}
                        </span>
                      </>
                    )}
                  </button>
                </td>
                <td className="px-[20px] py-[16px]">
                  <div className="flex items-center justify-end gap-[8px]">
                    <button
                      onClick={() => onEdit(promo)}
                      className="p-[8px] hover:bg-primary/10 rounded-[8px] text-muted-foreground hover:text-primary transition-colors"
                      title={t("common.edit")}
                    >
                      <Pencil className="w-[16px] h-[16px]" />
                    </button>
                    <button
                      onClick={() => onDelete(promo)}
                      className="p-[8px] hover:bg-red-50 rounded-[8px] text-muted-foreground hover:text-destructive transition-colors"
                      title={t("common.delete")}
                    >
                      <Trash2 className="w-[16px] h-[16px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {promoCodes.map((promo) => (
          <div key={promo.id} className="p-[16px] space-y-[12px]">
            <div className="flex items-start justify-between">
              <span className="px-[10px] py-[4px] bg-[#EFF6FF] text-[#3B82F6] rounded-[6px] text-[13px] font-mono font-semibold">
                {promo.code}
              </span>
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={() => onEdit(promo)}
                  className="p-[8px] hover:bg-blue-50 rounded-[8px] text-[#6B7280] hover:text-[#3B82F6] transition-colors"
                >
                  <Pencil className="w-[16px] h-[16px]" />
                </button>
                <button
                  onClick={() => onDelete(promo)}
                  className="p-[8px] hover:bg-red-50 rounded-[8px] text-[#6B7280] hover:text-[#EF4444] transition-colors"
                >
                  <Trash2 className="w-[16px] h-[16px]" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[8px] text-[13px]">
              <div>
                <span className="text-muted-foreground">
                  {t("promoCodes.discount")}:{" "}
                </span>
                <span className="font-semibold text-foreground">
                  {formatDiscount(promo)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t("promoCodes.minOrder")}:{" "}
                </span>
                <span className="font-medium text-foreground">
                  ${promo.minOrder}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t("promoCodes.usage")}:{" "}
                </span>
                <span className="font-medium text-foreground">
                  {promo.usedCount}
                  {promo.maxUses !== null ? ` / ${promo.maxUses}` : ""}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t("promoCodes.expires")}:{" "}
                </span>
                <span className="font-medium text-foreground">
                  {formatDate(promo.expiresAt)}
                </span>
              </div>
            </div>
            <button
              onClick={() => onToggleActive(promo)}
              className="flex items-center gap-[6px] text-[13px] font-medium"
            >
              {promo.isActive ? (
                <>
                  <ToggleRight className="w-[20px] h-[20px] text-emerald-500" />
                  <span className="text-emerald-600">
                    {t("promoCodes.active")}
                  </span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-[20px] h-[20px] text-[#9CA3AF]" />
                  <span className="text-[#6B7280]">
                    {t("promoCodes.inactive")}
                  </span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default PromoCodesTable;
