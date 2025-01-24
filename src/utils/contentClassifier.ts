import { supabase } from "@/integrations/supabase/client";

export const classifyContent = async (text: string, customZone?: string): Promise<{ zone: string, tags: string[] }> => {
  try {
    if (customZone) {
      // If a custom zone is provided, use it directly
      const { data: tagsData, error: tagsError } = await supabase.functions.invoke('classify-content-gemini', {
        body: { content: text }
      });

      if (tagsError) throw tagsError;

      return {
        zone: customZone,
        tags: tagsData.tags || []
      };
    }

    // First, get AI-generated tags
    const { data: tagsData, error: tagsError } = await supabase.functions.invoke('classify-content-gemini', {
      body: { content: text }
    });

    if (tagsError) throw tagsError;
    
    // Then get zone classification
    const { data: zoneData, error: zoneError } = await supabase.functions.invoke('classify-content', {
      body: { content: text }
    });

    if (zoneError) throw zoneError;

    return {
      zone: zoneData.classification as string,
      tags: tagsData.tags || []
    };
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

    // Generate basic tags from matched keywords
    const matchedTags = [...productivityKeywords, ...entertainmentKeywords]
      .filter(keyword => lowerText.includes(keyword.toLowerCase()));

    return {
      zone: customZone || (productivityScore >= entertainmentScore ? "productivity" : "entertainment"),
      tags: matchedTags.slice(0, 5) // Limit to 5 tags for fallback
    };
  }
};