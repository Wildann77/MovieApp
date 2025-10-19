import React, { useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/auth-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/store/store";
import { toast } from "sonner";
import { Logout } from "@/lib/service";
import NavbarBrand from "./navigation/NavbarBrand";
import NavbarMenu from "./navigation/NavbarMenu";
import UserDropdown from "./navigation/UserDropdown";
import AuthButtons from "./navigation/AuthButtons";
import MobileMenuButton from "./navigation/MobileMenuButton";
import { SearchBar } from "./navigation/SearchBar";


export const Navbar = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const { user, isLoading, setIsLoggingOut } = useAuthContext();
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAccessToken = useStore.use.clearAccessToken();

  // Hide navbar on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const isAdminPage = location.pathname.startsWith('/admin');

  const { mutate, isPending } = useMutation({
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

  const handleLogout = useCallback(() => {
    if (isPending) return;
    mutate();
  }, [isPending, mutate]);

  // Close mobile menu function
  const closeMobileMenu = useCallback(() => {
    setMenuState(false);
  }, []);

  // Handle outside click to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close menu if clicking on search results or search dropdown
      if (event.target.closest('[data-search-result]') || 
          event.target.closest('[data-search-dropdown]') ||
          event.target.closest('[data-search-input]')) {
        return;
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMenuState(false);
      }
    };

    if (menuState) {
      // Use capture phase to handle before other events
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }
  }, [menuState]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuState(false);
  }, [location.pathname]);

  // Handle mobile detection and scroll effects
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Don't render navbar on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed z-50 w-full px-2 transition-all duration-300",
          (isDashboardPage || isAdminPage) && "hidden" // Hide navbar on dashboard and admin pages
        )}
      >
        {/* Background Glow Effects - More subtle and mobile optimized */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-chart-1/5 to-chart-2/5 opacity-30 pointer-events-none"></div>
        <div className={cn(
          "absolute top-0 bg-primary/3 rounded-full blur-3xl pointer-events-none transition-all duration-300",
          isMobile ? "left-1/2 -translate-x-1/2 w-64 h-64" : "left-1/4 w-96 h-96"
        )}></div>
        <div className={cn(
          "absolute bottom-0 bg-chart-2/3 rounded-full blur-3xl pointer-events-none transition-all duration-300",
          isMobile ? "right-1/2 translate-x-1/2 w-64 h-64" : "right-1/4 w-96 h-96"
        )}></div>
        
        <div
          className={cn(
            "relative z-10 mx-auto mt-2 transition-all duration-300",
            isMobile ? "max-w-full px-4" : "max-w-6xl px-6 lg:px-12",
            isScrolled && !isMobile && "bg-background/80 max-w-4xl rounded-2xl border-border/20 backdrop-blur-md lg:px-5",
            isScrolled && isMobile && "bg-background/90 backdrop-blur-md"
          )}
        >
          <div className={cn(
            "relative flex flex-wrap items-center justify-between transition-all duration-300",
            isMobile ? "gap-4 py-4" : "gap-6 py-3 lg:gap-2 lg:py-4"
          )}>
            {/* ===== Logo & Search & Burger ===== */}
            <div className="flex w-full items-center justify-between lg:w-auto lg:gap-2">
              <NavbarBrand />
              {/* ===== Search Bar (Desktop) ===== */}
              <div className="hidden lg:block" style={{ width: '288px', pointerEvents: 'none' }}>
                <div style={{ pointerEvents: 'auto' }}>
                  <SearchBar isScrolled={isScrolled} isMobile={isMobile} />
                </div>
              </div>
              <MobileMenuButton 
                isOpen={menuState} 
                onToggle={() => setMenuState(!menuState)} 
              />
            </div>

            {/* ===== Navigation Menu (Desktop) ===== */}
            <div className="absolute left-[55%] top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
              <NavbarMenu />
            </div>

            {/* ===== Right Section ===== */}
            <div 
              ref={mobileMenuRef}
              className={cn(
                "w-full flex-wrap items-center justify-end transition-all duration-500 ease-out lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none",
                isMobile && "space-y-6 rounded-3xl border border-border/20 p-6 shadow-xl backdrop-blur-lg",
                menuState 
                  ? "flex bg-background/95 backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-500" 
                  : "hidden lg:flex"
              )}
              style={{ 
                position: 'relative',
                zIndex: 1000 // Ensure mobile menu has sufficient z-index
              }}
            >
              <div className="lg:hidden w-full space-y-6">
                {/* Mobile Search Bar */}
                <div className="w-full" style={{ pointerEvents: 'none' }}>
                  <div style={{ pointerEvents: 'auto' }}>
                    <SearchBar isScrolled={isScrolled} isMobile={isMobile} />
                  </div>
                </div>
                
                {/* Mobile Navigation Menu */}
                <div className="border-t border-border/10 pt-4">
                  <NavbarMenu isMobile={true} onItemClick={() => setMenuState(false)} />
                </div>

                {/* Mobile Auth Section */}
                <div className="border-t border-border/10 pt-4">
                  <div className="flex flex-col space-y-4 items-center relative">
                    {/* Theme Toggle */}
                    <div className="w-full flex justify-center">
                      <ThemeToggle />
                    </div>

                    {/* If user logged in → Avatar Dropdown */}
                    {!isLoading && user ? (
                      <div className="w-full">
                        <UserDropdown 
                          user={user} 
                          onLogout={handleLogout} 
                          isPending={isPending}
                          onMenuItemClick={closeMobileMenu}
                        />
                      </div>
                    ) : (
                      <div className="w-full">
                        <AuthButtons isScrolled={isScrolled} onMenuItemClick={closeMobileMenu} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ===== Desktop Theme Toggle + Auth Section ===== */}
              <div className="hidden lg:flex w-fit flex-row gap-6 items-center">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* If user logged in → Avatar Dropdown */}
                {!isLoading && user ? (
                  <UserDropdown 
                    user={user} 
                    onLogout={handleLogout} 
                    isPending={isPending}
                  />
                ) : (
                  <AuthButtons isScrolled={isScrolled} />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
