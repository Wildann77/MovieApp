import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  PlayCircle,
  Users,
  Star,
  Calendar,
  Film,
  Award
} from 'lucide-react';

export default function FooterGlow() {
  const handleLinkClick = () => {
    // Scroll to top when navigating to a new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-background text-foreground overflow-hidden mt-auto">
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-2">
              <PlayCircle className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                MovieApp
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover amazing movies, explore actor profiles, and share your reviews. 
              Your ultimate destination for everything cinema.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-300 group">
                <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-300 group">
                <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-300 group">
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-300 group">
                <Youtube className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  onClick={handleLinkClick}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <PlayCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/movies" 
                  onClick={handleLinkClick}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <Star className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>All Movies</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  onClick={handleLinkClick}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  onClick={handleLinkClick}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <Calendar className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Genres</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/movies?genre=Action" onClick={handleLinkClick} className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group">
                  <Film className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Action</span>
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Comedy" onClick={handleLinkClick} className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group">
                  <Film className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Comedy</span>
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Drama" onClick={handleLinkClick} className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group">
                  <Film className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Drama</span>
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Horror" onClick={handleLinkClick} className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group">
                  <Film className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Horror</span>
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Romance" onClick={handleLinkClick} className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group">
                  <Film className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Romance</span>
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Sci-Fi" onClick={handleLinkClick} className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center space-x-2 group">
                  <Film className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Sci-Fi</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-sm">contact@movieapp.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-sm">
                  123 Cinema Street<br />
                  Movie City, MC 12345
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-muted-foreground text-sm">
            <span>© 2025 MovieApp. Made with</span>
            <Heart className="h-4 w-4 text-destructive fill-current animate-pulse" />
            <span>for movie lovers everywhere.</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm flex items-center space-x-1 group">
              <Award className="h-3 w-3 group-hover:scale-110 transition-transform" />
              <span>Privacy Policy</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm flex items-center space-x-1 group">
              <Award className="h-3 w-3 group-hover:scale-110 transition-transform" />
              <span>Terms of Service</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm flex items-center space-x-1 group">
              <Award className="h-3 w-3 group-hover:scale-110 transition-transform" />
              <span>Cookie Policy</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
