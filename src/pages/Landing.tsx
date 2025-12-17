import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Copyright from "@/components/Copyright";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
            Welcome!
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            I'm <span className="text-accent font-semibold">Yonela Sibene</span>, an aspiring data business analyst with a strong passion for leveraging technology and artificial intelligence to transform data into actionable insights that drive informed, strategic decision-making.
          </p>
          
          <Button 
            onClick={() => navigate("/portfolio")} 
            size="lg"
            className="mt-8 text-lg px-8 py-6 group"
          >
            View My Portfolio
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      <Copyright />
    </div>
  );
};

export default Landing;
