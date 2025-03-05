
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
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: `A child-friendly, colorful, cartoonish illustration of ${prompt}. The style should be suitable for children ages 8-11, with no scary, violent, or adult content.`,
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
