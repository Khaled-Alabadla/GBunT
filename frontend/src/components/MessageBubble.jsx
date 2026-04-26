import { motion } from "framer-motion";

export default function MessageBubble({ message, isRTL, language }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isRTL ? (isUser ? "justify-end" : "justify-start") : (isUser ? "justify-start" : "justify-end")} mb-4`}
    >
      <div
        className={`max-w-[85%] px-5 py-4 rounded-2xl shadow-lg ${
          isUser
            ? "bg-accent text-cream font-semibold rounded-tr-sm"
            : "bg-chat-card text-text rounded-tl-sm border border-accent/20"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">☕</span>
            <span className="text-xs font-medium text-accent">{language === 'ar' ? 'جي بُن تي' : 'GBunT'}</span>
          </div>
        )}
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${!isUser && isRTL ? 'text-right' : ''}`} dir={!isUser && isRTL ? 'rtl' : undefined}>
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}
