import React, { useState, useEffect } from 'react';
import { Heart, Send, Shield, AlertTriangle, X, Phone, Wind, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CRISIS_WORDS = ['suicide', 'kill myself', 'end my life', 'want to die', 'self harm', 'hurt myself', 'no reason to live', 'cant go on', "can't go on", 'overdose', 'ending it'];
const HELP_WORDS = ['help', 'helpless', 'desperate', 'crisis', 'emergency', 'need someone', 'drowning', 'breaking down'];
const SUPPORT_WORDS = ['anxious', 'anxiety', 'panic', 'depressed', 'depression', 'sad', 'lonely', 'overwhelmed', 'scared', 'hopeless', 'worthless'];

function detectIntent(text: string): 'crisis' | 'help' | 'support' | 'none' {
  const lower = text.toLowerCase();
  if (CRISIS_WORDS.some(w => lower.includes(w))) return 'crisis';
  if (HELP_WORDS.some(w => lower.includes(w))) return 'help';
  if (SUPPORT_WORDS.some(w => lower.includes(w))) return 'support';
  return 'none';
}

const SEED_POSTS = [
  { id: 1, text: "I've been feeling really overwhelmed with work lately. Just taking it one day at a time.", likes: 12, time: '2 hours ago', avatarBg: 'bg-[#e8c4b4]', emoji: '🌱', liked: false },
  { id: 2, text: "Started my anxiety journal today. It's hard to confront the triggers, but I know it's a step forward.", likes: 24, time: '5 hours ago', avatarBg: 'bg-[#c4dde8]', emoji: '📝', liked: false },
  { id: 3, text: "To anyone reading this who feels alone: you matter, and things can get better. Keep holding on. 💚", likes: 56, time: '1 day ago', avatarBg: 'bg-[#b8d4ba]', emoji: '🌟', liked: false },
];

const STORAGE_KEY = 'mb_peer_posts';
const MAX_CHARS = 400;

function loadPosts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : SEED_POSTS;
  } catch { return SEED_POSTS; }
}

export default function PeerCommunity({ setTab }: { setTab?: (tab: string) => void }) {
  const [posts, setPosts] = useState(() => loadPosts());
  const [newPost, setNewPost] = useState('');
  const [alert, setAlert] = useState<{ type: 'crisis' | 'help' | 'support'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist posts to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts.slice(0, 50))); } catch {}
  }, [posts]);

  const handleTextChange = (val: string) => {
    setNewPost(val);
    const intent = detectIntent(val);
    if (intent === 'crisis') {
      setAlert({ type: 'crisis', text: val });
    } else if (intent === 'help') {
      setAlert({ type: 'help', text: val });
    } else if (intent === 'support') {
      setAlert({ type: 'support', text: val });
    } else {
      setAlert(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const bgs = ['bg-[#e8c4b4]', 'bg-[#c4dde8]', 'bg-[#b8d4ba]', 'bg-[#f0c896]', 'bg-[#c4b8e8]'];
      const emojis = ['💭', '✨', '🌻', '🕊️', '💪', '🌿', '🌊', '⭐'];
      setPosts([{
        id: Date.now(), text: newPost, likes: 0, time: 'Just now',
        avatarBg: bgs[Math.floor(Math.random() * bgs.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        liked: false
      }, ...posts]);
      setNewPost('');
      setAlert(null);
      setIsSubmitting(false);
    }, 500);
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + (p.liked ? -1 : 1), liked: !p.liked } : p));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e8f5e9] text-[#4a7c59] mb-5">
          <Shield size={28} />
        </div>
        <h2 className="font-serif text-4xl text-[#2c3028] mb-3">Peer Community</h2>
        <p className="text-lg text-[#6b7265]">A safe, anonymous space. No usernames. No identifiers. Ever.</p>
        <div className="mt-3 bg-[#fff8e1] border border-[#ffe082] rounded-xl px-4 py-2.5 text-sm text-[#6b5e00] inline-block">
          💬 If you're in crisis, your post will immediately show resources to help you.
        </div>
      </div>

      {/* Post Form */}
      <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-[2rem] border border-[#d8d0c4] shadow-sm p-7 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#e8f5e9]/40 to-transparent rounded-bl-full pointer-events-none" />

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="flex items-center gap-2 mb-4 text-[#4a7c59] font-semibold text-sm">
            <Shield size={16} className="text-[#7a9e7e]" /> Safe & Anonymous Space - your identity is never stored
          </div>

          <textarea
            value={newPost}
            onChange={e => handleTextChange(e.target.value.slice(0, MAX_CHARS))}
            maxLength={MAX_CHARS}
            placeholder="Share what's on your mind… a small win, a struggle, or words of encouragement for others."
            className="w-full bg-[#fdfaf4] border-2 border-[#f0ece5] rounded-2xl p-5 text-base focus:outline-none focus:border-[#7a9e7e] focus:ring-4 focus:ring-[#7a9e7e]/10 resize-none h-28 transition-all placeholder:text-[#a3a89f]" style={{ fontSize: '16px' }}
            disabled={isSubmitting}
          />
          <div className={`text-right text-xs mt-1 transition-colors ${newPost.length > MAX_CHARS * 0.85 ? 'text-[#c4605a] font-bold' : 'text-[#a3a89f]'}`}>
            {newPost.length}/{MAX_CHARS}
          </div>

          {/* Trigger word alert */}
          <AnimatePresence>
            {alert && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {alert.type === 'crisis' && (
                  <div className="mt-3 bg-[#fce4ec] border-2 border-[#f48fb1] rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-[#c62828] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-bold text-[#c62828] mb-1">We noticed you may be in crisis</div>
                        <p className="text-sm text-[#2c3028] mb-3">You don't have to face this alone. Please reach out right now - trained support is available 24/7. For immediate help, message our team on WhatsApp.</p>
                        <div className="flex flex-wrap gap-2">
                          <a href="https://wa.me/2202010001" target="_blank" rel="noopener noreferrer"
                            className="bg-[#25D366] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 hover:bg-[#1da851] transition-all">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Message Us Now
                          </a>
                          <button type="button" onClick={() => setTab && setTab('directory')}
                            className="bg-[#c62828] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 hover:bg-[#b71c1c] transition-all">
                            <Phone size={14} /> Crisis Helplines
                          </button>
                          <button type="button" onClick={() => setTab && setTab('resources')}
                            className="bg-white border border-[#f48fb1] text-[#c62828] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 hover:bg-[#fce4ec] transition-all">
                            <Wind size={14} /> Breathing Exercise
                          </button>
                        </div>
                      </div>
                      <button type="button" onClick={() => setAlert(null)} className="text-[#6b7265] hover:text-[#2c3028]"><X size={16} /></button>
                    </div>
                  </div>
                )}
                {alert.type === 'help' && (
                  <div className="mt-3 bg-[#fff8e1] border-2 border-[#ffe082] rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-[#f57f17] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-bold text-[#f57f17] mb-1">It sounds like you need support</div>
                        <p className="text-sm text-[#2c3028] mb-3">Help is available. Would you like to find a helpline in your country or take a free mental health screening?</p>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => setTab && setTab('directory')}
                            className="bg-[#f57f17] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 hover:bg-[#e65100] transition-all">
                            <Phone size={14} /> Find a Helpline
                          </button>
                          <button type="button" onClick={() => setTab && setTab('screening')}
                            className="bg-white border border-[#ffe082] text-[#f57f17] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 hover:bg-[#fff8e1] transition-all">
                            Take Screening
                          </button>
                        </div>
                      </div>
                      <button type="button" onClick={() => setAlert(null)} className="text-[#6b7265] hover:text-[#2c3028]"><X size={16} /></button>
                    </div>
                  </div>
                )}
                {alert.type === 'support' && (
                  <div className="mt-3 bg-[#e8f5e9] border-2 border-[#a5d6a7] rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <Heart size={18} className="text-[#4a7c59] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-bold text-[#4a7c59] mb-1">We have resources that may help</div>
                        <p className="text-sm text-[#2c3028] mb-3">You're not alone in feeling this way. Explore our self-help tools or take a quick screening.</p>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => setTab && setTab('resources')}
                            className="bg-[#4a7c59] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 hover:bg-[#3a6b3e] transition-all">
                            <BookOpen size={14} /> Self-Help Tools
                          </button>
                          <button type="button" onClick={() => setTab && setTab('screening')}
                            className="bg-white border border-[#a5d6a7] text-[#4a7c59] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#e8f5e9] transition-all">
                            Take Screening
                          </button>
                        </div>
                      </div>
                      <button type="button" onClick={() => setAlert(null)} className="text-[#6b7265] hover:text-[#2c3028]"><X size={16} /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
            <span className="text-xs text-[#6b7265]">🔒 Your identity is never stored or displayed</span>
            <button type="submit" disabled={!newPost.trim() || isSubmitting}
              className="w-full sm:w-auto bg-[#4a7c59] hover:bg-[#3a6b3e] disabled:bg-[#d8d0c4] text-white px-7 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md">
              {isSubmitting
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><Send size={16} /></motion.div>
                : <><Send size={16} /> Post Anonymously</>}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Posts */}
      <div className="space-y-5">
        <AnimatePresence>
          {posts.map((post, index) => (
            <motion.div layout key={post.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-[2rem] border border-[#d8d0c4] p-7 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-full ${post.avatarBg} flex items-center justify-center text-xl shadow-inner`}>
                  {post.emoji}
                </div>
                <div>
                  <div className="font-bold text-[#2c3028]">Anonymous Member</div>
                  <div className="text-sm text-[#6b7265]">{post.time}</div>
                </div>
              </div>
              <p className="text-[#2c3028] text-base mb-6 leading-relaxed">{post.text}</p>
              <div className="flex gap-3 border-t border-[#f0ece5] pt-5">
                <button onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${post.liked ? 'bg-[#fce4ec] text-[#c62828] border border-[#f8bbd0]' : 'bg-[#fdfaf4] text-[#6b7265] hover:text-[#c62828] hover:bg-[#fce4ec] border border-transparent'}`}>
                  <Heart size={16} className={post.liked ? 'fill-[#c62828]' : ''} />
                  {post.likes} {post.likes === 1 ? 'support' : 'supports'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
