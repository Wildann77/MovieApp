import * as React from "react"
import {
  IconMovie,
  IconUser,
  IconUsers,
  IconEdit,
  IconSettings,
  IconLogout,
  IconVideo, // ✅ ganti pakai IconVideo untuk directors
  IconUserEdit,
  IconUserPlus,
  IconPlus, // ✅ ganti pakai IconPlus untuk create movie
  IconTag, // ✅ ganti pakai IconTag untuk genres
  IconHome,
} from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useStore } from "@/store/store"
import { Logout } from "@/lib/service"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuthContext } from "@/context/auth-provider"

const data = {
  user: {
    name: "Admin User",
    email: "admin@movieapp.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Movies",
      url: "#movies",
      icon: IconMovie,
    },
    {
      title: "Create Movie",
      url: "#create-movie",
      icon: IconPlus,
    },
    {
      title: "Actors",
      url: "#actors",
      icon: IconUsers,
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
    {
      title: "Profile",
      url: "#profile",
      icon: IconUser,
    },
  ],
}

export function AppSidebar({ activeTab, setActiveTab, ...props }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const clearAccessToken = useStore.use.clearAccessToken()
  const { setIsLoggingOut } = useAuthContext()

  const { mutate: logout, isPending } = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      // Set logging out flag to prevent route redirects
      setIsLoggingOut(true)
      // Clear token first - this will immediately update AuthContext
      clearAccessToken()
      // Reset all queries to clear cached data
      queryClient.resetQueries({ queryKey: ["authUser"] })
      queryClient.clear()
      // Navigate immediately - AuthContext will handle the state
      navigate("/", { replace: true })
      toast.success("Logged out successfully")
      // Reset logging out flag after navigation
      setTimeout(() => setIsLoggingOut(false), 100)
    },
    onError: (error) => {
      setIsLoggingOut(false)
      toast.error(error.message || "Failed to logout")
    },
  })

  const handleNavClick = (url) => {
    const tab = url.replace("#", "")
    setActiveTab(tab)
    // Navigate to the specific route
    navigate(`/dashboard/${tab}`)
  }

  const handleLogout = () => {
    if (isPending) return
    logout()
  }

  const handleHomeClick = () => {
    navigate("/")
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <button onClick={() => navigate("/dashboard")}>
                <IconMovie className="!size-5" />
                <span className="text-base font-semibold">Movie Admin</span>
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
  )
}
