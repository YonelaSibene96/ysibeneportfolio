import { Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isLoggedIn?: boolean;
}

const menuItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Work Experience" },
  { id: "projects", label: "Personal Projects" },
  { id: "contact", label: "Contact Me" },
];

export const Navigation = ({ activeSection, onNavigate, isLoggedIn = false }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate("home")}
            className="text-lg font-bold text-foreground hover:text-accent transition-colors"
          >
            YS
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {!isLoggedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                className="mr-2 text-foreground border-accent hover:bg-accent hover:text-accent-foreground"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Admin Login
              </Button>
            )}
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onNavigate(item.id)}
                className={`${
                  activeSection === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground hover:bg-muted"
                } transition-colors`}
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {!isLoggedIn && (
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/auth");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start mb-2"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            )}
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start ${
                  activeSection === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
