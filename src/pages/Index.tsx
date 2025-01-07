import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Post } from "@/components/Post";
import { ZoneSelector, type Zone } from "@/components/ZoneSelector";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PostData {
  id: string;
  username: string;
  userImage: string;
  image: string;
  likes: number;
  caption: string;
  zone?: "productivity" | "entertainment";
}

const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      content,
      image_url,
      likes,
      zone,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((post: any) => ({
    id: post.id,
    username: post.profiles.username,
    userImage: post.profiles.avatar_url,
    image: post.image_url,
    likes: post.likes,
    caption: post.content,
    zone: post.zone,
  }));
};

const Index = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Enhanced query with proper caching
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
  });

  // Real-time updates with cache integration
  useEffect(() => {
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          // Invalidate and refetch cache when data changes
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  useEffect(() => {
    if (!posts || !selectedZone) {
      setFilteredPosts([]);
      return;
    }

    const filtered = posts.filter(post => post.zone === selectedZone);
    setFilteredPosts(filtered);

    toast({
      title: `${selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)} Zone`,
      description: "Content has been filtered based on your selection.",
    });
  }, [selectedZone, posts, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentZone={selectedZone} onZoneSwitch={setSelectedZone} />
      <ZoneSelector onZoneSelect={setSelectedZone} />
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-[600px]">
        {isLoading ? (
          <div className="text-center text-gray-500 mt-8">
            Loading posts...
          </div>
        ) : selectedZone ? (
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