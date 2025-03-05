
import { toast } from "sonner";

const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

interface GenerateImageOptions {
  prompt: string;
  n?: number;
  size?: "256x256" | "512x512" | "1024x1024";
  apiKey: string;
}

interface GeneratedImage {
  url: string;
}

interface OpenAIResponse {
  created: number;
  data: GeneratedImage[];
}

export const generateImage = async ({
  prompt,
  n = 1,
  size = "512x512",
  apiKey
}: GenerateImageOptions): Promise<string | null> => {
  if (!apiKey) {
    toast.error("OpenAI API key is required");
    return null;
  }

  try {
    const storybook_style = "Imagine you are creating illustrations for a classic children's storybook. Your artwork should evoke a whimsical, charming, and playful aesthetic tailored for young readers (grades 3–5). Use soft pastel colors, clear and gentle outlines, and a hand-drawn, storybook style that feels both engaging and nurturing. Ensure that every image is lighthearted and free of any dark, violent, or overly complex elements. The illustrations must always convey warmth, imagination, and simplicity, inviting young audiences into a magical, safe world.";
    
    const enhancedPrompt = `${storybook_style} Based on this style, illustrate: ${prompt}`;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        n,
        size
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate image");
    }

    const data: OpenAIResponse = await response.json();
    return data.data[0]?.url || null;
  } catch (error) {
    console.error("Error generating image:", error);
    toast.error(error instanceof Error ? error.message : "Failed to generate image");
    return null;
  }
};
