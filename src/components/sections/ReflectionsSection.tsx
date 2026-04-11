import { BookOpen, Edit2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Reflection {
  id: string;
  reflection_number: number;
  title: string;
  content: string;
}

interface ReflectionsSectionProps {
  isOwner?: boolean;
}

const OWNER_ID = "36ca3d56-ae25-4db9-be1e-400563633555";

export const ReflectionsSection = ({ isOwner = false }: ReflectionsSectionProps) => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadReflections();
  }, []);

  const loadReflections = async () => {
    const { data, error } = await supabase
      .from("reflections")
      .select("*")
      .eq("owner_id", OWNER_ID)
      .order("reflection_number", { ascending: true });
    if (data && !error) setReflections(data);
  };

  const startEdit = (r: Reflection) => {
    setEditingId(r.id);
    setEditTitle(r.title);
    setEditContent(r.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("reflections")
      .update({ title: editTitle, content: editContent })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to save reflection.", variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Reflection updated." });
      cancelEdit();
      loadReflections();
    }
  };

  return (
    <section id="reflections" className="min-h-screen py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-accent" />
          Reflections
        </h2>

        <div className="space-y-6">
          {reflections.map((r) => (
            <Card key={r.id} className="p-6">
              {editingId === r.id ? (
                <div className="space-y-4">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Reflection title"
                    className="text-lg font-semibold"
                  />
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Write your reflection here..."
                    rows={8}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(r.id)}>
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-foreground">{r.title}</h3>
                    {isOwner && (
                      <Button size="sm" variant="ghost" onClick={() => startEdit(r)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {r.content ? (
                    <p className="text-muted-foreground whitespace-pre-wrap">{r.content}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No content yet.</p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
