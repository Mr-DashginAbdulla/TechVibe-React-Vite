import { useTranslation } from "react-i18next";

const DeleteConfirmModal = ({ title, message, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[16px]">
      <div className="bg-card rounded-[20px] w-full max-w-[400px] p-[24px] shadow-2xl">
        <h3 className="text-[18px] font-bold text-foreground mb-[8px]">
          {title}
        </h3>
        <p className="text-[14px] text-muted-foreground mb-[24px]">{message}</p>
        <div className="flex items-center justify-end gap-[12px]">
          <button
            onClick={onCancel}
            className="px-[20px] py-[10px] text-[14px] font-medium text-muted-foreground hover:bg-accent rounded-[10px] transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-[20px] py-[10px] bg-destructive text-white text-[14px] font-medium rounded-[10px] hover:bg-destructive/90 transition-colors"
          >
            {t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
