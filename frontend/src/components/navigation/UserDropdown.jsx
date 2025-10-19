import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Film, Shield, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';

const UserDropdown = ({ user, onLogout, isPending, onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);

  const avatarUrl =
    user?.profilePic ||
    user?.profileUrl ||
    `https://ui-avatars.com/api/?name=${user?.username || user?.name || 'Guest'}&background=1F2937&color=fff`;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle outside click for custom mobile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isMobile]);

  // Handle menu item click with proper event handling
  const handleMenuItemClick = (event) => {
    if (onMenuItemClick) {
      onMenuItemClick(event);
    }
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Custom mobile dropdown content
  const MobileDropdownContent = () => (
    <div 
      ref={dropdownRef}
      className={cn(
        "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-popover text-popover-foreground rounded-md border shadow-md z-[10001] p-1",
        isOpen ? "block" : "hidden"
      )}
    >
      <div className="px-2 py-1.5">
        <div className="text-sm font-medium truncate">
          {user.username || user.name || "User"}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {user.email}
        </div>
      </div>
      <div className="border-t border-border/10 my-1"></div>
      <div className="space-y-1">
        <Link 
          to="/favorites" 
          onClick={handleMenuItemClick}
          className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
        >
          <Heart size={16} className="opacity-60" />
          <span>My Favorites</span>
        </Link>
        {user.role !== 'admin' && (
          <Link 
            to="/dashboard" 
            onClick={handleMenuItemClick}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
          >
            <Film size={16} className="opacity-60" />
            <span>Dashboard</span>
          </Link>
        )}
        {user.role === 'admin' && (
          <Link 
            to="/admin" 
            onClick={handleMenuItemClick}
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
          >
            <Shield size={16} className="opacity-60" />
            <span>Admin Panel</span>
          </Link>
        )}
      </div>
      <div className="border-t border-border/10 my-1"></div>
      <button
        onClick={onLogout}
        disabled={isPending}
        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer text-red-500 focus:text-red-600 disabled:opacity-50"
      >
        <LogOut size={16} className="opacity-60" />
        <span>{isPending ? 'Logging out...' : 'Logout'}</span>
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt="User Avatar" />
              <AvatarFallback>
                {user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm hidden sm:block text-muted-foreground">
              {user.username || user.name || user.email}
            </span>
          </div>
        </Button>
        <MobileDropdownContent />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt="User Avatar" />
              <AvatarFallback>
                {user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm hidden sm:block text-muted-foreground">
              {user.username || user.name || user.email}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-w-64" align="end" sideOffset={4}>
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium truncate">
            {user.username || user.name || "User"}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/favorites" onClick={handleMenuItemClick}>
              <Heart size={16} className="opacity-60 mr-2" />
              <span>My Favorites</span>
            </Link>
          </DropdownMenuItem>
          {user.role !== 'admin' && (
            <DropdownMenuItem asChild>
              <Link to="/dashboard" onClick={handleMenuItemClick}>
                <Film size={16} className="opacity-60 mr-2" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          {user.role === 'admin' && (
            <DropdownMenuItem asChild>
              <Link to="/admin" onClick={handleMenuItemClick}>
                <Shield size={16} className="opacity-60 mr-2" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="text-red-500 focus:text-red-600"
          disabled={isPending}
        >
          <LogOut size={16} className="opacity-60 mr-2" />
          <span>{isPending ? 'Logging out...' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
