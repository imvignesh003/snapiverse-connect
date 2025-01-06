import { Home, Heart, PlusSquare, Search, User, Repeat } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Zone } from "@/components/ZoneSelector";

interface HeaderProps {
  currentZone?: Zone | null;
  onZoneSwitch?: (newZone: Zone) => void;
}

export const Header = ({ currentZone, onZoneSwitch }: HeaderProps) => {
  const { toast } = useToast();

  const handleZoneSwitch = () => {
    if (!currentZone || !onZoneSwitch) return;
    
    const newZone = currentZone === 'productivity' ? 'entertainment' : 'productivity';
    onZoneSwitch(newZone);
    
    toast({
      title: `Switched to ${newZone.charAt(0).toUpperCase() + newZone.slice(1)} Zone`,
      description: "Your feed will be updated accordingly.",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-instagram-primary to-instagram-accent bg-clip-text text-transparent">
          Instagram Clone
        </Link>
        
        <div className="flex items-center gap-6">
          {currentZone && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoneSwitch}
              className="flex items-center gap-2"
            >
              <Repeat className="w-4 h-4" />
              Switch to {currentZone === 'productivity' ? 'Entertainment' : 'Productivity'}
            </Button>
          )}
          
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
      </div>
    </header>
  );
};