import { motion } from 'framer-motion';

export default function SuggestedQuestions({ questions, onSelect, isRTL }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`flex flex-wrap gap-3 mb-6 justify-center ${isRTL ? 'rtl' : 'ltr'}`}
    >
      {questions.map((question, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(question)}
          className="px-5 py-3 bg-chat-card/60 text-text rounded-xl text-sm hover:bg-accent hover:text-background transition-all duration-300 border border-accent/30 shadow-md hover:shadow-lg"
        >
          {question}
        </motion.button>
      ))}
    </motion.div>
  );
}
