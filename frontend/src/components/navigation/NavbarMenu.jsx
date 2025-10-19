import React from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { name: "Movies", href: "/movies" },
  { name: "About", href: "/about" },
];

const NavbarMenu = ({ 
  isMobile = false, 
  className = "",
  onItemClick 
}) => {
  const baseClasses = isMobile 
    ? "space-y-4 text-base" 
    : "flex gap-8 text-sm";
    
  const itemClasses = isMobile 
    ? "text-muted-foreground hover:text-foreground block py-2 px-3 rounded-lg transition-all duration-200 hover:bg-accent/50 hover:scale-[1.02]"
    : "text-muted-foreground hover:text-accent-foreground block duration-150";

  return (
    <ul className={`${baseClasses} ${className}`}>
      {menuItems.map((item, index) => (
        <li key={index}>
          <Link
            to={item.href}
            className={itemClasses}
            onClick={onItemClick}
          >
            <span>{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavbarMenu;
