
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiKey } from "@/context/ApiKeyContext";
import { KeyRound, ArrowRight, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKeyInputProps {
  onContinue: () => void;
}

const ApiKeyInput = ({ onContinue }: ApiKeyInputProps) => {
  const { apiKey, setApiKey, isApiKeySet } = useApiKey();
  const [inputKey, setInputKey] = useState(apiKey);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().length > 0) {
      // Remove any leading "hf_" if the user already included it
      // (Since we add it in the openai.ts file)
      const cleanKey = inputKey.trim().startsWith("hf_") 
        ? inputKey.trim() 
        : inputKey.trim();
      
      setApiKey(cleanKey);
      onContinue();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass p-8 rounded-xl">
        <div className="text-center mb-6">
          <KeyRound className="h-12 w-12 text-primary mx-auto mb-2" />
          <h2 className="text-2xl font-bold">HuggingFace Access Token</h2>
          <p className="text-muted-foreground mt-1">
            Enter your HuggingFace access token to generate story illustrations
          </p>
        </div>

        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-600">
            Your token is stored locally in your browser and is never sent to our servers.
          </AlertDescription>
        </Alert>

        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-600">
            The token should start with "hf_". If you don't include it, we'll add it automatically.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter your HuggingFace access token"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Don't have a token? <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Get one from HuggingFace
              </a>
            </p>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={inputKey.trim().length === 0}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ApiKeyInput;
