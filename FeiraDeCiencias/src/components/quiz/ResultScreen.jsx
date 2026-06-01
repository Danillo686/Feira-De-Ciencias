import { useEffect } from "react";
import { motion } from "framer-motion";
import { playSuccessSound, playClickSound } from "../../utils/sounds";
import { Trophy, Medal, Star } from "lucide-react";

const ResultScreen = ({ score, total, timeSpent, onShowRanking }) => {
  useEffect(() => {
    playSuccessSound();
  }, []);

  let title = "";
  let icon = null;
  let colorClass = "";

  if (score <= 4) {
    title = "Iniciante da IA";
    icon = <Star size={64} className="text-gray-400" />;
    colorClass = "from-gray-600 to-gray-400";
  } else if (score <= 7) {
    title = "Explorador da IA";
    icon = <Medal size={64} className="text-blue-400" />;
    colorClass = "from-blue-600 to-blue-400";
  } else {
    title = "Mestre da IA";
    icon = <Trophy size={64} className="text-yellow-400" />;
    colorClass = "from-yellow-600 to-yellow-400";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full mx-auto text-center glass-panel p-8 rounded-3xl relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-10 pointer-events-none`}></div>
      
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="flex justify-center mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
      >
        {icon}
      </motion.div>

      <h2 className="text-4xl font-bold text-white mb-2">
        {score} / {total}
      </h2>
      <p className="text-gray-400 mb-2">Acertos</p>
      
      {timeSpent && (
        <p className="text-sm text-gray-500 mb-6">Tempo: {timeSpent} segundos</p>
      )}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="inline-block px-6 py-2 rounded-full bg-white/10 border border-white/20 mb-8"
      >
        <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorClass}`}>
          {title}
        </span>
      </motion.div>

      <button 
        onClick={() => {
          playClickSound();
          onShowRanking();
        }}
        className="w-full bg-white hover:bg-gray-200 text-black font-bold text-lg py-4 rounded-xl transition-all"
      >
        Ver Ranking Global
      </button>
    </motion.div>
  );
};

export default ResultScreen;
