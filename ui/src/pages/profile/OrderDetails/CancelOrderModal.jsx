import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

const CancelOrderModal = ({ isCancelling, onConfirm, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-[16px]">
      <div className="bg-card rounded-[20px] p-[24px] w-full max-w-[400px] shadow-xl border border-border">
        <div className="flex items-center gap-[12px] mb-[16px]">
          <div className="w-[48px] h-[48px] bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-[24px] h-[24px] text-destructive" />
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-foreground">
              {t("order.cancelConfirmTitle")}
            </h3>
          </div>
        </div>
        <p className="text-[14px] text-muted-foreground mb-[24px]">
          {t("order.cancelConfirmMessage")}
        </p>
        <div className="flex gap-[12px]">
          <button
            onClick={onClose}
            disabled={isCancelling}
            className="flex-1 px-[16px] py-[12px] bg-muted text-foreground font-semibold rounded-[12px] hover:bg-muted/80 transition-colors"
          >
            {t("common.no")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isCancelling}
            className="flex-1 px-[16px] py-[12px] bg-destructive text-white font-semibold rounded-[12px] hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {isCancelling ? t("common.loading") : t("order.confirmCancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
