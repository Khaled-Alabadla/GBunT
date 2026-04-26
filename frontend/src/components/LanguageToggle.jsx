import { motion } from 'framer-motion';

export default function LanguageToggle({ language, onToggle }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="px-4 py-2 bg-accent text-background rounded-full text-sm font-bold hover:bg-accent-hover transition-colors"
    >
      {language === 'ar' ? 'EN' : 'AR'}
    </motion.button>
  );
}
