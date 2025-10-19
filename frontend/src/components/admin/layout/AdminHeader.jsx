import * as React from "react";
import { IconShield, IconChevronDown, IconHome, IconLogout, IconSun, IconMoon } from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/auth-provider";
import { useStore } from "@/store/store";

export function AdminHeader() {
  const { user, refetchAuth } = useAuthContext();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const clearAccessToken = useStore.use.clearAccessToken();

  const handleLogout = async () => {
    try {
      // Clear token from store
      clearAccessToken();
      // Clear token from localStorage as backup
      localStorage.removeItem("accessToken");
      // Navigate immediately to prevent flicker
      navigate("/", { replace: true });
      // Refetch auth after navigation to update user state
      setTimeout(() => refetchAuth(), 100);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleHomeClick = () => {
    // Prevent flicker by avoiding unnecessary state updates
    if (location.pathname === "/") return;
    navigate("/", { replace: true });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14 md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center gap-2 px-3 md:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#dashboard">
                <IconShield className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium truncate">
                <span className="hidden sm:inline">Admin Dashboard</span>
                <span className="sm:hidden">Admin</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-2 px-3 md:px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 md:h-8 md:w-8 rounded-full touch-manipulation">
              <Avatar className="h-9 w-9 md:h-8 md:w-8">
                <AvatarImage src={user?.profilePic} alt={user?.username} />
                <AvatarFallback>
                  {user?.username?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "admin@movieapp.com"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  Role: {user?.role || "admin"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleHomeClick} className="touch-manipulation">
              <IconHome className="mr-2 h-4 w-4" />
              Home
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme} className="touch-manipulation">
              {theme === "light" ? (
                <>
                  <IconMoon className="mr-2 h-4 w-4" />
                  Dark Mode
                </>
              ) : (
                <>
                  <IconSun className="mr-2 h-4 w-4" />
                  Light Mode
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="touch-manipulation text-red-600">
              <IconLogout className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

