import { useState, useEffect } from "react";
import { Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import dataVisual from "@/assets/data-visual.jpg";

export const AboutSection = () => {
  const defaultAbout = "Experienced sales administrator with 6+ years in the IT and Telecommunications industry, proficient in customer service and sales support. I am a young professional with a strong foundation in Information Systems, E-logistics as well as Data Analytics with a current goal and great interest to become a junior business analyst.";
  
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(defaultAbout);

  useEffect(() => {
    const saved = localStorage.getItem("aboutText");
    if (saved) setAboutText(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem("aboutText", aboutText);
    setIsEditing(false);
  };

  return (
    <section id="about" className="min-h-screen flex items-center py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-foreground">About Me</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              {isEditing ? (
                <Textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  className="min-h-[200px] text-lg"
                />
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {aboutText}
                </p>
              )}
            </div>
            <div className="order-1 md:order-2">
              <img
                src={dataVisual}
                alt="Data Analytics Visualization"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
