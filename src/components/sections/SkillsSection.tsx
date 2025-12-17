import { Sparkles, Plus, X, Code, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SkillsSectionProps {
  isOwner?: boolean;
}

const defaultTechnicalSkills = [
  "Data Analysis",
  "Data Entry",
  "Data Visualisation/Storytelling",
  "CRM",
  "Microsoft Suite",
  "Report Compilation",
];

const defaultSoftSkills = [
  "Customer Service",
  "Sales Support",
  "Communication and Collaboration",
  "Administration",
  "Training and Development",
];

export const SkillsSection = ({ isOwner = false }: SkillsSectionProps) => {
  const [technicalSkills, setTechnicalSkills] = useState<string[]>(defaultTechnicalSkills);
  const [softSkills, setSoftSkills] = useState<string[]>(defaultSoftSkills);
  const [newSkill, setNewSkill] = useState("");
  const [skillType, setSkillType] = useState<"technical" | "soft">("technical");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const savedTechnical = localStorage.getItem("technicalSkills");
    const savedSoft = localStorage.getItem("softSkills");
    if (savedTechnical) setTechnicalSkills(JSON.parse(savedTechnical));
    if (savedSoft) setSoftSkills(JSON.parse(savedSoft));
  }, []);

  const handleAdd = () => {
    if (newSkill.trim()) {
      if (skillType === "technical") {
        const updated = [...technicalSkills, newSkill.trim()];
        setTechnicalSkills(updated);
        localStorage.setItem("technicalSkills", JSON.stringify(updated));
      } else {
        const updated = [...softSkills, newSkill.trim()];
        setSoftSkills(updated);
        localStorage.setItem("softSkills", JSON.stringify(updated));
      }
      setNewSkill("");
      setIsAdding(false);
    }
  };

  const handleRemove = (type: "technical" | "soft", index: number) => {
    if (type === "technical") {
      const updated = technicalSkills.filter((_, i) => i !== index);
      setTechnicalSkills(updated);
      localStorage.setItem("technicalSkills", JSON.stringify(updated));
    } else {
      const updated = softSkills.filter((_, i) => i !== index);
      setSoftSkills(updated);
      localStorage.setItem("softSkills", JSON.stringify(updated));
    }
  };

  return (
    <section id="skills" className="min-h-screen flex items-center py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
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
            <div className="mb-8 flex gap-2 flex-wrap">
              <Select value={skillType} onValueChange={(v) => setSkillType(v as "technical" | "soft")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="soft">Soft Skill</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Enter a new skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                className="flex-1 min-w-[200px]"
              />
              <Button onClick={handleAdd}>Add</Button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-12">
            {/* Technical Skills */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Code className="h-6 w-6 text-accent" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {technicalSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-base py-2 px-4 hover:bg-accent transition-colors group"
                  >
                    {skill}
                    {isOwner && (
                      <button
                        onClick={() => handleRemove("technical", index)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-accent" />
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {softSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-base py-2 px-4 hover:bg-accent transition-colors group"
                  >
                    {skill}
                    {isOwner && (
                      <button
                        onClick={() => handleRemove("soft", index)}
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
        </div>
      </div>
    </section>
  );
};
