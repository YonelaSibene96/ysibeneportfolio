import { Award, Upload, X, Download, Eye } from "lucide-react";
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

interface CertificationsSectionProps {
  isOwner?: boolean;
}

const INITIAL_CERTIFICATIONS = [
  { name: "Entry Certificate in Business Analysis", issuer: "International Institute of Business Analysis", date: "In Progress" },
  { name: "AI & Machine Learning For Everyone", issuer: "CAPACITI", date: "2025" },
  { name: "AI FOR EVERYONE", issuer: "CAPACITI", date: "2025" },
  { name: "Introduction to AI", issuer: "Google (Coursera)", date: "2025" },
  { name: "AI For Everyone", issuer: "Coursera", date: "2025" },
  { name: "Introduction to Responsible AI", issuer: "Coursera", date: "2025" },
  { name: "Active Listening Enhancing Communication Skills", issuer: "Coursera", date: "2025" },
  { name: "Developing Interpersonal Skills", issuer: "Coursera", date: "2025" },
  { name: "Emotional Intelligence", issuer: "Coursera", date: "2025" },
  { name: "Financial Planning For Young Adults", issuer: "Coursera", date: "2025" },
  { name: "Finding Your Professional Voice", issuer: "Coursera", date: "2025" },
  { name: "Grit and Growth Mindset", issuer: "Coursera", date: "2025" },
  { name: "Introduction to Personal Branding", issuer: "Coursera", date: "2025" },
  { name: "Leading With Impact", issuer: "Coursera", date: "2025" },
  { name: "Preparation For Job Interviews", issuer: "Coursera", date: "2025" },
  { name: "Solving Problems With Creative & Critical Thinking", issuer: "Coursera", date: "2025" },
  { name: "Verbal Communications and Presentation Skills", issuer: "Coursera", date: "2025" },
  { name: "Work Smarter, Not Harder", issuer: "Coursera", date: "2025" },
  { name: "Write Professional Emails in English", issuer: "Coursera", date: "2025" },
];

export const CertificationsSection = ({ isOwner = false }: CertificationsSectionProps) => {
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
    if (!isOwner) return;
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
    if (!isOwner) return;
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
    if (!isOwner || !certId) return;

    try {
      if (documentUrl) {
        const urlParts = documentUrl.split('/object/public/documents/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1].split('?')[0];
          await supabase.storage
            .from('documents')
            .remove([filePath]);
        }
      }

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

  const downloadDocument = async (documentUrl: string, certName: string) => {
    try {
      const response = await fetch(documentUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${certName.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Unable to download. Try viewing instead.');
    }
  };

  const viewDocument = (documentUrl: string) => {
    // Use Google Docs Viewer to bypass browser blocking
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=false`;
    window.open(googleViewerUrl, '_blank');
  };

  return (
    <section id="certifications" className="min-h-screen flex items-center py-20 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Award className="h-10 w-10 text-accent" />
              Certifications
            </h2>
            {isOwner && (
              <Button onClick={() => setIsAdding(!isAdding)} variant="outline">
                {isAdding ? "Cancel" : "Add New"}
              </Button>
            )}
          </div>

          {isAdding && isOwner && (
            <Card className="p-4 mb-6 border-accent">
              <div className="flex gap-2 flex-wrap">
                <Input
                  placeholder="Certification Name"
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                  className="flex-1 min-w-[200px]"
                />
                <Input
                  placeholder="Issuing Organization"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  className="flex-1 min-w-[200px]"
                />
                <Input
                  placeholder="Date"
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                  className="w-24"
                />
                <Button onClick={handleAdd}>Add</Button>
              </div>
            </Card>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading certifications...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-10 gap-2">
              {certifications.map((cert) => (
                <div 
                  key={cert.id || cert.name} 
                  className="group relative bg-card border border-border rounded-md p-2 hover:shadow-md transition-all hover:border-accent"
                >
                  <div className="flex items-start gap-1 mb-1">
                    <Award className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <h3 className="font-medium text-xs text-foreground line-clamp-2 leading-tight">
                      {cert.name}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-[10px] line-clamp-1 mb-0.5">{cert.issuer}</p>
                  <p className="text-accent text-[10px] font-medium">{cert.date}</p>
                  
                  {/* Action buttons - appear on hover */}
                  <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {cert.document_url ? (
                      <>
                        <button
                          onClick={() => viewDocument(cert.document_url!)}
                          className="p-1 bg-background/80 rounded hover:bg-accent/20"
                          title="View"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => downloadDocument(cert.document_url!, cert.name)}
                          className="p-1 bg-background/80 rounded hover:bg-accent/20"
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                        {isOwner && (
                          <button
                            onClick={() => removeDocument(cert.id!, cert.document_url)}
                            className="p-1 bg-background/80 rounded hover:bg-destructive/20"
                            title="Remove"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </>
                    ) : (
                      isOwner && cert.id && (
                        <label className="cursor-pointer">
                          <span className="p-1 bg-background/80 rounded hover:bg-accent/20 block">
                            <Upload className="h-3 w-3" />
                          </span>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
