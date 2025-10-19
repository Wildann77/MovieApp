import * as React from "react";
import {
  IconDashboard,
  IconUsers,
  IconMovie,
  IconMessageCircle,
  IconShield,
  IconLogout,
  IconUser,
  IconVideo,
  IconUserEdit,
  IconTag,
  IconHome,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { NavMain } from "@/components/dashboard/navigation/nav-main";
import { NavSecondary } from "@/components/dashboard/navigation/nav-secondary";
import { NavUser } from "@/components/dashboard/navigation/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/auth-provider";
import { useStore } from "@/store/store";
import { Logout } from "@/lib/service";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#dashboard",
      icon: IconDashboard,
    },
    {
      title: "User Management",
      url: "#users",
      icon: IconUsers,
    },
    {
      title: "Movie Management",
      url: "#movies",
      icon: IconMovie,
    },
    {
      title: "Review Moderation",
      url: "#reviews",
      icon: IconMessageCircle,
    },
    {
      title: "Master Data",
      url: "#master-data",
      icon: IconShield,
      children: [
        {
          title: "Actors",
          url: "#actors",
          icon: IconUser,
        },
        {
          title: "Directors",
          url: "#directors",
          icon: IconVideo,
        },
        {
          title: "Writers",
          url: "#writers",
          icon: IconUserEdit,
        },
        {
          title: "Genres",
          url: "#genres",
          icon: IconTag,
        },
      ],
    },
  ],
};

export function AdminSidebar({ activeTab, setActiveTab, ...props }) {
  const { user, setIsLoggingOut } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAccessToken = useStore.use.clearAccessToken();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      // Set logging out flag to prevent route redirects
      setIsLoggingOut(true);
      // Clear token first - this will immediately update AuthContext
      clearAccessToken();
      // Reset all queries to clear cached data
      queryClient.resetQueries({ queryKey: ["authUser"] });
      queryClient.clear();
      // Navigate immediately - AuthContext will handle the state
      navigate("/", { replace: true });
      toast.success("Logged out successfully");
      // Reset logging out flag after navigation
      setTimeout(() => setIsLoggingOut(false), 100);
    },
    onError: (error) => {
      setIsLoggingOut(false);
      toast.error(error.message || "Failed to logout");
    },
  });

  const handleNavClick = (url) => {
    const tab = url.replace("#", "");
    setActiveTab(tab);
    // Navigate to the specific route
    navigate(`/admin/${tab}`);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    if (isPending) return;
    logout();
  };

  const adminUser = {
    name: user?.username || "Admin",
    email: user?.email || "admin@movieapp.com",
    avatar: user?.profilePic || "/avatars/admin.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <button onClick={() => navigate("/admin")}>
                <IconShield className="!size-5" />
                <span className="text-base font-semibold">Admin Panel</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} activeTab={activeTab} onNavClick={handleNavClick} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconHome className="h-4 w-4" />
              Home
            </button>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <IconLogout className="h-4 w-4" />
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

