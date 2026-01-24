import { Link } from "react-router-dom";
import { Check, CheckCircle } from "lucide-react";

const ResetSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] flex items-center justify-center p-[16px]">
      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-xl p-[40px]">
        {/* Header */}
        <div className="text-center mb-[32px]">
          <h1 className="text-[28px] font-bold text-[#111827] mb-[8px]">
            Reset Your Password
          </h1>
          <p className="text-[15px] text-[#6B7280]">
            Your password reset is complete
          </p>
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-[24px]">
          <div className="w-[72px] h-[72px] bg-[#F0FDF4] rounded-full flex items-center justify-center">
            <Check className="w-[36px] h-[36px] text-[#22C55E]" />
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-[12px] px-[16px] py-[12px] flex items-center gap-[10px] mb-[24px]">
          <CheckCircle className="w-[18px] h-[18px] text-[#22C55E] shrink-0" />
          <p className="text-[14px] text-[#15803D]">
            Verification successful! Redirecting to reset password...
          </p>
        </div>

        {/* Info Text */}
        <div className="text-center mb-[32px]">
          <h2 className="text-[18px] font-semibold text-[#111827] mb-[8px]">
            Password reset link has been sent to your email
          </h2>
          <p className="text-[14px] text-[#6B7280]">
            Check your inbox and follow the instructions to create a new
            password
          </p>
        </div>

        {/* Back to Login Button */}
        <Link
          to="/auth/login"
          className="flex items-center justify-center w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-[14px] rounded-[12px] transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetSuccess;
