import { Award, Upload, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Certification {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  document_url?: string;
}

const INITIAL_CERTIFICATIONS = [
  {
    name: "Entry Certificate in Business Analysis",
    issuer: "International Institute of Business Analysis",
    date: "In Progress",
  },
  {
    name: "AI & Machine Learning For Everyone",
    issuer: "CAPACITI",
    date: "2025",
  },
  {
    name: "AI FOR EVERYONE",
    issuer: "CAPACITI",
    date: "2025",
  },
  {
    name: "Introduction to AI",
    issuer: "Google (Coursera)",
    date: "2025",
  },
  {
    name: "AI For Everyone",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Introduction to Responsible AI",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Active Listening Enhancing Communication Skills",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Developing Interpersonal Skills",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Emotional Intelligence",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Financial Planning For Young Adults",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Finding Your Professional Voice",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Grit and Growth Mindset",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Introduction to Personal Branding",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Leading With Impact",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Preparation For Job Interviews",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Solving Problems With Creative & Critical Thinking",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Verbal Communications and Presentation Skills",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Work Smarter, Not Harder",
    issuer: "Coursera",
    date: "2025",
  },
  {
    name: "Write Professional Emails in English",
    issuer: "Coursera",
    date: "2025",
  },
];

export const CertificationsSection = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", issuer: "", date: "2025" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const { data: existingCerts, error } = await supabase
        .from('certifications')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // If no certifications exist, migrate initial data
      if (!existingCerts || existingCerts.length === 0) {
        await migrateInitialCertifications();
        return;
      }

      const certsWithUrls = existingCerts.map(cert => ({
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        document_url: cert.document_url || undefined
      }));

      setCertifications(certsWithUrls);
    } catch (error) {
      console.error('Error loading certifications:', error);
      toast.error('Failed to load certifications');
    } finally {
      setIsLoading(false);
    }
  };

  const migrateInitialCertifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user, just show the certifications without saving
        setCertifications(INITIAL_CERTIFICATIONS);
        setIsLoading(false);
        return;
      }

      const certificationsToInsert = INITIAL_CERTIFICATIONS.map(cert => ({
        owner_id: user.id,
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date
      }));

      const { error } = await supabase
        .from('certifications')
        .insert(certificationsToInsert);

      if (error) throw error;

      await loadCertifications();
      toast.success('Certifications migrated to permanent storage');
    } catch (error) {
      console.error('Error migrating certifications:', error);
      setCertifications(INITIAL_CERTIFICATIONS);
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCert.name || !newCert.issuer) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to add certifications');
        return;
      }

      const { error } = await supabase
        .from('certifications')
        .insert([{
          owner_id: user.id,
          name: newCert.name,
          issuer: newCert.issuer,
          date: newCert.date || "2025"
        }]);

      if (error) throw error;

      await loadCertifications();
      setNewCert({ name: "", issuer: "", date: "2025" });
      setIsAdding(false);
      toast.success('Certification added successfully');
    } catch (error) {
      console.error('Error adding certification:', error);
      toast.error('Failed to add certification');
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, certId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileName = `certs/cert-${certId}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('certifications')
        .update({ document_url: publicUrl })
        .eq('id', certId);

      if (updateError) throw updateError;

      await loadCertifications();
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  const removeDocument = async (certId: string, documentUrl?: string) => {
    if (!certId) return;

    try {
      // Extract the file path from the full URL
      if (documentUrl) {
        const urlParts = documentUrl.split('/object/public/documents/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1].split('?')[0];
          await supabase.storage
            .from('documents')
            .remove([filePath]);
        }
      }

      // Update database
      const { error } = await supabase
        .from('certifications')
        .update({ document_url: null })
        .eq('id', certId);

      if (error) throw error;

      await loadCertifications();
      toast.success('Document removed successfully');
    } catch (error) {
      console.error('Error removing document:', error);
      toast.error('Failed to remove document');
    }
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
                  placeholder="Date (e.g., 2025)"
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                />
                <Button onClick={handleAdd} className="w-full">Add Certification</Button>
              </div>
            </Card>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading certifications...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <Card key={cert.id || cert.name} className="p-6 hover:shadow-lg transition-shadow border-border">
                  <div className="flex items-start justify-between mb-4">
                    <Award className="h-8 w-8 text-accent flex-shrink-0" />
                    <div className="flex gap-2">
                      {cert.document_url ? (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={async () => {
                              try {
                                const response = await fetch(cert.document_url!);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${cert.name.replace(/\s+/g, '-')}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                              } catch (error) {
                                // Fallback: open in new tab
                                window.open(cert.document_url, '_blank');
                              }
                            }}
                            title="View Certificate"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeDocument(cert.id!, cert.document_url)}
                            title="Remove Certificate"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        cert.id && (
                          <label>
                            <Button variant="outline" size="icon" asChild>
                              <span>
                                <Upload className="h-4 w-4" />
                              </span>
                            </Button>
                            <input
                              type="file"
                              accept=".pdf,image/*"
                              onChange={(e) => handleDocumentUpload(e, cert.id!)}
                              className="hidden"
                            />
                          </label>
                        )
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{cert.name}</h3>
                  <p className="text-muted-foreground text-sm mb-1">{cert.issuer}</p>
                  <p className="text-accent text-sm font-medium">{cert.date}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
