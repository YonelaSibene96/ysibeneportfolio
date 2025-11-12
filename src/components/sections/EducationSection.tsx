import { GraduationCap, Upload, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    const saved = localStorage.getItem("education");
    if (saved) setEducation(JSON.parse(saved));
  }, []);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newEducation = [...education];
        newEducation[index].document = reader.result as string;
        setEducation(newEducation);
        localStorage.setItem("education", JSON.stringify(newEducation));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = (index: number) => {
    const newEducation = [...education];
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
                          onClick={() => window.open(edu.document, "_blank")}
                        >
                          <FileText className="h-4 w-4" />
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
