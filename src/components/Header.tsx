import { Home, Heart, PlusSquare, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-instagram-primary to-instagram-accent bg-clip-text text-transparent">
          Instagram Clone
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-instagram-primary transition-colors">
            <Home className="w-6 h-6" />
          </Link>
          <button className="hover:text-instagram-primary transition-colors">
            <Search className="w-6 h-6" />
          </button>
          <button className="hover:text-instagram-primary transition-colors">
            <PlusSquare className="w-6 h-6" />
          </button>
          <button className="hover:text-instagram-primary transition-colors">
            <Heart className="w-6 h-6" />
          </button>
          <button className="hover:text-instagram-primary transition-colors">
            <User className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </header>
  );
};