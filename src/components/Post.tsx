import { useState } from "react";
import { Heart, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PostProps {
  username: string;
  userImage: string;
  image: string;
  likes: number;
  caption: string;
  custom_tags?: string[];
}

export const Post = ({ username, userImage, image, likes: initialLikes, caption, custom_tags = [] }: PostProps) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    if (!liked) {
      setLikes(prev => prev + 1);
      setLiked(true);
    } else {
      setLikes(prev => prev - 1);
      setLiked(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-8">
      <div className="flex items-center p-4">
        <img src={userImage} alt={username} className="w-8 h-8 rounded-full object-cover" />
        <span className="ml-3 font-semibold">{username}</span>
      </div>
      
      <div className="relative">
        <img src={image} alt="Post" className="w-full aspect-square object-cover" />
        <button 
          onClick={handleLike}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-6 h-6 transition-colors ${liked ? 'fill-instagram-primary text-instagram-primary' : 'text-gray-700'}`}
          />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="font-semibold">{likes} likes</span>
        </div>
        <p className="mb-2">
          <span className="font-semibold mr-2">{username}</span>
          {caption}
        </p>
        {custom_tags && custom_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <Tag className="w-4 h-4 text-gray-500" />
            {custom_tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};