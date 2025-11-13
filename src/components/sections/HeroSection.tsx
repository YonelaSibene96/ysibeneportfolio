import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  const [profileImages, setProfileImages] = useState<string[]>([]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const { data } = await supabase.storage.from('profile-images').list('', {
      limit: 4,
      sortBy: { column: 'name', order: 'asc' }
    });

    if (data) {
      const urls = await Promise.all(
        data.slice(0, 4).map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('profile-images')
            .getPublicUrl(file.name);
          return publicUrl;
        })
      );
      setProfileImages(urls);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = `profile-${index}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, { upsert: true });

      if (!error) {
        loadImages();
      }
    }
  };

  const removeImage = async (index: number) => {
    const fileName = profileImages[index]?.split('/').pop();
    if (fileName) {
      await supabase.storage
        .from('profile-images')
        .remove([fileName]);
      
      loadImages();
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-foreground">
            Yonela Sibene
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            Data Driven Business Analyst | ECBA Candidate | AI Solutions
          </p>

          {/* Professional Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-border bg-muted hover:border-accent transition-all group"
              >
                {profileImages[index] ? (
                  <>
                    <img
                      src={profileImages[index]}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
