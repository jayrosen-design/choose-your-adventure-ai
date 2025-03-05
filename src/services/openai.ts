
import { toast } from "sonner";
import { Client } from "@gradio/client";

interface GenerateImageOptions {
  prompt: string;
  size?: string;
  apiKey: string;
}

export const generateImage = async ({
  prompt,
  size = "1024x1024",
  apiKey
}: GenerateImageOptions): Promise<string | null> => {
  if (!apiKey) {
    toast.error("HuggingFace access token is required");
    return null;
  }

  // Ensure the API key has the correct prefix
  const formattedApiKey = apiKey.startsWith("hf_") 
    ? apiKey 
    : `hf_${apiKey}` as const;

  try {
    const storybook_style = "Illustrations for a Children's book. Colorful, whimsical, child-friendly artwork with simple compositions and clear subjects.";
    
    const enhancedPrompt = `${storybook_style} ${prompt}`;
    toast.info("Generating image with FLUX.1-dev model...");
    
    // Parse size dimensions
    const [width, height] = size.split('x').map(dim => parseInt(dim, 10));
    
    // Connect to the HuggingFace model
    const client = await Client.connect("black-forest-labs/FLUX.1-dev", {
      hf_token: formattedApiKey
    });
    
    // Make prediction with the model
    const result = await client.predict("/infer", { 		
      prompt: enhancedPrompt, 		
      seed: 0, 		
      randomize_seed: true, 		
      width: width || 1024, 		
      height: height || 1024, 		
      guidance_scale: 3.5, 		
      num_inference_steps: 28, 
    });

    // Extract the image URL from the response
    if (result.data && result.data[0]) {
      return result.data[0];
    } else {
      throw new Error("No image data returned from HuggingFace");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    toast.error(error instanceof Error ? error.message : "Failed to generate image");
    return null;
  }
};
