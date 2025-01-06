import { Header } from "@/components/Header";
import { Post } from "@/components/Post";

const POSTS = [
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
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-[600px]">
        {POSTS.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </main>
    </div>
  );
};

export default Index;