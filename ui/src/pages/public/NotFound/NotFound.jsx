import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const errorConfigs = {
  404: {
    icon: "🔌",
    gradient: "from-violet-500/20 to-blue-500/20",
    accent: "violet",
  },
  401: {
    icon: "🔒",
    gradient: "from-amber-500/20 to-orange-500/20",
    accent: "amber",
  },
  403: {
    icon: "🚫",
    gradient: "from-red-500/20 to-pink-500/20",
    accent: "red",
  },
  500: {
    icon: "⚡",
    gradient: "from-red-500/20 to-orange-500/20",
    accent: "red",
  },
  503: {
    icon: "🔧",
    gradient: "from-blue-500/20 to-cyan-500/20",
    accent: "blue",
  },
};

function DisconnectedLogo({ code }) {
  const config = errorConfigs[code] || errorConfigs[404];

  return (
    <div className="relative flex items-center justify-center mb-[32px]">
      {/* Glow */}
      <div
        className={`absolute w-[200px] h-[200px] rounded-full bg-linear-to-br ${config.gradient} blur-[60px] animate-pulse`}
      />

      {/* Cable left */}
      <svg
        className="absolute left-[calc(50%-80px)] top-[50%] -translate-y-1/2 opacity-30"
        width="40"
        height="8"
        viewBox="0 0 40 8"
      >
        <path
          d="M0 4 Q10 0, 20 4 Q30 8, 40 4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted-foreground animate-[sway_3s_ease-in-out_infinite]"
        />
        <circle cx="0" cy="4" r="3" className="fill-muted-foreground" />
      </svg>

      {/* Cable right */}
      <svg
        className="absolute right-[calc(50%-80px)] top-[50%] -translate-y-1/2 opacity-30"
        width="40"
        height="8"
        viewBox="0 0 40 8"
      >
        <path
          d="M0 4 Q10 8, 20 4 Q30 0, 40 4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted-foreground animate-[sway_3s_ease-in-out_infinite_reverse]"
        />
        <circle cx="40" cy="4" r="3" className="fill-muted-foreground" />
      </svg>

      {/* Center icon */}
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-[64px] leading-none drop-shadow-lg">
          {config.icon}
        </span>
      </div>
    </div>
  );
}

export default function ErrorPage({ code = 404 }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-[16px] py-[40px]">
      <div className="max-w-[540px] w-full text-center">
        {/* Disconnected logo animation */}
        <DisconnectedLogo code={code} />

        {/* Error code */}
        <div className="relative inline-block mb-[16px]">
          <span className="text-[100px] sm:text-[120px] font-black leading-none tracking-tight bg-linear-to-br from-foreground/80 to-foreground/40 bg-clip-text text-transparent select-none">
            {code}
          </span>
        </div>

        {/* TechVibe branding */}
        <p className="text-[12px] font-semibold uppercase tracking-[4px] text-muted-foreground/60 mb-[8px]">
          TechVibe
        </p>

        {/* Title */}
        <h1 className="text-[22px] sm:text-[26px] font-bold text-foreground mb-[10px]">
          {t(`errors.${code}.title`)}
        </h1>

        {/* Description */}
        <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed mb-[28px] max-w-[400px] mx-auto">
          {t(`errors.${code}.description`)}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px]">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-[8px] px-[20px] py-[12px] rounded-[12px] bg-primary text-primary-foreground font-semibold text-[14px] hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            <svg
              className="w-[16px] h-[16px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
              />
            </svg>
            {t("common.goToHome")}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-[8px] px-[20px] py-[12px] rounded-[12px] border border-border text-foreground font-semibold text-[14px] hover:bg-muted transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg
              className="w-[16px] h-[16px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("errors.goBack")}
          </button>
        </div>

        {/* Help text */}
        <p className="text-[12px] text-muted-foreground/50 mt-[32px]">
          {t("errors.helpText")}
        </p>
      </div>

      {/* Keyframe animation for cables */}
      <style>{`
        @keyframes sway {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
      `}</style>
    </div>
  );
}
