import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';

const FormCard = ({
  title,
  description,
  icon,
  children,
  className = "",
  showSeparator = true,
  headerActions,
  ...props
}) => {
  return (
    <Card className={cn("bg-card", className)} {...props}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg">
              {icon}
            </div>
          )}
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
        {headerActions}
      </CardHeader>

      {showSeparator && <Separator />}

      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default FormCard;
