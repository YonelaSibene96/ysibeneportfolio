import { Image, Film, Music, Plus, Trash2, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  media_url: string;
  media_type: string;
}

interface GallerySectionProps {
  isOwner?: boolean;
}

const OWNER_ID = "36ca3d56-ae25-4db9-be1e-400563633555";

export const GallerySection = ({ isOwner = false }: GallerySectionProps) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("owner_id", OWNER_ID)
      .order("created_at", { ascending: false });
    if (data && !error) setItems(data);
  };

  const getMediaType = (file: File): string | null => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return null;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mediaType = getMediaType(file);
    if (!mediaType) {
      toast({ title: "Error", description: "Unsupported file type. Please upload an image, video, or audio file.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery-media")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery-media").getPublicUrl(fileName);

    const { error: dbError } = await supabase.from("gallery").insert({
      owner_id: OWNER_ID,
      title: title || file.name,
      media_url: urlData.publicUrl,
      media_type: mediaType,
    });

    if (dbError) {
      toast({ title: "Error", description: "Failed to save gallery item.", variant: "destructive" });
    } else {
      toast({ title: "Uploaded!", description: "Media added to gallery." });
      setTitle("");
      loadGallery();
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (item: GalleryItem) => {
    const path = item.media_url.split("/gallery-media/")[1];
    if (path) {
      await supabase.storage.from("gallery-media").remove([decodeURIComponent(path)]);
    }
    await supabase.from("gallery").delete().eq("id", item.id);
    toast({ title: "Deleted", description: "Item removed from gallery." });
    loadGallery();
  };

  const renderMedia = (item: GalleryItem) => {
    if (item.media_type === "image") {
      return <img src={item.media_url} alt={item.title || "Gallery image"} className="w-full h-48 object-cover rounded-t-lg" />;
    }
    if (item.media_type === "video") {
      return <video src={item.media_url} controls className="w-full h-48 object-cover rounded-t-lg" />;
    }
    if (item.media_type === "audio") {
      return (
        <div className="w-full h-48 flex items-center justify-center bg-muted rounded-t-lg">
          <Music className="h-12 w-12 text-muted-foreground mb-2" />
          <audio src={item.media_url} controls className="absolute bottom-4 w-4/5" />
        </div>
      );
    }
    return null;
  };

  const mediaIcon = (type: string) => {
    if (type === "image") return <Image className="h-3 w-3" />;
    if (type === "video") return <Film className="h-3 w-3" />;
    return <Music className="h-3 w-3" />;
  };

  return (
    <section id="gallery" className="min-h-screen py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Image className="h-8 w-8 text-accent" />
          Gallery
        </h2>

        {isOwner && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Upload Media</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Choose File"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Supports images, videos, and audio files — no size limit.</p>
          </Card>
        )}

        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No media uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden relative group">
                <div className="relative">
                  {renderMedia(item)}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {mediaIcon(item.media_type)}
                    <span className="text-xs uppercase text-muted-foreground">{item.media_type}</span>
                  </div>
                  {item.title && <p className="font-medium text-foreground truncate">{item.title}</p>}
                </div>
                {isOwner && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
