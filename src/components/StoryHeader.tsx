
import { motion } from "framer-motion";

interface StoryHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const StoryHeader = ({ currentStep, totalSteps }: StoryHeaderProps) => {
  return (
    <header className="w-full max-w-5xl mx-auto mb-8 pt-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-storyworld-space">
          Choose Your Adventure AI
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Create amazing children's stories with illustrations
        </p>
      </motion.div>
      
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
