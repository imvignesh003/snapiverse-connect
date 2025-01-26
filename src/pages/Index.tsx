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
    zones: post.zones || []
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

    console.log('Filtering posts for zone:', selectedZone);
    console.log('Available posts:', posts);

    const filtered = posts.filter(post => {
      const normalizedSelectedZone = selectedZone.toLowerCase();
      const normalizedCustomZone = post.custom_zone?.toLowerCase() || '';
      const normalizedZones = post.zones?.map(z => z.toLowerCase()) || [];
      const normalizedZone = post.zone?.toLowerCase() || '';
      
      const isInZone = normalizedZones.includes(normalizedSelectedZone) ||
                      normalizedZone === normalizedSelectedZone ||
                      normalizedCustomZone === normalizedSelectedZone;
      
      console.log('Post zones:', {
        postId: post.id,
        zones: normalizedZones,
        zone: normalizedZone,
        customZone: normalizedCustomZone,
        selectedZone: normalizedSelectedZone,
        isIncluded: isInZone
      });
      
      return isInZone;
    });
    
    console.log('Filtered posts:', filtered);
    setFilteredPosts(filtered);

    const zoneDisplay = selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1);
    toast({
      title: `${zoneDisplay} Zone`,
      description: `Showing posts from ${zoneDisplay} zone`,
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
              <p className="text-lg font-medium mb-2">No posts found in {selectedZone} zone</p>
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