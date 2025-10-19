import React from 'react';
import { Badge } from '../../../ui/badge';
import { IconAlertTriangle } from '@tabler/icons-react';

const ReportedBadge = ({ isReported }) => {
  if (!isReported) return null;
  return (
    <Badge variant="destructive" className="text-xs">
      <IconAlertTriangle className="h-3 w-3 mr-1" />
      Reported
    </Badge>
  );
};

export default ReportedBadge;
