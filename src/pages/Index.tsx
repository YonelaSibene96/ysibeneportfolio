import { useState, useEffect } from "react";
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

const sections = ["home", "about", "education", "certifications", "skills", "experience", "projects", "contact"];

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

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

  return (
    <div className="relative">
      <Navigation activeSection={activeSection} onNavigate={navigateToSection} />
      <ArrowNavigation onNavigate={handleArrowNavigation} />
      <PortfolioChatbot />

      <HeroSection />
      <AboutSection />
      <EducationSection />
      <CertificationsSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
};

export default Index;
