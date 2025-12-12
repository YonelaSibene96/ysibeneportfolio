import { Mail, Phone, Linkedin, Github, Upload, X, FileText, Edit, Download, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContactSectionProps {
  isOwner?: boolean;
}

export const ContactSection = ({ isOwner = false }: ContactSectionProps) => {
  const [contactImage, setContactImage] = useState<string>("");
  const [cvDocument, setCvDocument] = useState<string>("");
  const [linkedinUrl, setLinkedinUrl] = useState<string>("https://www.linkedin.com/in/yonela-sibene");
  const [githubUrl, setGithubUrl] = useState<string>("https://github.com/yonelasibene");
  const [isEditingLinks, setIsEditingLinks] = useState(false);

  useEffect(() => {
    loadContactFiles();
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('content_key, content_value')
        .in('content_key', ['linkedin_url', 'github_url']);

      if (error) throw error;

      if (data) {
        data.forEach(item => {
          if (item.content_key === 'linkedin_url') setLinkedinUrl(item.content_value);
          if (item.content_key === 'github_url') setGithubUrl(item.content_value);
        });
      }
    } catch (error) {
      console.error('Error loading social links:', error);
    }
  };

  const loadContactFiles = async () => {
    const { data: images } = await supabase.storage
      .from('contact-images')
      .list('', { limit: 1 });

    if (images && images.length > 0) {
      const { data: { publicUrl } } = supabase.storage
        .from('contact-images')
        .getPublicUrl(images[0].name);
      setContactImage(publicUrl);
    }

    const { data: docs } = await supabase.storage
      .from('documents')
      .list('cv', { limit: 1 });

    if (docs && docs.length > 0) {
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(`cv/${docs[0].name}`);
      setCvDocument(publicUrl);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwner) return;
    const file = e.target.files?.[0];
    if (file) {
      const fileName = `contact-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error } = await supabase.storage
        .from('contact-images')
        .upload(fileName, file, { upsert: true });

      if (!error) {
        loadContactFiles();
        toast.success('Image uploaded');
      }
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwner) return;
    const file = e.target.files?.[0];
    if (file) {
      const fileName = `cv/cv-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true });

      if (!error) {
        loadContactFiles();
        toast.success('CV uploaded');
      }
    }
  };

  const handleSaveLinks = async () => {
    if (!isOwner) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: existingLinkedin } = await supabase
          .from('portfolio_content')
          .select('id')
          .eq('content_key', 'linkedin_url')
          .maybeSingle();

        if (existingLinkedin) {
          await supabase
            .from('portfolio_content')
            .update({ content_value: linkedinUrl })
            .eq('content_key', 'linkedin_url');
        } else {
          await supabase
            .from('portfolio_content')
            .insert({ owner_id: user.id, content_key: 'linkedin_url', content_value: linkedinUrl });
        }

        const { data: existingGithub } = await supabase
          .from('portfolio_content')
          .select('id')
          .eq('content_key', 'github_url')
          .maybeSingle();

        if (existingGithub) {
          await supabase
            .from('portfolio_content')
            .update({ content_value: githubUrl })
            .eq('content_key', 'github_url');
        } else {
          await supabase
            .from('portfolio_content')
            .insert({ owner_id: user.id, content_key: 'github_url', content_value: githubUrl });
        }

        toast.success('Links saved successfully');
      }
    } catch (error) {
      console.error('Error saving links:', error);
      toast.error('Failed to save links');
    }
    
    setIsEditingLinks(false);
  };

  const downloadCV = async () => {
    try {
      const response = await fetch(cvDocument);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Yonela-Sibene-CV.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      window.open(cvDocument, '_blank');
    }
  };

  const viewCV = () => {
    // Use Google Docs Viewer to bypass browser blocking
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(cvDocument)}&embedded=false`;
    window.open(googleViewerUrl, '_blank');
  };

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "0649731961", link: "tel:0649731961" },
    { icon: Mail, label: "Email", value: "ysibene@gmail.com", link: "mailto:ysibene@gmail.com" },
    { icon: Linkedin, label: "LinkedIn", value: "View Profile", link: linkedinUrl },
    { icon: Github, label: "GitHub", value: "View Profile", link: githubUrl },
  ];

  const quickLinks = [
    { label: "About Me", section: "about" },
    { label: "Education", section: "education" },
    { label: "Skills", section: "skills" },
    { label: "Experience", section: "experience" },
    { label: "Projects", section: "projects" },
  ];

  return (
    <section id="contact" className="min-h-screen flex items-center py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-5xl font-bold text-foreground mb-2">
                Let&apos;s Work Together
              </h2>
              <p className="text-muted-foreground text-lg">
                I&apos;m always open to discussing new opportunities and collaborations
              </p>
            </div>
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingLinks(!isEditingLinks)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditingLinks ? "Cancel" : "Edit Links"}
              </Button>
            )}
          </div>

          {isEditingLinks && isOwner && (
            <Card className="p-6 mb-8 border-accent">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">LinkedIn URL</label>
                  <Input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/your-profile"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">GitHub URL</label>
                  <Input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username"
                  />
                </div>
                <Button onClick={handleSaveLinks} className="w-full">
                  Save Links
                </Button>
              </div>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Image */}
            <div className="flex justify-center">
              <div className="relative w-64 h-64 rounded-lg overflow-hidden border-2 border-border bg-muted group">
                {contactImage ? (
                  <>
                    <img
                      src={contactImage}
                      alt="Contact"
                      className="w-full h-full object-cover"
                    />
                    {isOwner && (
                      <button
                        onClick={async () => {
                          const fileName = contactImage.split('/').pop();
                          if (fileName) {
                            await supabase.storage
                              .from('contact-images')
                              .remove([fileName]);
                          }
                          setContactImage("");
                          toast.success('Image removed');
                        }}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </>
                ) : isOwner ? (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-4 hover:shadow-lg transition-shadow border-border">
                  <a
                    href={info.link}
                    target={info.label === "Phone" ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-foreground hover:text-accent transition-colors"
                    onClick={(e) => {
                      if (info.label === "LinkedIn" || info.label === "GitHub") {
                        e.preventDefault();
                        window.open(info.link, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <info.icon className="h-6 w-6 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      <p className="font-medium">{info.value}</p>
                    </div>
                  </a>
                </Card>
              ))}
            </div>
          </div>

          {/* CV Section */}
          <Card className="p-6 mb-8 border-accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold text-lg">Curriculum Vitae</h3>
                  <p className="text-sm text-muted-foreground">
                    {cvDocument ? "CV uploaded" : "No CV uploaded"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {cvDocument ? (
                  <>
                    <Button variant="outline" onClick={viewCV}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="default" onClick={downloadCV}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {isOwner && (
                      <Button
                        onClick={async () => {
                          const fileName = cvDocument.split('/').pop();
                          if (fileName) {
                            await supabase.storage
                              .from('documents')
                              .remove([`cv/${fileName}`]);
                          }
                          setCvDocument("");
                          toast.success('CV removed');
                        }}
                        variant="outline"
                        size="icon"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                ) : isOwner ? (
                  <label>
                    <Button asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CV
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      className="hidden"
                    />
                  </label>
                ) : null}
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => {
                    document.getElementById(link.section)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="justify-start"
                >
                  {link.label}
                </Button>
              ))}
              <Button variant="outline" asChild className="justify-start">
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
