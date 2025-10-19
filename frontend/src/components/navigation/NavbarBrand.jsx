import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

const NavbarBrand = ({ className = "" }) => {
  return (
    <Link
      to="/"
      aria-label="home"
      className={`flex items-center space-x-2 ${className}`}
    >
      <PlayCircle className="h-8 w-8 text-primary" />
    </Link>
  );
};

export default NavbarBrand;
