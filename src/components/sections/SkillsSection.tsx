import { Sparkles, Plus, X, Code, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SkillsSectionProps {
  isOwner?: boolean;
}

interface Skill {
  id: string;
  skill_name: string;
  skill_type: "technical" | "soft";
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
  const [technicalSkills, setTechnicalSkills] = useState<Skill[]>([]);
  const [softSkills, setSoftSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [skillType, setSkillType] = useState<"technical" | "soft">("technical");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching skills:", error);
      // Fallback to defaults if no skills exist
      setTechnicalSkills(defaultTechnicalSkills.map((name, i) => ({ id: `default-tech-${i}`, skill_name: name, skill_type: "technical" })));
      setSoftSkills(defaultSoftSkills.map((name, i) => ({ id: `default-soft-${i}`, skill_name: name, skill_type: "soft" })));
    } else if (data && data.length > 0) {
      setTechnicalSkills(data.filter((s) => s.skill_type === "technical") as Skill[]);
      setSoftSkills(data.filter((s) => s.skill_type === "soft") as Skill[]);
    } else {
      // No skills in DB, show defaults
      setTechnicalSkills(defaultTechnicalSkills.map((name, i) => ({ id: `default-tech-${i}`, skill_name: name, skill_type: "technical" })));
      setSoftSkills(defaultSoftSkills.map((name, i) => ({ id: `default-soft-${i}`, skill_name: name, skill_type: "soft" })));
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newSkill.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to add skills", variant: "destructive" });
      return;
    }

    const { data, error } = await supabase
      .from("skills")
      .insert({ skill_name: newSkill.trim(), skill_type: skillType, owner_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    if (skillType === "technical") {
      setTechnicalSkills([...technicalSkills, data as Skill]);
    } else {
      setSoftSkills([...softSkills, data as Skill]);
    }
    setNewSkill("");
    setIsAdding(false);
    toast({ title: "Success", description: "Skill added successfully" });
  };

  const handleRemove = async (type: "technical" | "soft", skillId: string) => {
    // Skip deletion for default skills (they're not in DB)
    if (skillId.startsWith("default-")) {
      if (type === "technical") {
        setTechnicalSkills(technicalSkills.filter((s) => s.id !== skillId));
      } else {
        setSoftSkills(softSkills.filter((s) => s.id !== skillId));
      }
      return;
    }

    const { error } = await supabase.from("skills").delete().eq("id", skillId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    if (type === "technical") {
      setTechnicalSkills(technicalSkills.filter((s) => s.id !== skillId));
    } else {
      setSoftSkills(softSkills.filter((s) => s.id !== skillId));
    }
    toast({ title: "Success", description: "Skill removed" });
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
                {technicalSkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="text-base py-2 px-4 hover:bg-accent transition-colors group"
                  >
                    {skill.skill_name}
                    {isOwner && (
                      <button
                        onClick={() => handleRemove("technical", skill.id)}
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
                {softSkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="text-base py-2 px-4 hover:bg-accent transition-colors group"
                  >
                    {skill.skill_name}
                    {isOwner && (
                      <button
                        onClick={() => handleRemove("soft", skill.id)}
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
