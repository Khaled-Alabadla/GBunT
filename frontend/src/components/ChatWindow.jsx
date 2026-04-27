import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import LanguageToggle from "./LanguageToggle";
import coffeeMeme from "../images/Coffee meme.jpg";

export default function ChatWindow({
  messages,
  isLoading,
  streamingMessage,
  chatEndRef,
  messagesContainerRef,
  onSendMessage,
  t,
  language,
  onLanguageToggle,
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const isRTL = language === "ar";

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim(), language);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Focus input after first user interaction, not on mount (avoids auto-scroll)

  return (
    <div
      className="flex flex-col h-screen bg-gradient-to-br from-[#1b120b] via-[#24180f] to-[#1b120b] relative overflow-hidden"
      style={{ maxHeight: "100vh" }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="w-full bg-chat-card/90 backdrop-blur-md border-b border-accent/20 p-4"
      >
        <div className="w-full flex justify-between items-center px-4">
          <div
            className={`flex items-center gap-4 ${isRTL ? "order-2" : "order-1"}`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full"></div>
              <div className="relative text-5xl">☕</div>
            </div>
            <div>
              <h1
                className={`font-black pb-[5px] text-4xl tracking-widest drop-shadow-2xl`}
              >
                {isRTL ? (
                  <>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-accent-light to-accent">
                      جي{" "}
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500">
                      بُن{" "}
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-accent-light to-accent">
                      تي
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-accent-light to-accent">
                      G
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500">
                      Bun
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-accent-light to-accent">
                      T
                    </span>
                  </>
                )}
              </h1>
              <p
                className={`text-text/70 text-sm mt-1 font-medium tracking-wide ${isRTL ? "font-cairo" : "font-lato"}`}
              >
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className={isRTL ? "order-2" : "order-2"}>
            <LanguageToggle language={language} onToggle={onLanguageToggle} />
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            {/* Meme image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <img
                src={coffeeMeme}
                alt="Coffee meme"
                className="w-72 mx-auto rounded-2xl shadow-xl border-2 border-accent/20 hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className={`font-bold text-accent-light text-3xl mt-10 md:text-5xl mb-8 text-center leading-relaxed drop-shadow-lg ${isRTL ? "font-cairo" : "font-montserrat"}`}
            >
              {isRTL
                ? "متكلمنيش إلا عن القهوة بس يحب ☕"
                : "I only talk about coffee. Do you have a coffee-related question? ☕"}
            </motion.h2>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            isRTL={isRTL}
            language={language}
          />
        ))}

        {isLoading && !streamingMessage && <TypingIndicator isRTL={isRTL} />}

        {streamingMessage && (
          <MessageBubble
            message={{ role: "assistant", content: streamingMessage, language }}
            isRTL={isRTL}
            language={language}
          />
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="w-full bg-chat-card/80 backdrop-blur-md border-t border-accent/20 p-4"
      >
        <div
          className={`w-full flex gap-2 px-4 ${isRTL ? "flex-row" : "flex-row-reverse"}`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-accent to-accent-hover text-background rounded-xl font-bold hover:shadow-lg hover:shadow-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>{t.send}</span>
            <span className="text-lg">☕</span>
          </motion.button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.placeholder}
            className={`flex-1 bg-background/80 text-text placeholder-text/40 px-4 py-3 rounded-xl border border-accent/20 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all ${isRTL ? "rtl font-cairo" : "ltr font-lato"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      </motion.div>

      {/* Copyright Footer */}
      <div className="bg-background/50 backdrop-blur-sm border-t border-accent/10 py-3 text-center">
        <p className="text-text/50 text-xs font-medium">
          Made with <span className="text-red-400">❤️</span> and{" "}
          <span className="text-accent">☕</span> by{" "}
          <span className="text-accent-light font-semibold">
            Khaled Alabadla
          </span>
        </p>
      </div>
    </div>
  );
}
