
export interface StoryEnvironment {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgClass: string;
}

export interface StoryTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Character {
  id: string;
  name: string;
  personality: string;
  traits: string[];
}

export interface StoryDetails {
  environment: StoryEnvironment | null;
  theme: StoryTheme | null;
  characters: Character[];
}

export const environments: StoryEnvironment[] = [
  {
    id: "fantasy",
    name: "Fantasy Kingdom",
    description: "A magical land with castles, dragons, and adventure around every corner!",
    icon: "castle",
    color: "storyworld-fantasy",
    bgClass: "bg-storyworld-fantasy/10"
  },
  {
    id: "space",
    name: "Outer Space",
    description: "Explore distant planets, meet friendly aliens, and discover the wonders of the universe.",
    icon: "rocket",
    color: "storyworld-space",
    bgClass: "bg-storyworld-space/10"
  },
  {
    id: "forest",
    name: "Enchanted Forest",
    description: "Towering trees, friendly animals, and magical plants fill this special woodland.",
    icon: "trees",
    color: "storyworld-forest",
    bgClass: "bg-storyworld-forest/10"
  },
  {
    id: "underwater",
    name: "Underwater Adventure",
    description: "Dive deep beneath the waves to explore coral reefs and meet colorful sea creatures.",
    icon: "fish",
    color: "storyworld-underwater",
    bgClass: "bg-storyworld-underwater/10"
  },
  {
    id: "mystery",
    name: "Mystery City",
    description: "Solve puzzles and follow clues in a city full of surprises and friendly neighborhoods.",
    icon: "search",
    color: "storyworld-mystery",
    bgClass: "bg-storyworld-mystery/10"
  }
];

export const themes: StoryTheme[] = [
  {
    id: "friendship",
    name: "Friendship",
    description: "A story about making new friends and working together through challenges.",
    icon: "heart-handshake"
  },
  {
    id: "courage",
    name: "Courage",
    description: "Face fears and discover inner strength on an exciting journey.",
    icon: "shield"
  },
  {
    id: "discovery",
    name: "Discovery",
    description: "Explore new places and learn amazing things about the world.",
    icon: "compass"
  },
  {
    id: "teamwork",
    name: "Teamwork",
    description: "Join forces to accomplish goals that can't be achieved alone.",
    icon: "users"
  },
  {
    id: "obstacles",
    name: "Overcoming Obstacles",
    description: "Find creative ways to solve problems and overcome challenges.",
    icon: "mountain"
  }
];

// Safety content filters
export const bannedWords: string[] = [
  "violent", "scary", "kill", "murder", "blood", "weapon", "gun", "knife", 
  "die", "death", "hate", "fight", "evil", "devil", "terror", "horror"
];

export const safetyFilter = (content: string): boolean => {
  const lowerContent = content.toLowerCase();
  return !bannedWords.some(word => lowerContent.includes(word));
};
