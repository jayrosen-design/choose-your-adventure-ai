import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Character, StoryEnvironment, StoryTheme } from "../data/storyData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, RefreshCw, Download, Image } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiKey } from "@/context/ApiKeyContext";
import { generateImage } from "@/services/openai";
import { toast } from "sonner";

interface StoryPreviewProps {
  environment: StoryEnvironment;
  theme: StoryTheme;
  characters: Character[];
  onBack: () => void;
  onRegenerate: () => void;
}

interface StoryContent {
  title: string;
  introduction: string;
  scenes: {
    description: string;
    dialogue: string[];
    imagePrompt: string;
    imageUrl?: string;
  }[];
  conclusion: string;
}

const StoryPreview = ({ environment, theme, characters, onBack, onRegenerate }: StoryPreviewProps) => {
  const [storyContent, setStoryContent] = useState<StoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);
  const [generatingImage, setGeneratingImage] = useState(false);
  const { apiKey } = useApiKey();

  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      const mockStory = generateMockStory(environment, theme, characters);
      setStoryContent(mockStory);
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [environment, theme, characters]);

  const generateMockStory = (
    environment: StoryEnvironment, 
    theme: StoryTheme, 
    characters: Character[]
  ): StoryContent => {
    const validCharacters = characters.filter(
      char => char.name && char.personality && char.traits.length > 0
    );
    
    const mainCharacter = validCharacters[0];
    const supportingCharacters = validCharacters.slice(1);
    
    return {
      title: `${mainCharacter.name}'s ${theme.name} Adventure in the ${environment.name}`,
      introduction: `Once upon a time in the ${environment.name}, there lived a ${
        mainCharacter.traits[0]
      } character named ${mainCharacter.name}. ${mainCharacter.name} was known for being ${
        mainCharacter.personality
      }. Today was special because ${mainCharacter.name} was about to discover the true meaning of ${theme.name}.`,
      scenes: [
        {
          description: `${mainCharacter.name} was exploring the ${environment.name} when suddenly something unexpected happened.`,
          dialogue: [
            `"I wonder what adventures await me today," said ${mainCharacter.name}.`,
            supportingCharacters.length > 0 
              ? `"Hello there! I've been looking for someone like you," said ${supportingCharacters[0].name}.` 
              : `A mysterious voice called out, "Hello there! I've been looking for someone like you."`
          ],
          imagePrompt: `A friendly, child-appropriate scene of ${mainCharacter.name} in the ${environment.name}, looking surprised and excited.`
        },
        {
          description: `The challenge related to ${theme.name} became clear, and ${mainCharacter.name} knew what needed to be done.`,
          dialogue: [
            `"This won't be easy, but I know I can do it because I'm ${mainCharacter.traits.join(' and ')}," said ${mainCharacter.name}.`,
            supportingCharacters.length > 0 
              ? `"We believe in you! We'll help you," said ${supportingCharacters[0].name}.` 
              : `"You can do it!" encouraged the friendly creatures of the ${environment.name}.`
          ],
          imagePrompt: `A colorful illustration showing ${mainCharacter.name} facing a challenge in the ${environment.name} with determination.`
        },
        {
          description: `Using ${mainCharacter.traits.join(' and ')}, ${mainCharacter.name} found a creative solution to the problem.`,
          dialogue: [
            `"I've got it! We can work together and solve this," exclaimed ${mainCharacter.name}.`,
            supportingCharacters.length > 0 
              ? `"Your plan is brilliant! That's why we're friends," replied ${supportingCharacters[0].name}.` 
              : `"What a wonderful idea!" the friendly creatures cheered.`
          ],
          imagePrompt: `A joyful scene showing ${mainCharacter.name} and friends working together to solve a problem in the ${environment.name}.`
        }
      ],
      conclusion: `Through this adventure, ${mainCharacter.name} learned the true meaning of ${
        theme.name
      }. Everyone in the ${environment.name} celebrated their success, and ${
        mainCharacter.name
      } felt proud to be ${mainCharacter.traits.join(' and ')}. The end!`
    };
  };

  const handleRegenerate = () => {
    setLoading(true);
    onRegenerate();
    
    setTimeout(() => {
      const newStory = generateMockStory(environment, theme, characters);
      setStoryContent(newStory);
      setCurrentScene(0);
      setLoading(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (!storyContent) return;
    
    const storyText = `
      ${storyContent.title}
      
      ${storyContent.introduction}
      
      ${storyContent.scenes.map((scene, index) => `
        Scene ${index + 1}:
        ${scene.description}
        
        ${scene.dialogue.join('\n')}
      `).join('\n\n')}
      
      ${storyContent.conclusion}
    `;
    
    const element = document.createElement("a");
    const file = new Blob([storyText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${storyContent.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const nextScene = () => {
    if (storyContent && currentScene < storyContent.scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const prevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  const handleGenerateImage = async () => {
    if (!storyContent || !apiKey) return;
    
    const currentSceneData = storyContent.scenes[currentScene];
    if (!currentSceneData) return;
    
    setGeneratingImage(true);
    toast.info("Generating image...");
    
    try {
      const imageUrl = await generateImage({
        prompt: currentSceneData.imagePrompt,
        apiKey,
        size: "512x512"
      });
      
      if (imageUrl) {
        const updatedScenes = storyContent.scenes.map((scene, index) => {
          if (index === currentScene) {
            return { ...scene, imageUrl };
          }
          return scene;
        });
        
        setStoryContent({
          ...storyContent,
          scenes: updatedScenes
        });
        
        toast.success("Image generated successfully!");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setGeneratingImage(false);
    }
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
          Your Story
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Here's the adventure we created for you!
        </motion.p>
      </div>

      <div className="glass p-8 rounded-xl">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-40 w-full" />
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : storyContent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-center">{storyContent.title}</h3>
            
            {currentScene === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-secondary/30 p-6 rounded-lg text-center italic"
              >
                {storyContent.introduction}
              </motion.div>
            )}
            
            {storyContent.scenes[currentScene] && (
              <motion.div
                key={currentScene}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="bg-primary/10 p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Scene {currentScene + 1}</h4>
                  <p>{storyContent.scenes[currentScene].description}</p>
                </div>
                
                <div className="bg-secondary/30 p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Dialogue</h4>
                  {storyContent.scenes[currentScene].dialogue.map((line, i) => (
                    <p key={i} className="mb-2 italic">
                      {line}
                    </p>
                  ))}
                </div>
                
                <div className="border border-dashed border-primary/50 bg-accent/30 p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Image Description</h4>
                  <p className="text-muted-foreground text-sm">
                    {storyContent.scenes[currentScene].imagePrompt}
                  </p>
                  <div className="mt-4 aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {storyContent.scenes[currentScene].imageUrl ? (
                      <img 
                        src={storyContent.scenes[currentScene].imageUrl} 
                        alt={`Scene ${currentScene + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Book className="h-16 w-16 text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground mb-3">No illustration yet</p>
                        <Button 
                          onClick={handleGenerateImage}
                          disabled={generatingImage}
                          className="bg-storyworld-space hover:bg-storyworld-space/90 text-white"
                        >
                          <Image className={`mr-2 h-4 w-4 ${generatingImage ? "animate-spin" : ""}`} />
                          {generatingImage ? "Generating..." : "Generate Image"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {currentScene === storyContent.scenes.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-primary/10 p-6 rounded-lg text-center italic"
              >
                {storyContent.conclusion}
              </motion.div>
            )}
            
            <div className="flex justify-center space-x-3 mt-6">
              <Button 
                onClick={prevScene} 
                disabled={currentScene === 0}
                className="btn-secondary"
              >
                Previous Scene
              </Button>
              <Button 
                onClick={nextScene} 
                disabled={currentScene === storyContent.scenes.length - 1}
                className="btn-primary"
              >
                Next Scene
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-muted-foreground">
            Something went wrong while generating your story. Please try again.
          </div>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex justify-center space-x-4"
      >
        <Button 
          className="btn-secondary"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Characters
        </Button>
        <Button 
          className="bg-storyworld-space hover:bg-storyworld-space/90 text-white"
          onClick={handleRegenerate}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> 
          {loading ? "Generating..." : "Regenerate Story"}
        </Button>
        <Button 
          className="bg-storyworld-forest hover:bg-storyworld-forest/90 text-white"
          onClick={handleDownload}
          disabled={loading || !storyContent}
        >
          <Download className="mr-2 h-4 w-4" /> Save Story
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default StoryPreview;
