import React, { useState } from 'react';
import { Heart, Send, Shield, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Community() {
  const [posts, setPosts] = useState([
    { id: 1, text: "I've been feeling really overwhelmed with work lately. Just taking it one day at a time.", likes: 12, time: "2 hours ago", avatarBg: "bg-[#e8c4b4]", emoji: "🌱" },
    { id: 2, text: "Started my anxiety journal today. It's hard to confront the triggers, but I know it's a step forward.", likes: 24, time: "5 hours ago", avatarBg: "bg-[#c4a040]/20", emoji: "📝" },
    { id: 3, text: "To anyone reading this who feels alone: you matter, and things can get better. Keep holding on.", likes: 56, time: "1 day ago", avatarBg: "bg-[#7baec8]/20", emoji: "🌟" }
  ]);
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      const bgs = ["bg-[#e8c4b4]", "bg-[#c4a040]/20", "bg-[#7baec8]/20", "bg-[#7a9e7e]/20", "bg-[#c4605a]/20"];
      const emojis = ["💭", "✨", "🌻", "🕊️", "💪"];
      const randomBg = bgs[Math.floor(Math.random() * bgs.length)];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      setPosts([{ id: Date.now() + Math.random(), text: newPost, likes: 0, time: "Just now", avatarBg: randomBg, emoji: randomEmoji }, ...posts]);
      setNewPost('');
      setIsSubmitting(false);
    }, 600);
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#7baec8]/10 text-[#7baec8] mb-6">
          <Users size={32} />
        </div>
        <h2 className="font-serif text-4xl text-[#2c3028] mb-4">Peer Community</h2>
        <p className="text-lg text-[#6b7265]">A safe, anonymous space to share your thoughts and support others. Your identity is completely hidden.</p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2rem] border border-[#d8d0c4] shadow-sm p-8 mb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#7baec8]/10 to-transparent rounded-bl-full pointer-events-none"></div>
        
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="flex items-center gap-3 mb-6 text-[#2d5a30] font-medium">
            <Shield size={20} className="text-[#7a9e7e]" />
            <span>Safe & Anonymous Space</span>
          </div>
          <textarea 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share what's on your mind... (e.g., a small win, a struggle, or words of encouragement)"
            className="w-full bg-[#fdfaf4] border-2 border-[#f0ece5] rounded-2xl p-6 text-lg focus:outline-none focus:border-[#7a9e7e] focus:ring-4 focus:ring-[#7a9e7e]/10 resize-none h-32 mb-6 transition-all placeholder:text-[#a3a89f]"
            disabled={isSubmitting}
          />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-[#6b7265] flex items-center gap-2">
              <Sparkles size={16} className="text-[#c4a040]" />
              Your post will appear instantly to others.
            </span>
            <button 
              type="submit" 
              disabled={!newPost.trim() || isSubmitting}
              className="w-full sm:w-auto bg-[#2d5a30] hover:bg-[#1e3d20] disabled:bg-[#a3a89f] text-white px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Send size={18} />
                </motion.div>
              ) : (
                <>
                  <Send size={18} /> Post Anonymously
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
              key={post.id} 
              className="bg-white rounded-[2rem] border border-[#d8d0c4] p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full ${post.avatarBg} flex items-center justify-center text-2xl shadow-inner`}>
                  {post.emoji}
                </div>
                <div>
                  <div className="font-bold text-lg text-[#2c3028]">Anonymous User</div>
                  <div className="text-sm text-[#6b7265]">{post.time}</div>
                </div>
              </div>
              <p className="text-[#2c3028] text-lg mb-8 leading-relaxed">{post.text}</p>
              <div className="flex gap-4 border-t border-[#f0ece5] pt-6">
                <button 
                  onClick={() => handleLike(post.id)} 
                  className="flex items-center gap-2 text-[#6b7265] hover:text-[#c4605a] transition-colors group font-medium bg-[#fdfaf4] px-4 py-2 rounded-full hover:bg-[#c4605a]/10"
                >
                  <Heart size={20} className={`transition-transform group-hover:scale-110 ${post.likes > 0 ? 'fill-[#c4605a]/20 text-[#c4605a]' : ''}`} /> 
                  <span className={post.likes > 0 ? 'text-[#c4605a]' : ''}>{post.likes} Support</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
