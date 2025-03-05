
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Check } from "lucide-react";
import { useApiKey } from "@/context/ApiKeyContext";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onContinue: () => void;
}

const ApiKeyInput = ({ onContinue }: ApiKeyInputProps) => {
  const { apiKey, setApiKey, isApiKeySet } = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey);
  const [isValidating, setIsValidating] = useState(false);

  const validateAndSetKey = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter your OpenAI API key");
      return;
    }
    
    if (!inputValue.startsWith("sk-") || inputValue.length < 30) {
      toast.error("Invalid API key format. OpenAI keys start with 'sk-'");
      return;
    }

    setIsValidating(true);
    
    // Simple validation - in a real app you might want to test the key
    // by making a minimal API call
    setTimeout(() => {
      setApiKey(inputValue.trim());
      setIsValidating(false);
      toast.success("API key saved for this session");
      onContinue();
    }, 500);
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
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Enter your OpenAI API Key</h2>
          <p className="text-muted-foreground">
            Your API key will be used to generate images for your story.
            It's stored only in your browser during this session.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
              OpenAI API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="sk-..."
              className="w-full"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your key stays in your browser and is never sent to our servers.
            </p>
          </div>

          <Button
            onClick={validateAndSetKey}
            className="w-full btn-primary"
            disabled={isValidating || !inputValue.trim()}
          >
            {isValidating ? (
              "Validating..."
            ) : isApiKeySet ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Continue
              </>
            ) : (
              "Save & Continue"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiKeyInput;
