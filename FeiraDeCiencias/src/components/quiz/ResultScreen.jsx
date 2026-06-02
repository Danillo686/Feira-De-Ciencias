import { useEffect } from "react";
import { motion } from "framer-motion";
import { playSuccessSound, playClickSound } from "../../utils/sounds";
import { Trophy, Medal, Star, RotateCcw } from "lucide-react";

const ResultScreen = ({ score, total, timeSpent, onShowRanking, onBackToMenu }) => {
  useEffect(() => {
    playSuccessSound();
  }, []);

  let title = "";
  let icon = null;
  let colorClass = "";
  let bgClass = "";

  if (score <= 4) {
    title = "Iniciante da IA";
    icon = <Star size={64} className="text-slate-400" />;
    colorClass = "from-slate-600 to-slate-400";
    bgClass = "from-slate-500/10 to-slate-400/5";
  } else if (score <= 7) {
    title = "Explorador da IA";
    icon = <Medal size={64} className="text-blue-400" />;
    colorClass = "from-blue-600 to-blue-400";
    bgClass = "from-blue-500/10 to-blue-400/5";
  } else {
    title = "Mestre da IA";
    icon = <Trophy size={64} className="text-yellow-400" />;
    colorClass = "from-yellow-500 to-amber-400";
    bgClass = "from-yellow-500/10 to-amber-400/5";
  }

  const percentage = Math.round((score / total) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-md w-full mx-auto text-center relative overflow-hidden"
    >
      <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden`}>
        
        {/* Header with gradient */}
        <div className={`relative bg-gradient-to-br ${bgClass} px-8 pt-10 pb-8`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-5 pointer-events-none`}></div>
          
          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-4"
          >
            {icon}
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className={`inline-block px-5 py-2 rounded-full border mb-4
              bg-white/60 dark:bg-slate-900/60
              border-slate-200 dark:border-slate-600`}
          >
            <span className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorClass}`}>
              {title}
            </span>
          </motion.div>

          <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-1">
            {score}<span className="text-2xl text-slate-400 dark:text-slate-500"> / {total}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {percentage}% de acertos
          </p>
          {timeSpent && (
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              ⏱ {timeSpent} segundos
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="p-6 space-y-3">
          <button 
            onClick={() => {
              playClickSound();
              onShowRanking();
            }}
            className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-700 dark:hover:bg-blue-700 text-white font-bold text-base py-4 rounded-xl transition-all shadow-sm"
          >
            🏆 Ver Ranking Global
          </button>
          {onBackToMenu && (
            <button
              onClick={() => { playClickSound(); onBackToMenu(); }}
              className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={15} />
              Voltar ao Menu
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultScreen;
