import { Briefcase, Edit, Plus, X, Save, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Experience {
  period: string;
  title: string;
  company: string;
  description: string;
}

interface ExperienceSectionProps {
  isOwner?: boolean;
}

const DEFAULT_EXPERIENCES: Experience[] = [
  {
    period: "2025 - Present",
    title: "Digital Associate",
    company: "CAPACITI",
    description: "Supporting digital transformation initiatives and technology implementation projects. Collaborating with cross-functional teams on digital solutions and process improvements. Contributing to training and development programs for digital literacy and participating in agile methodologies and continuous improvement processes.",
  },
  {
    period: "2022 - 2025",
    title: "Sales Administrator",
    company: "Vox Telecom",
    description: "Successfully conducted area feasibility checks and generated sales quotes.",
  },
  {
    period: "2022 - 2023",
    title: "Assistant & Facilitator",
    company: "The Learning Trust",
    description: "Voluntarily group facilitation of school children between the ages of 6 and 16. Contributed to alleviating the number of children affected by socioeconomic issues due to not having a solid support structure or secure environment to be in after school. Successfully managed after school coaches, organised activities, facilitated discussions and attendance using an online platform provided by the organisation.",
  },
  {
    period: "2021 - 2022",
    title: "Data Capturing Specialist",
    company: "The National Sea Rescue Institute",
    description: "Contributed to saving over 1100 lives through administrative support to our sales team which telephonically collected donations and attained new donors to fund responsive station rescues. This role consisted of manual recording of sales, capturing donor details, sending emails, renewing donor certificates, compiling donation reports and training of new sales consultants on team policies and procedures to enhance productivity and performance.",
  },
  {
    period: "2019 - 2021",
    title: "Intern",
    company: "Vox Telecom",
    description: "Assisted sales teams achieve their monthly targets through supporting them with administrative tasks such as filing, meeting coordination, compilation and submission of business partner agreements as well as monitoring sales reports for accuracy.",
  },
  {
    period: "2018",
    title: "Sales Agent",
    company: "Teleperformance CPT",
    description: "Successfully responded to UK customer queries via the phone. Providing them with different information they required with regards to their subscription packages. Assisted customers with package top ups, SIM card blocking, phone theft reporting as well as sim swap generation.",
  },
  {
    period: "2017",
    title: "Customer Service Associate",
    company: "Amazon CPT",
    description: "Successfully interacted with USA customers providing them with sales support through tracking of their orders, ensuring swift and accurate deliveries as well as retrieval of lost or incorrectly delivered packages. Successfully built rapport and resolved customer complaints by providing them with helpful information in a timely and satisfactory manner. Achieved monthly call targets which resulted in positive and constructive appraisal.",
  },
];

export const ExperienceSection = ({ isOwner = false }: ExperienceSectionProps) => {
  const [experiences, setExperiences] = useState<Experience[]>(DEFAULT_EXPERIENCES);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newExperience, setNewExperience] = useState<Experience>({
    period: "",
    title: "",
    company: "",
    description: ""
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('content_value')
        .eq('content_key', 'experiences')
        .maybeSingle();

      if (error) throw error;

      if (data?.content_value) {
        setExperiences(JSON.parse(data.content_value));
      }
    } catch (error) {
      console.error('Error loading experiences:', error);
    }
  };

  const saveExperiences = async (newExperiences: Experience[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to edit experiences');
        return;
      }

      const { data: existing } = await supabase
        .from('portfolio_content')
        .select('id')
        .eq('content_key', 'experiences')
        .maybeSingle();

      if (existing) {
        await supabase
          .from('portfolio_content')
          .update({ content_value: JSON.stringify(newExperiences) })
          .eq('content_key', 'experiences');
      } else {
        await supabase
          .from('portfolio_content')
          .insert({
            owner_id: user.id,
            content_key: 'experiences',
            content_value: JSON.stringify(newExperiences)
          });
      }

      toast.success('Experiences saved successfully');
    } catch (error) {
      console.error('Error saving experiences:', error);
      toast.error('Failed to save experiences');
    }
  };

  const handleEdit = (index: number) => {
    if (!isOwner) return;
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleSave = async (index: number, updatedExp: Experience) => {
    const newExperiences = [...experiences];
    newExperiences[index] = updatedExp;
    setExperiences(newExperiences);
    await saveExperiences(newExperiences);
    setEditingIndex(null);
    setIsEditing(false);
  };

  const handleDelete = async (index: number) => {
    if (!isOwner) return;
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
    await saveExperiences(newExperiences);
  };

  const handleAddNew = async () => {
    if (!newExperience.title || !newExperience.company) {
      toast.error('Please fill in title and company');
      return;
    }
    const newExperiences = [newExperience, ...experiences];
    setExperiences(newExperiences);
    await saveExperiences(newExperiences);
    setNewExperience({ period: "", title: "", company: "", description: "" });
    setIsAdding(false);
  };

  return (
    <section id="experience" className="min-h-screen flex items-center py-20 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Briefcase className="h-10 w-10 text-accent" />
              Work Experience
            </h2>
            {isOwner && (
              <Button onClick={() => setIsAdding(!isAdding)} variant="outline">
                {isAdding ? "Cancel" : <><Plus className="h-4 w-4 mr-2" /> Add New</>}
              </Button>
            )}
          </div>

          {isAdding && isOwner && (
            <Card className="p-6 mb-8 border-accent">
              <div className="space-y-4">
                <Input
                  placeholder="Period (e.g., 2023 - Present)"
                  value={newExperience.period}
                  onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                />
                <Input
                  placeholder="Job Title"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                />
                <Input
                  placeholder="Company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  rows={4}
                />
                <Button onClick={handleAddNew} className="w-full">Add Experience</Button>
              </div>
            </Card>
          )}

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={index} className="relative pl-8 md:pl-20">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-6 top-6 w-4 h-4 rounded-full bg-accent border-4 border-background" />

                  <Card className="p-6 hover:shadow-lg transition-shadow border-border group">
                    {editingIndex === index && isOwner ? (
                      <EditExperienceForm
                        experience={exp}
                        onSave={(updated) => handleSave(index, updated)}
                        onCancel={() => { setEditingIndex(null); setIsEditing(false); }}
                      />
                    ) : (
                      <>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground">{exp.title}</h3>
                            <p className="text-accent font-medium">{exp.company}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <p className="text-sm text-muted-foreground">{exp.period}</p>
                            {isOwner && (
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(index)}
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(index)}
                                  title="Delete"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                      </>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface EditExperienceFormProps {
  experience: Experience;
  onSave: (updated: Experience) => void;
  onCancel: () => void;
}

const EditExperienceForm = ({ experience, onSave, onCancel }: EditExperienceFormProps) => {
  const [editedExp, setEditedExp] = useState<Experience>(experience);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Period"
        value={editedExp.period}
        onChange={(e) => setEditedExp({ ...editedExp, period: e.target.value })}
      />
      <Input
        placeholder="Job Title"
        value={editedExp.title}
        onChange={(e) => setEditedExp({ ...editedExp, title: e.target.value })}
      />
      <Input
        placeholder="Company"
        value={editedExp.company}
        onChange={(e) => setEditedExp({ ...editedExp, company: e.target.value })}
      />
      <Textarea
        placeholder="Description"
        value={editedExp.description}
        onChange={(e) => setEditedExp({ ...editedExp, description: e.target.value })}
        rows={4}
      />
      <div className="flex gap-2">
        <Button onClick={() => onSave(editedExp)} className="flex-1">
          <Save className="h-4 w-4 mr-2" /> Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
      </div>
    </div>
  );
};