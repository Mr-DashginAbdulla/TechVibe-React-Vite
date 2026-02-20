const SettingsTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-[8px] flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center gap-[8px] px-[16px] py-[12px] rounded-[12px] text-[14px] font-medium transition-colors ${
            activeTab === tab.key
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground border border-border hover:bg-muted hover:text-foreground"
          }`}
        >
          <tab.icon className="w-[18px] h-[18px]" />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabs;
