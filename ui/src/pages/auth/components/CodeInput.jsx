import { useTranslation } from "react-i18next";
import { CheckCircle, RefreshCcw } from "lucide-react";

const CodeInput = ({
  code,
  inputRefs,
  onCodeChange,
  onKeyDown,
  onPaste,
  onVerify,
  onResend,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-center mb-[24px]">
        <div className="w-[72px] h-[72px] bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-[36px] h-[36px] text-primary" />
        </div>
      </div>

      <div className="bg-success/10 border border-success/20 rounded-[12px] px-[16px] py-[12px] flex items-center gap-[10px] mb-[24px]">
        <CheckCircle className="w-[18px] h-[18px] text-success shrink-0" />
        <p className="text-[14px] text-success">
          {t("auth.passwordResetLinkSent")}
        </p>
      </div>

      <div className="mb-[24px]">
        <label className="block text-[15px] font-medium text-foreground mb-[8px]">
          {t("auth.verificationCode")}
        </label>
        <p className="text-[13px] text-muted-foreground mb-[16px]">
          {t("auth.enter6DigitCode")}
        </p>

        <div className="flex justify-center gap-[10px]">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => onCodeChange(index, e.target.value)}
              onKeyDown={(e) => onKeyDown(index, e)}
              onPaste={index === 0 ? onPaste : undefined}
              className="w-[48px] h-[56px] text-center text-[20px] font-semibold border border-input bg-background rounded-[12px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onVerify}
        className="flex items-center justify-center gap-[8px] w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-[14px] rounded-[12px] transition-colors mb-[16px]"
      >
        {t("auth.verifyCode")}
        <CheckCircle className="w-[18px] h-[18px]" />
      </button>

      <button
        type="button"
        onClick={onResend}
        className="flex items-center justify-center gap-[8px] w-full text-muted-foreground hover:text-foreground font-medium py-[12px] transition-colors"
      >
        <RefreshCcw className="w-[16px] h-[16px]" />
        {t("auth.resendCode")}
      </button>
    </>
  );
};

export default CodeInput;
