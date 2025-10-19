import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const AuthButtons = ({ isScrolled, className = "", onMenuItemClick }) => {
  return (
    <div className={`flex flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit items-center ${className}`}>
      <Button
        asChild
        variant="outline"
        size="sm"
        className={cn(isScrolled && "lg:hidden")}
      >
        <Link to="/login" onClick={onMenuItemClick}>Login</Link>
      </Button>
      <Button
        asChild
        size="sm"
        className={cn(isScrolled && "lg:hidden")}
      >
        <Link to="/signup" onClick={onMenuItemClick}>Sign Up</Link>
      </Button>
      <Button
        asChild
        size="sm"
        className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
      >
        <Link to="/signup" onClick={onMenuItemClick}>Get Started</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
