import { Folder, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    technologies: "",
    link: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("projects");
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  const handleAdd = () => {
    if (newProject.name && newProject.description) {
      const updated = [...projects, newProject];
      setProjects(updated);
      localStorage.setItem("projects", JSON.stringify(updated));
      setNewProject({ name: "", description: "", technologies: "", link: "" });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
  };

  return (
    <section id="projects" className="min-h-screen flex items-center py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Folder className="h-10 w-10 text-accent" />
              Personal Projects
            </h2>
            <Button onClick={() => setIsAdding(!isAdding)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          {isAdding && (
            <Card className="p-6 mb-8 border-accent">
              <div className="space-y-4">
                <Input
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
                <Textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <Input
                  placeholder="Technologies Used (e.g., Python, React, SQL)"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                />
                <Input
                  placeholder="Project Link (optional)"
                  value={newProject.link}
                  onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                />
                <Button onClick={handleAdd} className="w-full">Add Project</Button>
              </div>
            </Card>
          )}

          {projects.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects added yet. Click "Add Project" to get started!</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
                    <button
                      onClick={() => handleRemove(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5 text-destructive" />
                    </button>
                  </div>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  {project.technologies && (
                    <p className="text-sm text-accent mb-2">
                      <strong>Technologies:</strong> {project.technologies}
                    </p>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Project →
                    </a>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
