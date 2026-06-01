import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, X } from "lucide-react";
import { playClickSound } from "../../utils/sounds";

const RankingBoard = ({ currentScore, onClose }) => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ai_quiz_ranking") || "[]");
    // Ordenar por pontuação (maior primeiro), depois tempo (menor primeiro), depois data (mais recente)
    saved.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.timeSpent !== b.timeSpent) return (a.timeSpent || 999) - (b.timeSpent || 999);
      return new Date(b.date) - new Date(a.date);
    });
    setRanking(saved.slice(0, 10)); // Pegar top 10
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl w-full mx-auto glass-panel rounded-3xl overflow-hidden relative"
    >
      <button 
        onClick={() => {
          playClickSound();
          onClose();
        }}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors"
      >
        <X size={24} />
      </button>

      <div className="p-8 pb-0">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Ranking Global</h2>
        <p className="text-gray-400 text-center mb-8">Top 10 Mestres da IA</p>
      </div>

      <div className="px-8 pb-8">
        <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
          {ranking.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhum jogador registrado ainda.</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                <div className="col-span-2 text-center">Pos</div>
                <div className="col-span-4">Jogador</div>
                <div className="col-span-3">Turma</div>
                <div className="col-span-2 text-center">Tempo</div>
                <div className="col-span-1 text-right">Pts</div>
              </div>
              
              {ranking.map((player, index) => {
                let positionStyle = "text-gray-400";
                let Icon = null;
                
                if (index === 0) {
                  positionStyle = "text-yellow-400";
                  Icon = Trophy;
                } else if (index === 1) {
                  positionStyle = "text-gray-300";
                  Icon = Medal;
                } else if (index === 2) {
                  positionStyle = "text-orange-400";
                  Icon = Medal;
                }

                const isCurrentPlayer = player.isRecent; // Flag que usaremos ao salvar

                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className={`grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl transition-colors ${
                      isCurrentPlayer ? 'bg-primary/20 border border-primary/50' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`col-span-2 text-center font-bold text-lg flex justify-center items-center gap-1 ${positionStyle}`}>
                      {Icon && <Icon size={16} />}
                      {index + 1}º
                    </div>
                    <div className="col-span-4 font-medium text-white truncate">
                      {player.name}
                    </div>
                    <div className="col-span-3 text-sm text-gray-400 truncate">
                      {player.turma}
                    </div>
                    <div className="col-span-2 text-center text-sm text-gray-300">
                      {player.timeSpent ? `${player.timeSpent}s` : '-'}
                    </div>
                    <div className="col-span-1 text-right font-bold text-primary">
                      {player.score}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RankingBoard;
