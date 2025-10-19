import React from 'react';
import { Badge } from '../../../ui/badge';

const UserStatusBadge = ({ isActive }) => (
  <Badge variant={isActive ? "default" : "destructive"}>
    {isActive ? "Active" : "Inactive"}
  </Badge>
);

export default UserStatusBadge;
