import { Award, Upload, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Certification {
  name: string;
  issuer: string;
  date: string;
  document?: string;
}

export const CertificationsSection = () => {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      name: "Entry Certificate in Business Analysis",
      issuer: "International Institute of Business Analysis",
      date: "In Progress",
    },
    {
      name: "AI & Machine Learning For Everyone",
      issuer: "CAPACITI",
      date: "2024",
    },
    {
      name: "AI FOR EVERYONE",
      issuer: "CAPACITI",
      date: "2024",
    },
    {
      name: "Introduction to AI",
      issuer: "Google (Coursera)",
      date: "2024",
    },
    {
      name: "AI For Everyone",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Introduction to Responsible AI",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Active Listening Enhancing Communication Skills",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Developing Interpersonal Skills",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Emotional Intelligence",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Financial Planning For Young Adults",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Finding Your Professional Voice",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Grit and Growth Mindset",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Introduction to Personal Branding",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Leading With Impact",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Preparation For Job Interviews",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Solving Problems With Creative & Critical Thinking",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Verbal Communications and Presentation Skills",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Work Smarter, Not Harder",
      issuer: "Coursera",
      date: "2024",
    },
    {
      name: "Write Professional Emails in English",
      issuer: "Coursera",
      date: "2024",
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", issuer: "", date: "" });

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    const saved = localStorage.getItem("certifications");
    if (saved) {
      const certData = JSON.parse(saved);
      
      const updatedCerts = await Promise.all(
        certData.map(async (cert: Certification) => {
          if (cert.document && cert.document.startsWith('documents/')) {
            const { data: { publicUrl } } = supabase.storage
              .from('documents')
              .getPublicUrl(cert.document);
            return { ...cert, document: publicUrl };
          }
          return cert;
        })
      );
      
      setCertifications(updatedCerts);
    }
  };

  const handleAdd = () => {
    if (newCert.name && newCert.issuer) {
      const updated = [...certifications, newCert];
      setCertifications(updated);
      localStorage.setItem("certifications", JSON.stringify(updated));
      setNewCert({ name: "", issuer: "", date: "" });
      setIsAdding(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = `documents/cert-${index}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true });

      if (!error) {
        const updated = [...certifications];
        updated[index].document = fileName;
        setCertifications(updated);
        localStorage.setItem("certifications", JSON.stringify(updated));
        loadCertifications();
      }
    }
  };

  const removeDocument = async (index: number) => {
    const updated = [...certifications];
    const docPath = updated[index].document;
    
    if (docPath && docPath.startsWith('documents/')) {
      await supabase.storage
        .from('documents')
        .remove([docPath]);
    }
    
    delete updated[index].document;
    setCertifications(updated);
    localStorage.setItem("certifications", JSON.stringify(updated));
  };

  return (
    <section id="certifications" className="min-h-screen flex items-center py-20 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Award className="h-10 w-10 text-accent" />
              Certifications
            </h2>
            <Button onClick={() => setIsAdding(!isAdding)} variant="outline">
              {isAdding ? "Cancel" : "Add New"}
            </Button>
          </div>

          {isAdding && (
            <Card className="p-6 mb-6 border-accent">
              <div className="space-y-4">
                <Input
                  placeholder="Certification Name"
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                />
                <Input
                  placeholder="Issuing Organization"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                />
                <Input
                  placeholder="Date (e.g., 2024)"
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                />
                <Button onClick={handleAdd} className="w-full">Add Certification</Button>
              </div>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border">
                <div className="flex items-start justify-between mb-4">
                  <Award className="h-8 w-8 text-accent flex-shrink-0" />
                  <div className="flex gap-2">
                    {cert.document ? (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <a href={cert.document} target="_blank" rel="noopener noreferrer">
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
                          accept=".pdf,image/*"
                          onChange={(e) => handleDocumentUpload(e, index)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{cert.name}</h3>
                <p className="text-muted-foreground text-sm mb-1">{cert.issuer}</p>
                <p className="text-accent text-sm font-medium">{cert.date}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
