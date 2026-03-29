"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Heart, AlertTriangle } from "lucide-react";
import { detectSafetyKeywords } from "@/lib/data";

const QUICK_REPLIES = [
  "I did my walk today!",
  "Not feeling it today",
  "I have a question",
];

const INITIAL_MESSAGE = {
  id: "initial",
  role: "assistant" as const,
  parts: [
    {
      type: "text" as const,
      text: "Good morning, Maria! I saw you walked 15 minutes on Thursday — that's your longest yet. How are you feeling today?",
    },
  ],
};

function getMessageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [safetyAlert, setSafetyAlert] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    initialMessages: [INITIAL_MESSAGE],
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;

    if (detectSafetyKeywords(msg)) {
      setSafetyAlert(true);
    }

    sendMessage({ text: msg });
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-12 pb-3 bg-background border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart size={18} className="text-primary" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-base font-bold text-navy">Compass</h1>
              <p className="text-xs text-accent flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                Your rehab companion
              </p>
            </div>
          </div>
          <a
            href="tel:5550123"
            className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 px-3 py-2 rounded-xl"
            aria-label="Call Dr. Patel"
          >
            <Phone size={13} />
            Dr. Patel
          </a>
        </div>
      </div>

      {/* Safety Alert Banner */}
      <AnimatePresence>
        {safetyAlert && (
          <motion.div
            className="flex-shrink-0 bg-danger text-danger-foreground px-4 py-3 flex items-start gap-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="alert"
          >
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">Stop all activity now</p>
              <p className="text-xs mt-0.5 leading-relaxed">
                Please sit down and call Dr. Patel at{" "}
                <a href="tel:5550123" className="underline font-semibold">
                  555-0123
                </a>{" "}
                immediately. If you cannot reach them, call{" "}
                <a href="tel:911" className="underline font-semibold">
                  911
                </a>
                .
              </p>
            </div>
            <button
              onClick={() => setSafetyAlert(false)}
              className="text-danger-foreground/70 hover:text-danger-foreground flex-shrink-0"
              aria-label="Dismiss alert"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
        {messages.map((message) => {
          const text = getMessageText(message.parts ?? []);
          if (!text) return null;
          const isCompass = message.role === "assistant";

          return (
            <motion.div
              key={message.id}
              className={`flex items-end gap-2 ${isCompass ? "justify-start" : "justify-end"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Compass avatar */}
              {isCompass && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mb-1">
                  <Heart size={13} className="text-primary" fill="currentColor" />
                </div>
              )}

              <div
                className={`max-w-[78%] px-4 py-3 rounded-2xl text-base leading-relaxed ${
                  isCompass
                    ? "bg-card text-foreground rounded-bl-sm shadow-card"
                    : "bg-primary text-primary-foreground rounded-br-sm"
                }`}
              >
                {text}
              </div>
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {isStreaming && (
          <motion.div
            className="flex items-end gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Heart size={13} className="text-primary" fill="currentColor" />
            </div>
            <div className="bg-card rounded-2xl rounded-bl-sm px-4 py-3 shadow-card">
              <div className="flex gap-1 items-center h-4">
                {[0, 0.18, 0.36].map((delay) => (
                  <motion.span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-primary/50"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      <div className="flex-shrink-0 px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            onClick={() => handleSend(reply)}
            disabled={isStreaming}
            className="flex-shrink-0 text-xs font-medium text-primary border border-primary/30 bg-primary/5 px-3.5 py-2 rounded-full active:scale-95 transition-transform disabled:opacity-40"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-6 pt-1 bg-background border-t border-border">
        <div className="flex items-end gap-2 bg-card rounded-2xl border border-border shadow-card px-4 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Compass..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed py-1 min-h-[24px] max-h-24"
            style={{ fontSize: "16px" }}
            aria-label="Message input"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 active:scale-90 transition-transform mb-1"
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Compass is an AI companion. For medical advice, contact Dr. Patel.
        </p>
      </div>
    </div>
  );
}
