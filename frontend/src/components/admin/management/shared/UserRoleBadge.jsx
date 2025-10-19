import React from 'react';
import { Badge } from '../../../ui/badge';

const UserRoleBadge = ({ role }) => (
  <Badge variant={role === "admin" ? "default" : "secondary"}>
    {role === "admin" ? "Admin" : "User"}
  </Badge>
);

export default UserRoleBadge;
