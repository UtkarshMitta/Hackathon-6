"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Activity, AlertTriangle } from "lucide-react";

type Message = {
  id: number;
  role: "coach" | "user";
  text: string;
  timestamp: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "coach",
    text: "Hi Maria! I noticed you didn't log a session yesterday. That's completely okay — recovery isn't always a straight line. How are you feeling today?",
    timestamp: "9:02 AM",
  },
  {
    id: 2,
    role: "user",
    text: "I was just really tired and a little anxious. I didn't feel like I could push myself.",
    timestamp: "9:08 AM",
  },
  {
    id: 3,
    role: "coach",
    text: "That makes total sense. Anxiety after a cardiac event is very common and completely valid. Listening to your body is actually the right call. Even a gentle 10-minute walk counts — it's not about intensity, it's about consistency and feeling safe. Would a shorter session today feel manageable?",
    timestamp: "9:08 AM",
  },
];

const quickReplies = [
  "I feel good today",
  "Still tired",
  "Chest feels tight",
  "I need encouragement",
];

const coachResponses: Record<string, string> = {
  "I feel good today":
    "That's wonderful to hear! Let's build on that energy. Your plan today is a 20-minute walk at a comfortable pace — the talk test is your guide. If you can chat but not sing, you're in the right zone. Ready to log it when you're done!",
  "Still tired":
    "Rest is recovery too. Today, try just a 10-minute gentle walk around the block — no pressure. Your heart is healing, and every small step genuinely counts. If tiredness persists more than a few days, let's flag it for your care team.",
  "Chest feels tight":
    "I'm glad you told me. Please stop any activity right now and sit or lie down. If the tightness is new, unusual, or doesn't ease in a few minutes — or if you feel short of breath, nausea, or arm pain — call 911 immediately. This is not an overreaction. Your safety comes first. Has the feeling passed?",
  "I need encouragement":
    "Maria, you made it through a heart attack and you're still here, still trying. That takes real courage. You don't have to be perfect — you just have to keep showing up. Your care team believes in you, and so do I. What's one small thing you can do for yourself right now?",
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function now() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text, timestamp: now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    const responseText =
      coachResponses[text] ||
      "Thank you for sharing that with me. Your care team has been notified. Remember: I'm here to support you, not replace your doctor. Would you like me to help you think through your next step?";

    setTimeout(() => {
      setIsTyping(false);
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, role: "coach", text: responseText, timestamp: now() },
      ]);
    }, 1400);
  }

  const isSafetyMessage = (text: string) => text.toLowerCase().includes("chest");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-card border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <Activity size={20} className="text-accent-foreground" />
        </div>
        <div>
          <p className="text-foreground font-semibold text-base font-sans">AI Coach</p>
          <p className="text-muted-foreground text-xs font-sans">Always here — not a doctor</p>
        </div>
      </div>

      {/* Safety banner */}
      <div className="mx-4 mt-3 bg-warning/10 border border-warning/30 rounded-xl px-3 py-2.5 flex gap-2 items-start">
        <AlertTriangle size={14} className="text-warning flex-shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/70 font-sans leading-relaxed">
          If you have chest pain, dizziness, or severe breathlessness — stop activity and call <strong>911</strong> immediately.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : isSafetyMessage(msg.text)
                  ? "bg-warning/10 border border-warning/30 text-foreground rounded-bl-sm"
                  : "bg-card border border-border text-foreground rounded-bl-sm"
              }`}
            >
              <p className="text-sm font-sans leading-relaxed">{msg.text}</p>
              <p
                className={`text-xs mt-1.5 font-sans ${
                  msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {quickReplies.map((r) => (
          <button
            key={r}
            onClick={() => sendMessage(r)}
            className="flex-shrink-0 border border-border rounded-full px-3 py-1.5 text-xs font-sans text-foreground bg-card whitespace-nowrap"
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-8 pt-2 flex gap-2 border-t border-border bg-background">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Type a message..."
          className="flex-1 bg-card border border-border rounded-full px-4 py-2.5 text-sm font-sans text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40"
        >
          <Send size={16} className="text-primary-foreground" />
        </button>
      </div>
    </div>
  );
}
