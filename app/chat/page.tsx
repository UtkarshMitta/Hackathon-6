"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  AlertTriangle,
  Heart,
  Phone,
} from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { MARIA, SAFETY_KEYWORDS } from "@/lib/data";

function getMessageText(parts: { type: string; text?: string }[]): string {
  if (!parts || !Array.isArray(parts)) return "";
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

const QUICK_REPLIES = [
  "I did my walk!",
  "Not feeling it today",
  "I have a question",
  "How am I doing?",
];

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [safetyAlert, setSafetyAlert] = useState(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Good morning, ${MARIA.name}! It's Compass. You've been doing amazing this week — 6 days in a row! How are you feeling today?`,
          },
        ],
        metadata: {},
      },
    ],
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function checkSafety(text: string): boolean {
    const lower = text.toLowerCase();
    return SAFETY_KEYWORDS.some((kw) => lower.includes(kw));
  }

  function handleSend(text?: string) {
    const content = (text ?? inputValue).trim();
    if (!content) return;

    // Check safety keywords in user input
    if (checkSafety(content)) {
      setSafetyAlert(true);
    }

    sendMessage({ text: content });
    setInputValue("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main
      className="flex flex-col h-screen max-w-lg mx-auto"
      style={{ background: "var(--color-background)" }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 pt-12 pb-4 shrink-0"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/"
          className="p-2 rounded-xl transition-colors hover:opacity-70"
          aria-label="Go back to home"
        >
          <ArrowLeft size={20} style={{ color: "var(--color-foreground)" }} />
        </Link>

        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--color-primary)22" }}
          >
            <Heart size={18} style={{ color: "var(--color-primary)" }} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight" style={{ color: "var(--color-foreground)" }}>
              Compass
            </h1>
            <p className="text-xs" style={{ color: "var(--color-success)" }}>
              {isLoading ? "Typing..." : "Your care companion"}
            </p>
          </div>
        </div>
      </header>

      {/* Safety alert banner */}
      <AnimatePresence>
        {safetyAlert && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden"
          >
            <div
              className="flex items-start gap-3 px-4 py-3"
              style={{ background: "var(--color-danger)", color: "white" }}
              role="alert"
              aria-live="assertive"
            >
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold leading-tight">Important — Stop Activity Now</p>
                <p className="text-sm mt-0.5 leading-snug">
                  If you are experiencing symptoms, sit down and call your care team.
                </p>
                <a
                  href={`tel:${MARIA.careTeam.phone}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold underline"
                >
                  <Phone size={14} />
                  Dr. {MARIA.careTeam.name}: {MARIA.careTeam.phone}
                </a>
              </div>
              <button
                onClick={() => setSafetyAlert(false)}
                className="text-white opacity-80 hover:opacity-100 text-lg leading-none"
                aria-label="Dismiss alert"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const text = getMessageText(message.parts as { type: string; text?: string }[]);
            const isAssistant = message.role === "assistant";

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-2 ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                {isAssistant && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto"
                    style={{ background: "var(--color-primary)22" }}
                    aria-hidden="true"
                  >
                    <Heart
                      size={14}
                      style={{ color: "var(--color-primary)" }}
                      fill="currentColor"
                    />
                  </div>
                )}

                <div
                  className="max-w-[80%] rounded-2xl px-4 py-3 text-base leading-relaxed"
                  style={{
                    background: isAssistant
                      ? "var(--color-surface)"
                      : "var(--color-primary)",
                    color: isAssistant
                      ? "var(--color-foreground)"
                      : "white",
                    borderBottomLeftRadius: isAssistant ? "4px" : undefined,
                    borderBottomRightRadius: !isAssistant ? "4px" : undefined,
                    border: isAssistant ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  {text || (isAssistant && isLoading ? (
                    <span className="opacity-60">...</span>
                  ) : null)}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 justify-start"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "var(--color-primary)22" }}
            >
              <Heart size={14} style={{ color: "var(--color-primary)" }} fill="currentColor" />
            </div>
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-1"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderBottomLeftRadius: "4px",
              }}
            >
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: "var(--color-primary)" }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, delay, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div
        className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            onClick={() => handleSend(reply)}
            disabled={isLoading}
            className="shrink-0 px-3 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80 active:scale-95 disabled:opacity-50"
            style={{
              background: "var(--color-surface)",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-foreground)",
              whiteSpace: "nowrap",
            }}
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div
        className="px-4 pb-24 pt-2 shrink-0"
        style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}
      >
        <div
          className="flex items-center gap-2 rounded-2xl px-4 py-2"
          style={{
            background: "var(--color-background)",
            border: "1.5px solid var(--color-border)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Compass..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-base outline-none placeholder:opacity-50"
            style={{
              color: "var(--color-foreground)",
              fontSize: "16px",
              minHeight: "40px",
            }}
            aria-label="Type your message"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-opacity disabled:opacity-40"
            style={{
              background: "var(--color-primary)",
              color: "white",
            }}
            aria-label="Send message"
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
