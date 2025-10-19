import React from 'react';

const PageHeader = ({ 
  icon, 
  title, 
  description, 
  className = "" 
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center gap-4 mb-2">
        {icon && (
          <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-lg">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
