
import { useState } from "react";
import { motion } from "framer-motion";
import { StoryTheme } from "../data/storyData";
import { Button } from "@/components/ui/button";
import { 
  Heart,
  Shield,
  Compass,
  Users,
  Mountain,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

interface ThemeSelectorProps {
  themes: StoryTheme[];
  onSelect: (theme: StoryTheme) => void;
  onContinue: () => void;
  onBack: () => void;
}

const ThemeSelector = ({ themes, onSelect, onContinue, onBack }: ThemeSelectorProps) => {
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme | null>(null);

  const handleSelect = (theme: StoryTheme) => {
    setSelectedTheme(theme);
    onSelect(theme);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "heart-handshake":
        return <Heart className="h-10 w-10" />;
      case "shield":
        return <Shield className="h-10 w-10" />;
      case "compass":
        return <Compass className="h-10 w-10" />;
      case "users":
        return <Users className="h-10 w-10" />;
      case "mountain":
        return <Mountain className="h-10 w-10" />;
      default:
        return <Heart className="h-10 w-10" />;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground mb-2"
        >
          Choose Your Story Theme
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          What kind of adventure will you have?
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {themes.map((theme) => (
          <motion.div
            key={theme.id}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`story-card cursor-pointer ${
              selectedTheme?.id === theme.id ? "story-card-selected" : ""
            }`}
            onClick={() => handleSelect(theme)}
          >
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4 glass">
              {getIcon(theme.icon)}
            </div>
            <h3 className="text-xl font-bold mb-2">{theme.name}</h3>
            <p className="text-muted-foreground">{theme.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex justify-center space-x-4"
      >
        <Button 
          className="btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          className="btn-primary"
          disabled={!selectedTheme}
          onClick={onContinue}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ThemeSelector;
