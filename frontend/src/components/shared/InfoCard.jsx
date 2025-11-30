import React from 'react';

const InfoCard = ({
  title,
  data,
  className = ""
}) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <div className={`bg-card/50 p-4 rounded-lg border border-border ${className}`}>
      <h4 className="font-semibold text-foreground mb-2">{title}</h4>
      <div className="space-y-2 text-sm text-muted-foreground">
        {Object.entries(data).map(([key, value]) => (
          <p key={key}>
            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>{" "}
            {typeof value === 'string' && value.includes('Date') ? 
              new Date(value).toLocaleDateString() : 
              value
            }
          </p>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
