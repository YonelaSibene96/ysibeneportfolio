import { GraduationCap, Upload, X, FileText, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Education {
  institution: string;
  degree: string;
  period: string;
  document?: string;
}

interface EducationSectionProps {
  isOwner?: boolean;
}

export const EducationSection = ({ isOwner = false }: EducationSectionProps) => {
  const defaultEducation: Education[] = [
    {
      institution: "International Institute of Business Analysis",
      degree: "Entry Certificate in Business Analysis",
      period: "Present",
    },
    {
      institution: "University of the Western Cape",
      degree: "Post Graduate Diploma in Computer Software & Media Applications: E-Logistics, Supply Chain Management & Data Science",
      period: "Completed",
    },
    {
      institution: "University of the Western Cape",
      degree: "BCom General",
      period: "Completed",
    },
    {
      institution: "Leap Science and Math School",
      degree: "Matric",
      period: "Completed",
    },
  ];

  const [education, setEducation] = useState<Education[]>(defaultEducation);

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      // Try to load from Supabase first
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('content_value')
        .eq('content_key', 'education')
        .maybeSingle();

      if (error) throw error;

      if (data?.content_value) {
        const eduData = JSON.parse(data.content_value);
        
        // Resolve document URLs
        const updatedEdu = await Promise.all(
          eduData.map(async (edu: Education) => {
            if (edu.document && !edu.document.startsWith('http')) {
              const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(edu.document);
              return { ...edu, document: publicUrl };
            }
            return edu;
          })
        );
        
        setEducation(updatedEdu);
      } else {
        // Fallback to localStorage for migration
        const saved = localStorage.getItem("education");
        if (saved) {
          const eduData = JSON.parse(saved);
          
          const updatedEdu = await Promise.all(
            eduData.map(async (edu: Education) => {
              if (edu.document && edu.document.startsWith('documents/')) {
                const { data: { publicUrl } } = supabase.storage
                  .from('documents')
                  .getPublicUrl(edu.document);
                return { ...edu, document: publicUrl };
              }
              return edu;
            })
          );
          
          setEducation(updatedEdu);
        }
      }
    } catch (error) {
      console.error('Error loading education:', error);
    }
  };

  const saveEducation = async (newEducation: Education[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Store file paths, not full URLs
        const eduToSave = newEducation.map(edu => ({
          ...edu,
          document: edu.document?.includes('/documents/') 
            ? edu.document.split('/documents/')[1]?.split('?')[0]
            : edu.document
        }));

        const { data: existing } = await supabase
          .from('portfolio_content')
          .select('id')
          .eq('content_key', 'education')
          .maybeSingle();

        if (existing) {
          await supabase
            .from('portfolio_content')
            .update({ content_value: JSON.stringify(eduToSave) })
            .eq('content_key', 'education');
        } else {
          await supabase
            .from('portfolio_content')
            .insert({
              owner_id: user.id,
              content_key: 'education',
              content_value: JSON.stringify(eduToSave)
            });
        }
      }
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!isOwner) return;
    const file = e.target.files?.[0];
    if (file) {
      const fileName = `edu/edu-${index}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true });

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        const newEducation = [...education];
        newEducation[index].document = publicUrl;
        setEducation(newEducation);
        await saveEducation(newEducation);
        toast.success('Document uploaded successfully');
      } else {
        toast.error('Failed to upload document');
      }
    }
  };

  const removeDocument = async (index: number) => {
    if (!isOwner) return;
    const newEducation = [...education];
    const docUrl = newEducation[index].document;
    
    if (docUrl) {
      // Extract file path from URL
      const urlParts = docUrl.split('/documents/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1].split('?')[0];
        await supabase.storage
          .from('documents')
          .remove([filePath]);
      }
    }
    
    delete newEducation[index].document;
    setEducation(newEducation);
    await saveEducation(newEducation);
    toast.success('Document removed');
  };

  const downloadDocument = async (documentUrl: string, eduName: string) => {
    try {
      const response = await fetch(documentUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eduName.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      // Fallback: open in new tab
      window.open(documentUrl, '_blank');
    }
  };

  return (
    <section id="education" className="min-h-screen flex items-center py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-12 flex items-center gap-3">
            <GraduationCap className="h-10 w-10 text-accent" />
            Education
          </h2>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {edu.institution}
                    </h3>
                    <p className="text-muted-foreground mb-2">{edu.degree}</p>
                    <p className="text-sm text-accent font-medium">{edu.period}</p>
                  </div>
                  <div className="flex gap-2">
                    {edu.document ? (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => downloadDocument(edu.document!, edu.institution)}
                          title="Download Document"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {isOwner && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeDocument(index)}
                            title="Remove Document"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    ) : isOwner ? (
                      <label>
                        <Button variant="outline" size="icon" asChild>
                          <span>
                            <Upload className="h-4 w-4" />
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,image/*"
                          onChange={(e) => handleDocumentUpload(e, index)}
                          className="hidden"
                        />
                      </label>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
