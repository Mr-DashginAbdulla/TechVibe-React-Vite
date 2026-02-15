import { useTranslation } from "react-i18next";

const DeleteConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[16px]">
      <div className="bg-white rounded-[20px] w-full max-w-[400px] p-[24px] shadow-2xl">
        <h3 className="text-[18px] font-bold text-[#111827] mb-[8px]">
          {title}
        </h3>
        <p className="text-[14px] text-[#6B7280] mb-[24px]">{message}</p>
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
};

export default DeleteConfirmModal;
