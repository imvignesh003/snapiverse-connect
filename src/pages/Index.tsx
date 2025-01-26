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
  zone?: Zone;
  custom_zone?: string;
  custom_tags?: string[];
  zones?: string[];
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
      custom_zone,
      custom_tags,
      zones,
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
    custom_zone: post.custom_zone,
    custom_tags: post.custom_tags,
    zones: post.zones
  }));
};

const Index = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
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

    const filtered = posts.filter(post => {
      const normalizedSelectedZone = selectedZone.toLowerCase();
      const normalizedCustomZone = post.custom_zone?.toLowerCase() || '';
      
      return (
        post.zones?.includes(normalizedSelectedZone) ||
        post.zone?.toLowerCase() === normalizedSelectedZone ||
        normalizedCustomZone === normalizedSelectedZone
      );
    });
    
    setFilteredPosts(filtered);

    toast({
      title: `${selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)} Zone`,
      description: `Content has been filtered based on your selection.`,
    });
  }, [selectedZone, posts, toast]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-semibold mb-2">Error Loading Posts</h2>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentZone={selectedZone} onZoneSwitch={setSelectedZone} />
      <ZoneSelector onZoneSelect={setSelectedZone} />
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-[600px]">
        {isLoading ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white h-96 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : selectedZone ? (
          filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <Post key={post.id} {...post} />)
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg font-medium mb-2">No posts found in this zone</p>
              <p>Try selecting a different zone or check back later</p>
            </div>
          )
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg font-medium mb-2">Welcome to Zone-Based Content</p>
            <p>Please select a zone to view relevant content</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;