import { motion } from "framer-motion";

export default function TypingIndicator({ isRTL }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 mb-4 ${isRTL ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`bg-chat-card text-text px-4 py-3 rounded-2xl border border-accent/20 ${isRTL ? "rounded-tr-sm" : "rounded-tl-sm"}`}
      >
        <div className="flex items-center gap-2" dir={isRTL ? "rtl" : "ltr"}>
          <span className="text-sm text-accent-light font-medium">
            {isRTL ? "" : ""}
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-accent rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
