
import { toast } from "sonner";

const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

interface GenerateImageOptions {
  prompt: string;
  n?: number;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
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
  size = "1024x1024",
  apiKey
}: GenerateImageOptions): Promise<string | null> => {
  if (!apiKey) {
    toast.error("OpenAI API key is required");
    return null;
  }

  try {
    const storybook_style = "Illustrations for a Children's book. Colorful, whimsical, child-friendly artwork with simple compositions and clear subjects.";
    
    const enhancedPrompt = `${storybook_style} ${prompt}`;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        n,
        size,
        model: "dall-e-3"
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
