
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Character } from "../data/storyData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  User, 
  X,
  Trash2,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CharacterCreatorProps {
  onUpdate: (characters: Character[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

const CharacterCreator = ({ onUpdate, onContinue, onBack }: CharacterCreatorProps) => {
  const [characters, setCharacters] = useState<Character[]>([
    { id: "1", name: "", personality: "", traits: [] }
  ]);
  const [currentTrait, setCurrentTrait] = useState<string>("");
  const [canContinue, setCanContinue] = useState<boolean>(false);

  useEffect(() => {
    checkCanContinue();
    onUpdate(characters);
  }, [characters]);

  const checkCanContinue = () => {
    const hasValidCharacter = characters.some(
      (char) => char.name.trim() !== "" && char.personality.trim() !== "" && char.traits.length > 0
    );
    setCanContinue(hasValidCharacter);
  };

  const handleAddCharacter = () => {
    if (characters.length >= 5) {
      toast.info("You can only create up to 5 characters");
      return;
    }
    
    setCharacters([
      ...characters,
      { id: Date.now().toString(), name: "", personality: "", traits: [] }
    ]);
  };

  const handleRemoveCharacter = (id: string) => {
    if (characters.length === 1) {
      toast.info("You need at least one character for your story");
      return;
    }
    
    setCharacters(characters.filter((char) => char.id !== id));
  };

  const handleUpdateCharacter = (id: string, field: keyof Character, value: any) => {
    setCharacters(
      characters.map((char) =>
        char.id === id ? { ...char, [field]: value } : char
      )
    );
  };

  const handleAddTrait = (id: string) => {
    if (!currentTrait.trim()) return;
    
    const character = characters.find((char) => char.id === id);
    if (character && character.traits.length >= 5) {
      toast.info("You can only add up to 5 traits per character");
      setCurrentTrait("");
      return;
    }

    setCharacters(
      characters.map((char) =>
        char.id === id
          ? {
              ...char,
              traits: [...char.traits, currentTrait.trim()]
            }
          : char
      )
    );
    setCurrentTrait("");
  };

  const handleRemoveTrait = (charId: string, trait: string) => {
    setCharacters(
      characters.map((char) =>
        char.id === charId
          ? {
              ...char,
              traits: char.traits.filter((t) => t !== trait)
            }
          : char
      )
    );
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
          Create Your Characters
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Who will be in your story? Create up to 5 characters.
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <AnimatePresence>
          {characters.map((character, index) => (
            <motion.div
              key={character.id}
              variants={item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-6 rounded-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Character {index + 1}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCharacter(character.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor={`name-${character.id}`} className="block text-sm font-medium mb-1">
                    Character Name
                  </label>
                  <Input
                    id={`name-${character.id}`}
                    value={character.name}
                    onChange={(e) => handleUpdateCharacter(character.id, "name", e.target.value)}
                    placeholder="Enter character name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor={`personality-${character.id}`} className="block text-sm font-medium mb-1">
                    Personality Description
                  </label>
                  <Textarea
                    id={`personality-${character.id}`}
                    value={character.personality}
                    onChange={(e) => handleUpdateCharacter(character.id, "personality", e.target.value)}
                    placeholder="Describe your character's personality"
                    className="w-full min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Character Traits</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {character.traits.map((trait) => (
                      <Badge key={trait} className="bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1">
                        {trait}
                        <button
                          onClick={() => handleRemoveTrait(character.id, trait)}
                          className="ml-2 text-primary hover:text-primary/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex">
                    <Input
                      value={currentTrait}
                      onChange={(e) => setCurrentTrait(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTrait(character.id);
                        }
                      }}
                      placeholder="Add a character trait (brave, kind, curious, etc.)"
                      className="w-full"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddTrait(character.id)}
                      className="ml-2 bg-primary text-white"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 flex justify-center"
      >
        <Button
          onClick={handleAddCharacter}
          className="w-full max-w-md bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          disabled={characters.length >= 5}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Another Character
        </Button>
      </motion.div>

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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          className="btn-primary"
          onClick={onContinue}
          disabled={!canContinue}
        >
          Create Story <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CharacterCreator;
