import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, X } from "lucide-react";
import { playClickSound } from "../../utils/sounds";
import { listenRanking } from "../../firebase";

const GAMES = [
  { id: 'quiz_easy', label: '🟢 Quiz Fácil' },
  { id: 'quiz_medium', label: '🟡 Quiz Médio' },
  { id: 'quiz_hard', label: '🔴 Quiz Difícil' },
  { id: 'memory', label: '🎴 Memória' },
  { id: 'scenarios', label: '🔍 Impacto da IA' },
];

const RankingBoard = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('quiz_hard');
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = listenRanking(activeTab, (data) => {
      setRanking(data);
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl w-full mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden relative"
    >
      <button
        onClick={() => { playClickSound(); onClose(); }}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors z-10"
      >
        <X size={24} />
      </button>

      <div className="p-8 pb-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">🏆 Ranking Global</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm">Top 15 Melhores Jogadores — atualizado em tempo real</p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => { playClickSound(); setActiveTab(game.id); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors text-xs ${
                activeTab === game.id
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {game.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Carregando ranking...</p>
                  </div>
                </div>
              ) : ranking.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                  <p className="text-center text-slate-500 dark:text-slate-400">Nenhum jogador registrado nesta modalidade ainda.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <div className="col-span-2 text-center">Pos</div>
                    <div className="col-span-4">Jogador</div>
                    <div className="col-span-3">Turma</div>
                    <div className="col-span-2 text-center">Tempo</div>
                    <div className="col-span-1 text-right">Pts</div>
                  </div>

                  {ranking.map((player, index) => {
                    let positionStyle = "text-slate-400";
                    let Icon = null;
                    let rowBg = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700";

                    if (index === 0) {
                      positionStyle = "text-amber-500";
                      Icon = Trophy;
                      rowBg = "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700";
                    } else if (index === 1) {
                      positionStyle = "text-slate-400";
                      Icon = Medal;
                      rowBg = "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600";
                    } else if (index === 2) {
                      positionStyle = "text-orange-400";
                      Icon = Medal;
                      rowBg = "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700";
                    }

                    return (
                      <motion.div
                        key={player._key || player.playerId || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className={`grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg transition-colors ${rowBg}`}
                      >
                        <div className={`col-span-2 text-center font-bold text-lg flex justify-center items-center gap-1 ${positionStyle}`}>
                          {Icon && <Icon size={18} />}
                          {index + 1}º
                        </div>
                        <div className="col-span-4 font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {player.name}
                        </div>
                        <div className="col-span-3 text-sm text-slate-500 dark:text-slate-400 truncate">
                          {player.turma}
                        </div>
                        <div className="col-span-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                          {player.timeSpent ? `${player.timeSpent}s` : '-'}
                        </div>
                        <div className="col-span-1 text-right font-bold text-slate-900 dark:text-white">
                          {player.score}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default RankingBoard;
