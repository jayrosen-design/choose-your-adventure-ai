
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { useApiKey } from "@/context/ApiKeyContext";

interface StoryHeaderProps {
  currentStep: number;
  totalSteps: number;
  onOpenApiKeyModal: () => void;
}

const StoryHeader = ({ currentStep, totalSteps, onOpenApiKeyModal }: StoryHeaderProps) => {
  const { isApiKeySet } = useApiKey();
  
  return (
    <header className="w-full max-w-5xl mx-auto mb-8 pt-6">
      <div className="flex justify-between items-center mb-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center flex-1"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-storyworld-space">
            Choose Your Adventure AI
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Create amazing children's stories with illustrations
          </p>
        </motion.div>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onOpenApiKeyModal}
        >
          <Key className="h-4 w-4" />
          {isApiKeySet ? "Update API Key" : "Set API Key"}
        </Button>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
        <motion.div 
          className="bg-primary h-2.5 rounded-full"
          initial={{ width: `${(currentStep / totalSteps) * 100}%` }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
    </header>
  );
};

export default StoryHeader;
