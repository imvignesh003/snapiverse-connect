import { pipeline } from "@huggingface/transformers";

let classifier: any = null;

export const initializeClassifier = async () => {
  if (!classifier) {
    classifier = await pipeline(
      "text-classification",
      "onnx-community/distilbert-base-uncased-finetuned-sst-2-english",
      { device: "webgpu" }
    );
  }
  return classifier;
};

export const classifyContent = async (text: string): Promise<"productivity" | "entertainment"> => {
  // Keywords that indicate productivity content
  const productivityKeywords = [
    "work", "study", "productivity", "learning", "coding", "programming", 
    "development", "focus", "goals", "achievement", "progress", "discipline",
    "organization", "planning", "success", "improvement", "professional",
    "education", "skills", "growth", "efficiency", "workspace"
  ];

  // Keywords that indicate entertainment content
  const entertainmentKeywords = [
    "fun", "party", "game", "play", "entertainment", "music", "dance",
    "movie", "show", "concert", "festival", "relax", "chill", "enjoy",
    "weekend", "vacation", "leisure", "hobby", "adventure", "excitement"
  ];

  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();

  // Count matches for each category
  const productivityScore = productivityKeywords.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  ).length;

  const entertainmentScore = entertainmentKeywords.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  ).length;

  // If there's a clear winner, use that
  if (productivityScore > entertainmentScore) {
    return "productivity";
  } else if (entertainmentScore > productivityScore) {
    return "entertainment";
  }

  // If it's a tie or no matches, use the ML model as a fallback
  const classifier = await initializeClassifier();
  const result = await classifier(text);
  
  // Map the sentiment to our zones (positive -> productivity, negative -> entertainment)
  return result[0].label === "POSITIVE" ? "productivity" : "entertainment";
};