import { Link } from "react-router-dom";
import { CheckCircle, RefreshCcw, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";

const VerifyCode = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] flex items-center justify-center p-[16px]">
      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-xl p-[40px]">
        {/* Header */}
        <div className="text-center mb-[32px]">
          <h1 className="text-[28px] font-bold text-[#111827] mb-[8px]">
            Reset Your Password
          </h1>
          <p className="text-[15px] text-[#6B7280]">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-[24px]">
          <div className="w-[72px] h-[72px] bg-[#EEF2FF] rounded-full flex items-center justify-center">
            <CheckCircle className="w-[36px] h-[36px] text-[#3B82F6]" />
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-[12px] px-[16px] py-[12px] flex items-center gap-[10px] mb-[24px]">
          <CheckCircle className="w-[18px] h-[18px] text-[#22C55E] shrink-0" />
          <p className="text-[14px] text-[#15803D]">
            Reset link sent to example@example.com
          </p>
        </div>

        {/* Verification Code */}
        <div className="mb-[24px]">
          <label className="block text-[15px] font-medium text-[#111827] mb-[8px]">
            Verification Code
          </label>
          <p className="text-[13px] text-[#6B7280] mb-[16px]">
            Enter the 6-digit code sent to example@example.com
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
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-[48px] h-[56px] text-center text-[20px] font-semibold border border-[#E5E7EB] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
              />
            ))}
          </div>
        </div>

        {/* Verify Button */}
        <button
          type="button"
          className="flex items-center justify-center gap-[8px] w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-[14px] rounded-[12px] transition-colors mb-[16px]"
        >
          Verify Code
          <CheckCircle className="w-[18px] h-[18px]" />
        </button>

        {/* Resend Code */}
        <button
          type="button"
          className="flex items-center justify-center gap-[8px] w-full text-[#6B7280] hover:text-[#374151] font-medium py-[12px] transition-colors"
        >
          <RefreshCcw className="w-[16px] h-[16px]" />
          Resend Code
        </button>

        {/* Back to Login */}
        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-[8px] w-full mt-[16px] text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors"
        >
          <ArrowLeft className="w-[16px] h-[16px]" />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyCode;
