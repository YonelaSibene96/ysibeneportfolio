import { Mail, Phone, Linkedin, Github, Upload, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const ContactSection = () => {
  const [contactImage, setContactImage] = useState<string>("");
  const [cvDocument, setCvDocument] = useState<string>("");

  useEffect(() => {
    const savedImage = localStorage.getItem("contactImage");
    const savedCV = localStorage.getItem("cvDocument");
    if (savedImage) setContactImage(savedImage);
    if (savedCV) setCvDocument(savedCV);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setContactImage(result);
        localStorage.setItem("contactImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCvDocument(result);
        localStorage.setItem("cvDocument", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "0649731961",
      link: "tel:0649731961",
    },
    {
      icon: Mail,
      label: "Email",
      value: "ysibene@gmail.com",
      link: "mailto:ysibene@gmail.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "View Profile",
      link: "https://www.linkedin.com/in/yonela-sibene",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "View Profile",
      link: "https://github.com/yonelasibene",
    },
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
          <h2 className="text-5xl font-bold text-center text-foreground mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            I&apos;m always open to discussing new opportunities and collaborations
          </p>

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
                    <button
                      onClick={() => {
                        setContactImage("");
                        localStorage.removeItem("contactImage");
                      }}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
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
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-4 hover:shadow-lg transition-shadow border-border">
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-foreground hover:text-accent transition-colors"
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
                    {cvDocument ? "CV uploaded" : "Upload your CV"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {cvDocument ? (
                  <>
                    <Button
                      onClick={() => window.open(cvDocument, "_blank")}
                      variant="default"
                    >
                      View CV
                    </Button>
                    <Button
                      onClick={() => {
                        setCvDocument("");
                        localStorage.removeItem("cvDocument");
                      }}
                      variant="outline"
                      size="icon"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
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
                )}
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
              <Button
                variant="outline"
                onClick={() => window.open("https://www.linkedin.com/in/yonela-sibene", "_blank")}
                className="justify-start"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("https://github.com/yonelasibene", "_blank")}
                className="justify-start"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
