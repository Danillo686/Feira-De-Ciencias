import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Alternar tema"
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        shadow-lg border
        transition-all duration-300
        bg-slate-900 border-slate-700 text-yellow-300
        dark:bg-white dark:border-slate-300 dark:text-slate-800
        hover:shadow-xl
      "
    >
      <motion.div
        key={isDark ? "sun" : "moon"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? <Sun size={22} /> : <Moon size={22} />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
