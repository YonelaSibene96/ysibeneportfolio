import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { ArrowNavigation } from "@/components/ArrowNavigation";
import { PortfolioChatbot } from "@/components/PortfolioChatbot";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import Copyright from "@/components/Copyright";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const sections = ["home", "about", "education", "certifications", "skills", "experience", "projects", "contact"];

// Owner's user ID - only this user can edit the portfolio
const OWNER_ID = "36ca3d56-ae25-4db9-be1e-400563633555";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if current user is the owner
  const isOwner = user?.id === OWNER_ID;

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleArrowNavigation = (direction: "up" | "down" | "left" | "right") => {
    const currentIndex = sections.indexOf(activeSection);

    if (direction === "up" && currentIndex > 0) {
      navigateToSection(sections[currentIndex - 1]);
    } else if (direction === "down" && currentIndex < sections.length - 1) {
      navigateToSection(sections[currentIndex + 1]);
    } else if (direction === "left" && currentIndex > 0) {
      navigateToSection(sections[currentIndex - 1]);
    } else if (direction === "right" && currentIndex < sections.length - 1) {
      navigateToSection(sections[currentIndex + 1]);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/");
    }
  };

  return (
    <div className="relative">
      <Navigation activeSection={activeSection} onNavigate={navigateToSection} />
      <ArrowNavigation onNavigate={handleArrowNavigation} />
      <PortfolioChatbot />
      
      {isOwner && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="rounded-full"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )}

      <HeroSection isOwner={isOwner} />
      <AboutSection isOwner={isOwner} />
      <EducationSection isOwner={isOwner} />
      <CertificationsSection isOwner={isOwner} />
      <SkillsSection />
      <ExperienceSection isOwner={isOwner} />
      <ProjectsSection isOwner={isOwner} />
      <ContactSection isOwner={isOwner} />
      <Copyright />
    </div>
  );
};

export default Index;
