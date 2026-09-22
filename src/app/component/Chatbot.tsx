"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Message = {
  text: string;
  sender: "user" | "bot";
};

type Suggestions = string[];

const STARTER_QUESTIONS: Suggestions = [
  "What t-shirts do you have?",
  "Show me discounts",
  "How much are the jeans?",
];

const NAME_RE = new RegExp(
  "gradient graphic|polo with tipping|black striped|skinny fit jeans|checkered shirt|sleeve striped|vertical striped|courage graphic|loose fit bermuda",
  "i"
);

/** Greeting/small-talk filter — keeps the bot on store topics */
function isSmallTalk(q: string): boolean {
  const storeWords =
    /price|cost|how much|product|t-?shirt|shirt|jeans|shorts|pant|discount|sale|offer|coupon|stock|avail|size|fit|color|colour|shipping|delivery|return|refund|order|checkout|pay|cart|wishlist|polo|denim|clothes|clothing|wear|shop|store|catalog|find|show|recommend|suggest|popular|new arrivals/i;
  const greet = /^(hi|hello|hey|yo|sup|good (morning|afternoon|evening))[\s!.,]*$/i;

  if (greet.test(q.trim())) return false; // greeting gets a greeting back
  if (storeWords.test(q) || NAME_RE.test(q)) return false;
  // anything that mentions a product-ish word passes; otherwise small talk
  return q.split(/\s+/).length <= 6 && !storeWords.test(q);
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm the SHOP.CO assistant 👋 Ask me about products, prices, discounts or sizing.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions>(STARTER_QUESTIONS);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, isOpen]);

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || thinking) return;

    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setInput("");
    setThinking(true);

    try {
      if (isSmallTalk(text)) {
        await new Promise((r) => setTimeout(r, 500));
        setMessages((prev) => [
          ...prev,
          {
            text: "I'm the SHOP.CO shopping assistant — I can only help with our store. Try asking about products, prices, discounts, sizes or shipping!",
            sender: "bot",
          },
        ]);
      } else if (/^(hi|hello|hey|yo|sup)/i.test(text.trim()) && text.trim().length < 20) {
        await new Promise((r) => setTimeout(r, 400));
        setMessages((prev) => [
          ...prev,
          {
            text: "Hello! 👋 Looking for something specific? I can show you t-shirts, shirts, jeans or shorts — just ask.",
            sender: "bot",
          },
        ]);
      } else {
        const res = await fetch(`/api/chat?q=${encodeURIComponent(text)}`);
        const data = await res.json();
        setMessages((prev) => [...prev, { text: data.answer, sender: "bot" }]);
        setSuggestions(
          data.products?.length > 0
            ? STARTER_QUESTIONS.filter((s) => s !== "Show me discounts").slice(0, 3)
            : STARTER_QUESTIONS
        );
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong — please try again.", sender: "bot" },
      ]);
    } finally {
      setThinking(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open shopping assistant"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[380px] max-h-[70vh] sm:max-h-[560px] flex flex-col rounded-2xl bg-white shadow-2xl border border-black/10 overflow-hidden animate-[fade-up_0.25s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between bg-black text-white px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              <path d="M8 12h.01M12 12h.01M16 12h.01" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">SHOP.CO Assistant</p>
            <p className="text-[11px] text-white/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Online — answers from our catalog
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
          className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F9F9F9] min-h-[200px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${
                msg.sender === "user"
                  ? "bg-black text-white rounded-br-md"
                  : "bg-white text-black border border-black/5 rounded-bl-md shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-black/5 rounded-2xl rounded-bl-md shadow-sm px-4 py-3 flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-black/30 animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-black/30 animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-black/30 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 bg-[#F9F9F9] border-t border-black/5 flex gap-2 overflow-x-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-black/10 bg-white hover:border-black/40 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 px-3 py-3 bg-white border-t border-black/5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about products, prices..."
          className="flex-1 h-11 px-4 rounded-full bg-[#F0F0F0] text-sm placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-black/20"
        />
        <button
          type="submit"
          disabled={!input.trim() || thinking}
          aria-label="Send message"
          className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-40 hover:bg-black/80 transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </form>
    </div>
  );
}
