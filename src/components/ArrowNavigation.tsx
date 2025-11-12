import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArrowNavigationProps {
  onNavigate: (direction: "up" | "down" | "left" | "right") => void;
}

export const ArrowNavigation = ({ onNavigate }: ArrowNavigationProps) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="flex flex-col items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onNavigate("up")}
          className="bg-card/90 backdrop-blur-sm hover:bg-accent hover:border-accent"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onNavigate("left")}
            className="bg-card/90 backdrop-blur-sm hover:bg-accent hover:border-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onNavigate("down")}
            className="bg-card/90 backdrop-blur-sm hover:bg-accent hover:border-accent"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onNavigate("right")}
            className="bg-card/90 backdrop-blur-sm hover:bg-accent hover:border-accent"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
