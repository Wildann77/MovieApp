import React, { useState } from "react";
import { useAdminUsers, useUpdateUserRole, useToggleUserStatus, useDeleteUser } from "../../../hooks/useAdminUsers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { toast } from "sonner";
import Avatar from "../../shared/Avatar";
import { UserStatusBadge, UserRoleBadge, UserLoadingTable } from "./shared";
import {
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconUserCheck,
  IconUserX,
  IconShield,
  IconUser,
  IconCalendar,
  IconMail,
  IconX,
  IconRefresh,
  IconClearAll,
  IconTrash,
} from "@tabler/icons-react";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const params = {
    search,
    role: roleFilter === "all" ? undefined : roleFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
    page,
    limit: 10,
  };

  const { data: responseData, isLoading, error, refetch } = useAdminUsers(params);
  
  // Extract data and pagination from response
  const data = responseData?.data || [];
  const pagination = responseData?.pagination || {};
  const stats = responseData || {}; // For statistics cards
  const updateRole = useUpdateUserRole();
  const toggleStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateRole.mutateAsync({ userId, role: newRole });
      setShowRoleDialog(false);
      setSelectedUser(null);
      toast.success("User role updated successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await toggleStatus.mutateAsync({ userId, isActive: !currentStatus });
      setShowStatusDialog(false);
      setSelectedUser(null);
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      refetch();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser.mutateAsync(userId);
      setShowDeleteDialog(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Error toast is handled by the hook
    }
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setPage(1);
  };

  const hasActiveFilters = search || roleFilter !== "all" || statusFilter !== "all";

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground mt-2">Manage user accounts and permissions</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <div className="mb-4">
                Failed to load users. Error: {error.message || "Unknown error"}
              </div>
              <Button onClick={() => refetch()} variant="outline">
                <IconRefresh className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-muted-foreground mt-2">Manage user accounts and permissions</p>
      </div>

      {/* User Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <IconUser className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <IconUserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <IconShield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.adminUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              With admin privileges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <IconCalendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newUsersThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">
              New registrations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Users</label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex gap-2">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  disabled={!hasActiveFilters}
                  className="flex-1"
                >
                  <IconClearAll className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <IconRefresh className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <UserLoadingTable />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(data) && data.length ? (
                    data.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={user.profilePic}
                              alt={user.username}
                              size="sm"
                            />
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <IconMail className="h-3 w-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <UserRoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>
                          <UserStatusBadge isActive={user.isActive} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <IconCalendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {formatDate(user.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(user.lastLogin)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <IconDotsVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowRoleDialog(true);
                                }}
                              >
                                <IconShield className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowStatusDialog(true);
                                }}
                              >
                                {user.isActive ? (
                                  <>
                                    <IconUserX className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <IconUserCheck className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-600 focus:text-red-600"
                              >
                                <IconTrash className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <IconUser className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No users found.</p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filters.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination && Object.keys(pagination).length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                {pagination.totalItems} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={pagination.currentPage <= 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Update Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Role</label>
              <div className="mt-1">
                <UserRoleBadge role={selectedUser?.role} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">New Role</label>
              <Select
                defaultValue={selectedUser?.role}
                onValueChange={(newRole) => handleRoleUpdate(selectedUser?._id, newRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Toggle Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isActive ? 'Deactivate' : 'Activate'} User
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.isActive 
                ? `Are you sure you want to deactivate ${selectedUser?.username}? They will not be able to access the system.`
                : `Are you sure you want to activate ${selectedUser?.username}? They will be able to access the system.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant={selectedUser?.isActive ? "destructive" : "default"}
              onClick={() => handleStatusToggle(selectedUser?._id, selectedUser?.isActive)}
              disabled={toggleStatus.isPending}
            >
              {toggleStatus.isPending 
                ? "Updating..." 
                : selectedUser?.isActive 
                  ? "Deactivate" 
                  : "Activate"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete user <strong>{selectedUser?.username}</strong>? 
              <br />
              <br />
              <strong className="text-red-600">This action cannot be undone.</strong> All user data including:
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>User account and profile</li>
                <li>All movies created by this user</li>
                <li>All reviews written by this user</li>
                <li>All favorites and preferences</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteUser(selectedUser?._id)}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}