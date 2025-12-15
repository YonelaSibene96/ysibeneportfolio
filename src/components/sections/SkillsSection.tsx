import { Sparkles, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SkillsSectionProps {
  isOwner?: boolean;
}

export const SkillsSection = ({ isOwner = false }: SkillsSectionProps) => {
  const defaultSkills = [
    "Data Analysis",
    "Customer Service",
    "Data Entry",
    "Data Visualisation/Storytelling",
    "Sales Support",
    "Communication and Collaboration",
    "Administration",
    "Report Compilation",
    "CRM",
    "Microsoft Suite",
    "Training and Development",
  ];

  const [skills, setSkills] = useState<string[]>(defaultSkills);
  const [newSkill, setNewSkill] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("skills");
    if (saved) setSkills(JSON.parse(saved));
  }, []);

  const handleAdd = () => {
    if (newSkill.trim()) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      localStorage.setItem("skills", JSON.stringify(updated));
      setNewSkill("");
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    localStorage.setItem("skills", JSON.stringify(updated));
  };

  return (
    <section id="skills" className="min-h-screen flex items-center py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Sparkles className="h-10 w-10 text-accent" />
              Skills
            </h2>
            {isOwner && (
              <Button onClick={() => setIsAdding(!isAdding)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            )}
          </div>

          {isOwner && isAdding && (
            <div className="mb-8 flex gap-2">
              <Input
                placeholder="Enter a new skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              />
              <Button onClick={handleAdd}>Add</Button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-base py-2 px-4 hover:bg-accent transition-colors group"
              >
                {skill}
                {isOwner && (
                  <button
                    onClick={() => handleRemove(index)}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
