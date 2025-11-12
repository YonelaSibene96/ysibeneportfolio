import { Award, Upload, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", issuer: "", date: "" });

  useEffect(() => {
    const saved = localStorage.getItem("certifications");
    if (saved) setCertifications(JSON.parse(saved));
  }, []);

  const handleAdd = () => {
    if (newCert.name && newCert.issuer) {
      const updated = [...certifications, newCert];
      setCertifications(updated);
      localStorage.setItem("certifications", JSON.stringify(updated));
      setNewCert({ name: "", issuer: "", date: "" });
      setIsAdding(false);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...certifications];
        updated[index].document = reader.result as string;
        setCertifications(updated);
        localStorage.setItem("certifications", JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = (index: number) => {
    const updated = [...certifications];
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
                          onClick={() => window.open(cert.document, "_blank")}
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
