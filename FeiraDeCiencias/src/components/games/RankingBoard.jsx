import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, X, ChevronDown } from "lucide-react";
import { playClickSound } from "../../utils/sounds";
import { listenRanking } from "../../firebase";

const GAMES_LIST = [
  { id: 'quiz', label: 'Quiz da IA', emoji: '🧠' },
  { id: 'memory', label: 'Jogo da Memória', emoji: '🎴' },
  { id: 'scenarios', label: 'Impacto da IA', emoji: '🔍' },
  { id: 'hangman', label: 'Jogo da Forca', emoji: '🔤' },
  { id: 'scramble', label: 'Palavras Embaralhadas', emoji: '🔄' },
  { id: 'wordsearch', label: 'Caça-Palavras', emoji: '🧩' },
  { id: 'turing', label: 'Teste de Turing', emoji: '🤖' },
  { id: 'intruso', label: 'O Intruso', emoji: '❌' },
  { id: 'association', label: 'Conectar Pares', emoji: '🔗' },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Fácil', emoji: '🟢', color: 'text-emerald-500' },
  { id: 'medium', label: 'Médio', emoji: '🟡', color: 'text-amber-500' },
  { id: 'hard', label: 'Difícil', emoji: '🔴', color: 'text-rose-500' },
];

const RankingBoard = ({ onClose }) => {
  const [activeGame, setActiveGame] = useState('quiz');
  const [activeDifficulty, setActiveDifficulty] = useState('easy');
  const [rankingLimit, setRankingLimit] = useState(10); // 10, 100, 500
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeTab = `${activeGame}_${activeDifficulty}`;

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

  const displayedRanking = ranking.slice(0, rankingLimit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl w-full mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative font-['Inter']"
    >
      <button
        onClick={() => { playClickSound(); onClose(); }}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-750 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
      >
        <X size={24} />
      </button>

      <div className="p-8 pb-4 text-center">
        <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-2">🏆 Ranking Global</h2>
        <p className="text-slate-550 dark:text-slate-400 mb-6 text-sm font-serif italic">Acompanhe as melhores pontuações em tempo real.</p>

        {/* Filters Grid */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Game Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left pl-1">Selecione o Jogo</span>
            <div className="flex flex-wrap gap-2 justify-start md:justify-center">
              {GAMES_LIST.map(game => (
                <button
                  key={game.id}
                  onClick={() => { playClickSound(); setActiveGame(game.id); }}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border ${
                    activeGame === game.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-102'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-350 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span>{game.emoji}</span>
                  {game.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty and Limit controls row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
            {/* Difficulty selection */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Dificuldade:</span>
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                {DIFFICULTIES.map(diff => (
                  <button
                    key={diff.id}
                    onClick={() => { playClickSound(); setActiveDifficulty(diff.id); }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeDifficulty === diff.id
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {diff.emoji} {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ranking Limit Selection */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Visualizar:</span>
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                {[10, 100, 500].map(limit => (
                  <button
                    key={limit}
                    onClick={() => { playClickSound(); setRankingLimit(limit); }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      rankingLimit === limit
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Top {limit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-250/60 dark:border-slate-700/60 min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + "_" + rankingLimit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400 font-bold">Carregando ranking...</p>
                  </div>
                </div>
              ) : ranking.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-center text-slate-450 dark:text-slate-500 font-medium">Nenhum jogador registrado nesta modalidade ainda.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <div className="col-span-2 text-center">Pos</div>
                    <div className="col-span-4">Jogador</div>
                    <div className="col-span-3">Turma</div>
                    <div className="col-span-2 text-center">Tempo</div>
                    <div className="col-span-1 text-right">Pts</div>
                  </div>

                  {displayedRanking.map((player, index) => {
                    let positionStyle = "text-slate-400";
                    let Icon = null;
                    let rowBg = "bg-white dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50";

                    if (index === 0) {
                      positionStyle = "text-amber-500";
                      Icon = Trophy;
                      rowBg = "bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 shadow-sm shadow-amber-500/5";
                    } else if (index === 1) {
                      positionStyle = "text-slate-450";
                      Icon = Medal;
                      rowBg = "bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50";
                    } else if (index === 2) {
                      positionStyle = "text-orange-400";
                      Icon = Medal;
                      rowBg = "bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/50";
                    }

                    return (
                      <motion.div
                        key={player._key || player.playerId || index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(index * 0.03, 0.4) }}
                        className={`grid grid-cols-12 gap-4 items-center px-4 py-3.5 rounded-xl transition-all hover:scale-[1.005] ${rowBg}`}
                      >
                        <div className={`col-span-2 text-center font-bold text-base flex justify-center items-center gap-1 ${positionStyle}`}>
                          {Icon && <Icon size={16} />}
                          {index + 1}º
                        </div>
                        <div className="col-span-4 font-bold text-slate-800 dark:text-slate-200 truncate">
                          {player.name}
                        </div>
                        <div className="col-span-3 text-sm font-semibold text-slate-500 dark:text-slate-450 truncate">
                          {player.turma}
                        </div>
                        <div className="col-span-2 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
                          {player.timeSpent ? `${player.timeSpent}s` : '-'}
                        </div>
                        <div className="col-span-1 text-right font-black text-slate-900 dark:text-white">
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
