import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Post } from "@/components/Post";
import { ZoneSelector, type Zone } from "@/components/ZoneSelector";
import { classifyContent } from "@/utils/contentClassifier";
import { useToast } from "@/components/ui/use-toast";

// Extended post type with zone information
interface PostData {
  id: number;
  username: string;
  userImage: string;
  image: string;
  likes: number;
  caption: string;
  zone?: "productivity" | "entertainment";
}

const POSTS: PostData[] = [
  {
    id: 1,
    username: "john_doe",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=800&fit=crop",
    likes: 123,
    caption: "Coding day! 💻 #programming #developer",
  },
  {
    id: 2,
    username: "jane_smith",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop",
    likes: 456,
    caption: "Another day at the office 🚀 #tech #work",
  },
  {
    id: 3,
    username: "tech_enthusiast",
    userImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=800&fit=crop",
    likes: 789,
    caption: "Setup of the day ⚡️ #setup #workspace",
  },
];

const Index = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const classifyPosts = async () => {
      if (!selectedZone) return;

      try {
        const classifiedPosts = await Promise.all(
          POSTS.map(async (post) => {
            const zone = await classifyContent(post.caption);
            return { ...post, zone };
          })
        );

        const filtered = classifiedPosts.filter((post) => post.zone === selectedZone);
        setFilteredPosts(filtered);

        toast({
          title: `${selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)} Zone`,
          description: "Content has been filtered based on your selection.",
        });
      } catch (error) {
        console.error("Error classifying posts:", error);
        toast({
          title: "Error",
          description: "Failed to classify posts. Please try again.",
          variant: "destructive",
        });
      }
    };

    classifyPosts();
  }, [selectedZone, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ZoneSelector onZoneSelect={setSelectedZone} />
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-[600px]">
        {selectedZone ? (
          filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <Post key={post.id} {...post} />)
          ) : (
            <div className="text-center text-gray-500 mt-8">
              No posts found in this zone.
            </div>
          )
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Please select a zone to view content.
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;