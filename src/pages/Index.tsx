
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StoryHeader from "@/components/StoryHeader";
import EnvironmentSelector from "@/components/EnvironmentSelector";
import ThemeSelector from "@/components/ThemeSelector";
import CharacterCreator from "@/components/CharacterCreator";
import StoryPreview from "@/components/StoryPreview";
import ApiKeyInput from "@/components/ApiKeyInput";
import { ApiKeyProvider, useApiKey } from "@/context/ApiKeyContext";
import { environments, themes, Character, StoryDetails, StoryEnvironment, StoryTheme } from "@/data/storyData";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const StoryCreator = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [storyDetails, setStoryDetails] = useState<StoryDetails>({
    environment: null,
    theme: null,
    characters: [],
  });
  const { isApiKeySet } = useApiKey();

  const handleEnvironmentSelect = (environment: StoryEnvironment) => {
    setStoryDetails({ ...storyDetails, environment });
  };

  const handleThemeSelect = (theme: StoryTheme) => {
    setStoryDetails({ ...storyDetails, theme });
  };

  const handleCharactersUpdate = (characters: Character[]) => {
    setStoryDetails({ ...storyDetails, characters });
  };

  const goToNextStep = () => {
    // If we're moving to the final step (preview) and API key isn't set,
    // prompt the user to set it first
    if (currentStep === 4 && !isApiKeySet) {
      setShowApiKeyModal(true);
      return;
    }
    
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleStoryRegenerate = () => {
    // This function will be implemented to regenerate the story with the same parameters
    console.log("Regenerating story...");
  };

  const startNewStory = () => {
    setStoryDetails({
      environment: null,
      theme: null,
      characters: [],
    });
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EnvironmentSelector
            environments={environments}
            onSelect={handleEnvironmentSelect}
            onContinue={goToNextStep}
          />
        );
      case 2:
        return (
          <ThemeSelector
            themes={themes}
            onSelect={handleThemeSelect}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <CharacterCreator
            onUpdate={handleCharactersUpdate}
            onContinue={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        if (storyDetails.environment && storyDetails.theme) {
          const validCharacters = storyDetails.characters.filter(
            (char) => char.name && char.personality && char.traits.length > 0
          );
          
          return (
            <StoryPreview
              environment={storyDetails.environment}
              theme={storyDetails.theme}
              characters={validCharacters}
              onBack={goToPreviousStep}
              onRegenerate={handleStoryRegenerate}
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background bg-hero-pattern py-8 px-4 overflow-hidden">
      {currentStep < 5 ? (
        <>
          <StoryHeader 
            currentStep={currentStep} 
            totalSteps={4} 
            onOpenApiKeyModal={() => setShowApiKeyModal(true)} 
          />
          
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
          
          {/* API Key Modal */}
          {showApiKeyModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <ApiKeyInput 
                isModal={true}
                onClose={() => setShowApiKeyModal(false)} 
                onContinue={() => {
                  setShowApiKeyModal(false);
                  // If we were trying to go to preview, continue to it
                  if (currentStep === 4) {
                    setCurrentStep(currentStep + 1);
                    window.scrollTo(0, 0);
                  }
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="glass p-12 rounded-xl max-w-md text-center">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Story Complete!</h2>
            <p className="text-muted-foreground mb-8">
              Your amazing adventure is ready! Would you like to create another story?
            </p>
            <Button onClick={startNewStory} className="btn-primary">
              Create A New Story
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <ApiKeyProvider>
      <StoryCreator />
    </ApiKeyProvider>
  );
};

export default Index;
