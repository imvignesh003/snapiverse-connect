import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Post } from "@/components/Post";
import { ZoneSelector, type Zone } from "@/components/ZoneSelector";
import { classifyContent } from "@/utils/contentClassifier";
import { useToast } from "@/components/ui/use-toast";

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
    username: "tech_enthusiast",
    userImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=800&fit=crop",
    likes: 1234,
    caption: "Just finished implementing a new feature! 💻 #coding #productivity #developer",
  },
  {
    id: 2,
    username: "workspace_goals",
    userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop",
    likes: 892,
    caption: "My productive workspace setup. Standing desk + ergonomic chair = productivity boost! 🚀 #workspace #productivity",
  },
  {
    id: 3,
    username: "study_with_me",
    userImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=800&fit=crop",
    likes: 567,
    caption: "Study session in progress 📚 Making progress on my thesis! #study #academic #focus",
  },
  {
    id: 4,
    username: "gaming_master",
    userImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=800&fit=crop",
    likes: 2341,
    caption: "Epic gaming session! 🎮 Just reached max level! #gaming #fun #entertainment",
  },
  {
    id: 5,
    username: "movie_buff",
    userImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=800&fit=crop",
    likes: 1567,
    caption: "Movie night! 🍿 This film was absolutely amazing! #movies #entertainment #weekend",
  },
  {
    id: 6,
    username: "book_worm",
    userImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=800&fit=crop",
    likes: 789,
    caption: "Reading this fascinating book on productivity techniques! 📖 #reading #selfimprovement #productivity",
  },
  {
    id: 7,
    username: "fitness_freak",
    userImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop",
    likes: 1432,
    caption: "Morning workout complete! 💪 Starting the day right! #fitness #health #discipline",
  },
  {
    id: 8,
    username: "party_people",
    userImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=800&fit=crop",
    likes: 2789,
    caption: "Best party ever! 🎉 Dancing all night long! #party #fun #weekend #entertainment",
  },
  {
    id: 9,
    username: "code_ninja",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=800&fit=crop",
    likes: 945,
    caption: "Deep in the code! 🖥️ Building something amazing! #programming #focus #productivity",
  },
  {
    id: 10,
    username: "music_lover",
    userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=800&fit=crop",
    likes: 1876,
    caption: "Vibing to my favorite playlist! 🎵 Music makes everything better! #music #relax #entertainment",
  }
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