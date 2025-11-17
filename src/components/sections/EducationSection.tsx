import { GraduationCap, Upload, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Education {
  institution: string;
  degree: string;
  period: string;
  document?: string;
}

export const EducationSection = () => {
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
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = `documents/edu-${index}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true });

      if (!error) {
        const newEducation = [...education];
        newEducation[index].document = fileName;
        setEducation(newEducation);
        localStorage.setItem("education", JSON.stringify(newEducation));
        loadEducation();
      }
    }
  };

  const removeDocument = async (index: number) => {
    const newEducation = [...education];
    const docPath = newEducation[index].document;
    
    if (docPath && docPath.startsWith('documents/')) {
      await supabase.storage
        .from('documents')
        .remove([docPath]);
    }
    
    delete newEducation[index].document;
    setEducation(newEducation);
    localStorage.setItem("education", JSON.stringify(newEducation));
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
                          asChild
                        >
                          <a href={edu.document} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeDocument(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
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
                    )}
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
