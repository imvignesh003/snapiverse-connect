import { supabase } from "@/integrations/supabase/client";

export const classifyContent = async (text: string): Promise<"productivity" | "entertainment"> => {
  try {
    const { data, error } = await supabase.functions.invoke('classify-content', {
      body: { content: text }
    });

    if (error) throw error;

    return data.classification as "productivity" | "entertainment";
  } catch (error) {
    console.error('Classification error:', error);
    
    // Fallback to keyword-based classification
    const productivityKeywords = [
      "work", "study", "productivity", "learning", "coding", "programming", 
      "development", "focus", "goals", "achievement", "progress", "discipline",
      "organization", "planning", "success", "improvement", "professional",
      "education", "skills", "growth", "efficiency", "workspace"
    ];

    const entertainmentKeywords = [
      "fun", "party", "game", "play", "entertainment", "music", "dance",
      "movie", "show", "concert", "festival", "relax", "chill", "enjoy",
      "weekend", "vacation", "leisure", "hobby", "adventure", "excitement"
    ];

    const lowerText = text.toLowerCase();
    const productivityScore = productivityKeywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    ).length;

    const entertainmentScore = entertainmentKeywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    ).length;

    return productivityScore >= entertainmentScore ? "productivity" : "entertainment";
  }
};