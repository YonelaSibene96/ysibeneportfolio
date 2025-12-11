import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const menuItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const Navigation = ({ activeSection, onNavigate }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
