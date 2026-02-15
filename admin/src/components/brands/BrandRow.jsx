import {
  Edit,
  Trash2,
  Award,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const BrandRow = ({ brand, onEdit, onDelete, onToggle }) => {
  const { t } = useTranslation();

  return (
    <tr className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
      <td className="px-[24px] py-[16px]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] bg-[#F3F4F6] rounded-[10px] flex items-center justify-center overflow-hidden">
            {brand.logo?.light || brand.logo?.dark ? (
              <div className="flex gap-1">
                {brand.logo.light && (
                  <img
                    src={brand.logo.light}
                    alt={`${brand.name} Light`}
                    className="w-[14px] h-[14px] object-contain"
                    title="Light Mode Logo"
                  />
                )}
                {brand.logo.dark && (
                  <img
                    src={brand.logo.dark}
                    alt={`${brand.name} Dark`}
                    className="w-[14px] h-[14px] object-contain bg-black/10 rounded-xs"
                    title="Dark Mode Logo"
                  />
                )}
              </div>
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
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[#6B7280]">
              Light: {brand.logo?.light}
            </span>
            <span className="text-[11px] text-[#6B7280]">
              Dark: {brand.logo?.dark}
            </span>
          </div>
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
};

export default BrandRow;
