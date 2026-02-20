const ProfileStatsGrid = ({ statCards }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
      {statCards.map((stat) => (
        <div
          key={stat.name}
          className="bg-card rounded-[16px] shadow-sm border border-border p-[20px]"
        >
          <div
            className={`w-[44px] h-[44px] rounded-[12px] flex items-center justify-center mb-[12px] ${
              stat.color === "blue"
                ? "bg-info/10"
                : stat.color === "green"
                  ? "bg-success/10"
                  : stat.color === "purple"
                    ? "bg-primary/10"
                    : "bg-destructive/10"
            }`}
          >
            <stat.icon
              className={`w-[22px] h-[22px] ${
                stat.color === "blue"
                  ? "text-info"
                  : stat.color === "green"
                    ? "text-success"
                    : stat.color === "purple"
                      ? "text-primary"
                      : "text-destructive"
              }`}
            />
          </div>
          <p className="text-[24px] font-bold text-foreground">{stat.value}</p>
          <p className="text-[13px] text-muted-foreground">{stat.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStatsGrid;
