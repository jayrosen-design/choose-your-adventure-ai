
import { useState } from "react";
import { motion } from "framer-motion";
import { StoryEnvironment } from "../data/storyData";
import { Button } from "@/components/ui/button";
import { 
  Rocket,
  Castle,
  Trees,
  Fish,
  Search,
  ArrowRight
} from "lucide-react";

interface EnvironmentSelectorProps {
  environments: StoryEnvironment[];
  onSelect: (environment: StoryEnvironment) => void;
  onContinue: () => void;
}

const EnvironmentSelector = ({ environments, onSelect, onContinue }: EnvironmentSelectorProps) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<StoryEnvironment | null>(null);

  const handleSelect = (environment: StoryEnvironment) => {
    setSelectedEnvironment(environment);
    onSelect(environment);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "rocket":
        return <Rocket className="h-10 w-10" />;
      case "castle":
        return <Castle className="h-10 w-10" />;
      case "trees":
        return <Trees className="h-10 w-10" />;
      case "fish":
        return <Fish className="h-10 w-10" />;
      case "search":
        return <Search className="h-10 w-10" />;
      default:
        return <Castle className="h-10 w-10" />;
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
          Choose Your Story World
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Where will your adventure take place?
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {environments.map((environment) => (
          <motion.div
            key={environment.id}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`story-card cursor-pointer ${
              selectedEnvironment?.id === environment.id ? "story-card-selected" : ""
            } ${environment.bgClass}`}
            onClick={() => handleSelect(environment)}
          >
            <div className={`flex justify-center items-center w-16 h-16 rounded-full bg-${environment.color} text-white mb-4 glass`}>
              {getIcon(environment.icon)}
            </div>
            <h3 className="text-xl font-bold mb-2">{environment.name}</h3>
            <p className="text-muted-foreground">{environment.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex justify-center"
      >
        <Button 
          className="btn-primary"
          disabled={!selectedEnvironment}
          onClick={onContinue}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EnvironmentSelector;
