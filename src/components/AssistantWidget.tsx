// src/components/AssistantWidget.tsx
import { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GAMES } from '../data/constants';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { user, playerStats, quests, gameResults } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Hello ${user?.name || 'there'}! I'm your MindCare Assistant. How can I help you today? You can ask for game recommendations, check your stats, or get help.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickQuestions = [
    "What should I play?",
    "How much XP do I have?",
    "What's my streak?",
    "Which game is easiest?",
    "What did I complete today?",
  ];

  const generateLocalResponse = (q: string): string => {
    const query = q.toLowerCase();
    const completedQuests = quests.filter(quest => quest.completed);
    const uncompletedQuests = quests.filter(quest => !quest.completed);

    if (query.includes('play') || query.includes('recommend') || query.includes('next')) {
      if (uncompletedQuests.length > 0) {
        return `You have completed ${completedQuests.length} of today's ${quests.length} quest challenges! Try playing "${uncompletedQuests[0].title}" next to earn +${uncompletedQuests[0].xpReward} XP.`;
      }
      return `Awesome job completing all daily quests! How about practicing "Memory Match" or "Pattern Pulse" for extra brain training?`;
    }

    if (query.includes('xp') || query.includes('level') || query.includes('score')) {
      return `You currently have ${playerStats.xp.toLocaleString()} XP at Level ${playerStats.level} (${playerStats.level >= 10 ? 'Grand Master' : 'Challenger'})! You need ${(playerStats.xpToNextLevel - playerStats.xp).toLocaleString()} more XP to reach Level ${playerStats.level + 1}.`;
    }

    if (query.includes('streak') || query.includes('flame') || query.includes('days')) {
      return `You're currently on a 🔥 ${playerStats.streak}-day streak! Keep completing daily challenges to maintain and grow your streak.`;
    }

    if (query.includes('easy') || query.includes('easiest') || query.includes('beginner')) {
      return `"Memory Match" and "Word Recall" on Easy difficulty are great starting points. They give generous time and clear visual cues.`;
    }

    if (query.includes('complete') || query.includes('today') || query.includes('progress')) {
      return `Today you have completed ${completedQuests.length} out of ${quests.length} quests, and played ${playerStats.totalGamesPlayed} games overall with ${playerStats.achievements.length} achievements unlocked!`;
    }

    if (query.includes('help') || query.includes('how')) {
      return `MindCare features 6 brain training games: Memory Match (card matching), Sequence Recall (symbol patterns), Word Recall (vocabulary memory), Pattern Pulse (logic series), Number Echo (number sequences), and Odd One Out (visual inspection). Pick one from the Games library to start!`;
    }

    return `I can help you track your progress, pick games, or review your quests. Try asking "What should I play?" or "How much XP do I have?"`;
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const reply = generateLocalResponse(text);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-40">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-3.5 rounded-2xl bg-gradient-to-br from-primary to-secondary text-background shadow-glow-cyan hover:scale-105 transition-all flex items-center gap-2 font-bold"
          aria-label="Open MindCare Assistant"
        >
          <Bot className="w-6 h-6 text-background" />
          <span className="hidden sm:inline text-xs uppercase tracking-wider text-background font-extrabold pr-1">
            MindCare Assistant
          </span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background animate-pulse" />
        </button>
      )}

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] glass-card flex flex-col shadow-2xl border-primary/40 animate-scale-in">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface-elevated rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  MindCare Assistant <Sparkles className="w-3.5 h-3.5 text-gold" />
                </h3>
                <p className="text-[10px] text-success">Online • Local AI Helper</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-background font-medium rounded-br-none'
                      : 'bg-surface-elevated text-text border border-border rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-muted mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 border-t border-border overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickQuestions.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[10px] whitespace-nowrap bg-surface-elevated hover:bg-border text-muted-light px-2.5 py-1 rounded-full border border-border transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border bg-surface-elevated rounded-b-2xl flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about games or stats..."
              className="flex-1 bg-surface border border-border text-text rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-primary px-3 py-2 text-xs rounded-xl disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
