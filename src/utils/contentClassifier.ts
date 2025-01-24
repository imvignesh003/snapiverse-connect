import { supabase } from "@/integrations/supabase/client";

export const classifyContent = async (text: string, customZone?: string): Promise<{ zone: string, zones: string[], tags: string[] }> => {
  try {
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

    // Create zones array with primary zone and custom zone if provided
    const zones = [zoneData.classification as string];
    if (customZone) {
      zones.push(customZone);
    }

    return {
      zone: zoneData.classification as string,
      zones: zones,
      tags: tagsData.tags || []
    };
  } catch (error) {
    console.error('Classification error:', error);
    
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

    const primaryZone = productivityScore >= entertainmentScore ? "productivity" : "entertainment";
    const zones = [primaryZone];
    if (customZone) {
      zones.push(customZone);
    }

    // Generate basic tags from matched keywords
    const matchedTags = [...productivityKeywords, ...entertainmentKeywords]
      .filter(keyword => lowerText.includes(keyword.toLowerCase()));

    return {
      zone: primaryZone,
      zones: zones,
      tags: matchedTags.slice(0, 5) // Limit to 5 tags for fallback
    };
  }
};