import { useState, useEffect } from "react";
import { Edit2, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const AboutSection = () => {
  const defaultAbout = "Experienced sales administrator with 6+ years in the IT and Telecommunications industry, proficient in customer service and sales support. I am a young professional with a strong foundation in Information Systems, E-logistics as well as Data Analytics with a current goal and great interest to become a junior business analyst.";
  
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(defaultAbout);
  const [aboutImage, setAboutImage] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("aboutText");
    if (saved) setAboutText(saved);
    loadAboutImage();
  }, []);

  const loadAboutImage = async () => {
    const { data } = await supabase.storage
      .from('profile-images')
      .list('about', { limit: 1 });

    if (data && data.length > 0) {
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(`about/${data[0].name}`);
      setAboutImage(publicUrl);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = `about/about-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, { upsert: true });

      if (!error) {
        loadAboutImage();
      }
    }
  };

  const removeImage = async () => {
    if (aboutImage) {
      const fileName = aboutImage.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('profile-images')
          .remove([`about/${fileName}`]);
        setAboutImage("");
      }
    }
  };

  const handleSave = () => {
    localStorage.setItem("aboutText", aboutText);
    setIsEditing(false);
  };

  return (
    <section id="about" className="min-h-screen flex items-center py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-foreground">About Me</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              {isEditing ? (
                <Textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  className="min-h-[200px] text-lg"
                />
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {aboutText}
                </p>
              )}
            </div>
            <div className="order-1 md:order-2">
              <div className="relative rounded-lg overflow-hidden border-2 border-border bg-muted hover:border-accent transition-all group aspect-square max-w-md mx-auto">
                {aboutImage ? (
                  <>
                    <img
                      src={aboutImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-4 right-4 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <span className="text-muted-foreground">Upload Profile Photo</span>
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
          </div>
        </div>
      </div>
    </section>
  );
};
