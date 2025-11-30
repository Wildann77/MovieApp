import React from 'react';
import { Menu, X } from 'lucide-react';

const MobileMenuButton = ({ isOpen, onToggle, className = "" }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? "Close Menu" : "Open Menu"}
      className={`relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 rounded-lg hover:bg-accent/50 transition-all duration-200 lg:hidden ${className}`}
    >
      <Menu className={`m-auto size-6 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
      <X className={`absolute inset-0 m-auto size-6 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0'}`} />
    </button>
  );
};

export default MobileMenuButton;
