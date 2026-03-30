import React from 'react';

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center p-[40px] text-center">
      {Icon && (
        <div className="w-[64px] h-[64px] bg-muted/50 rounded-full flex items-center justify-center mb-[16px]">
          <Icon className="w-[32px] h-[32px] text-muted-foreground" />
        </div>
      )}
      <h3 className="text-[16px] font-semibold text-foreground mb-[8px]">
        {title}
      </h3>
      {description && (
        <p className="text-[14px] text-muted-foreground max-w-[300px]">
          {description}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
