import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginScreen from "../quiz/LoginScreen";
import Quiz from "../quiz/Quiz";
import DifficultySelect from "../quiz/DifficultySelect";
import ResultScreen from "../quiz/ResultScreen";
import RankingBoard from "./RankingBoard";
import AdminPanel from "./AdminPanel";
import MemoryGame from "./MemoryGame";
import ScenarioGame from "./ScenarioGame";
import { playClickSound } from "../../utils/sounds";
import { saveScore } from "../../firebase";

const GamesManager = () => {
  // states: 'login', 'menu', 'difficulty', 'playing_quiz', 'playing_memory', 'playing_scenarios', 'result', 'ranking'
  const [gameState, setGameState] = useState("login");
  const [userData, setUserData] = useState(null);
  const [resultData, setResultData] = useState({ score: 0, timeSpent: 0, maxScore: 0 });
  const [currentGame, setCurrentGame] = useState(null);
  const [difficulty, setDifficulty] = useState("hard");
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = (data) => {
    setUserData(data);
    setGameState("menu");
  };

  const selectGame = (gameId) => {
    playClickSound();
    setCurrentGame(gameId);
    if (gameId === 'quiz') setGameState('difficulty');
    if (gameId === 'memory') setGameState('playing_memory');
    if (gameId === 'scenarios') setGameState('playing_scenarios');
  };

  const handleSelectDifficulty = (diff) => {
    setDifficulty(diff);
    setGameState('playing_quiz');
  };

  const handleComplete = async ({ score, timeSpent, maxScore }) => {
    setResultData({ score, timeSpent, maxScore });

    // Determina a chave do ranking
    let gameKey;
    if (currentGame === 'quiz') {
      gameKey = `quiz_${difficulty}`;
    } else {
      gameKey = currentGame; // 'memory' ou 'scenarios'
    }

    await saveScore(gameKey, {
      name: userData.name,
      turma: userData.turma,
      score,
      timeSpent,
    });

    setGameState("result");
  };

  return (
    <section id="games-section" className="py-24 px-6 relative z-10 min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">

      <div className="w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {showAdmin ? (
            <AdminPanel key="admin" onClose={() => setShowAdmin(false)} />
          ) : gameState === "login" && (
            <LoginScreen key="login" onStart={handleLogin} />
          )}

          {gameState === "menu" && !showAdmin && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bem-vindo, {userData?.name}!</h2>
                <p className="text-slate-600 dark:text-slate-400">Escolha um dos jogos abaixo para testar seus conhecimentos e concorrer no Top Global.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => selectGame('quiz')}
                  className="p-6 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-slate-50 dark:bg-slate-900 text-center group"
                >
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Quiz da IA</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">10 perguntas sobre conceitos de IA. Escolha a dificuldade!</p>
                  <div className="flex justify-center gap-2 mb-4">
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">🟢 Fácil</span>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">🟡 Médio</span>
                    <span className="text-xs bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full font-semibold">🔴 Difícil</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:underline">Jogar Agora →</span>
                </div>

                <div
                  onClick={() => selectGame('memory')}
                  className="p-6 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-slate-50 dark:bg-slate-900 text-center group"
                >
                  <div className="text-4xl mb-4">🎴</div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Jogo da Memória</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Encontre os pares de conceitos relacionados à Inteligência Artificial.</p>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:underline">Jogar Agora →</span>
                </div>

                <div
                  onClick={() => selectGame('scenarios')}
                  className="p-6 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-slate-50 dark:bg-slate-900 text-center group"
                >
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Impacto da IA</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">10 cenários reais: descubra se a IA está ajudando, prejudicando ou sendo neutra!</p>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:underline">Jogar Agora →</span>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setGameState('ranking')}
                  className="px-6 py-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-white font-medium transition-colors"
                >
                  🏆 Ver Ranking Global
                </button>
              </div>
            </motion.div>
          )}

          {gameState === "difficulty" && !showAdmin && (
            <DifficultySelect
              key="difficulty"
              onSelect={handleSelectDifficulty}
              onBack={() => setGameState('menu')}
            />
          )}

          {gameState === "playing_quiz" && !showAdmin && (
            <Quiz
              key={`quiz-${difficulty}`}
              difficulty={difficulty}
              onComplete={(res) => handleComplete({ ...res, maxScore: 10 })}
              onBack={() => setGameState('difficulty')}
            />
          )}

          {gameState === "playing_memory" && !showAdmin && (
            <MemoryGame key="memory" onComplete={(res) => handleComplete({ ...res, maxScore: 100 })} onBack={() => setGameState('menu')} />
          )}

          {gameState === "playing_scenarios" && !showAdmin && (
            <ScenarioGame key="scenarios" onComplete={(res) => handleComplete({ ...res, maxScore: 10 })} onBack={() => setGameState('menu')} />
          )}

          {gameState === "result" && !showAdmin && (
            <ResultScreen
              key="result"
              score={resultData.score}
              timeSpent={resultData.timeSpent}
              total={resultData.maxScore}
              onShowRanking={() => setGameState("ranking")}
              onBackToMenu={() => setGameState("menu")}
            />
          )}

          {gameState === "ranking" && !showAdmin && (
            <RankingBoard
              key="ranking"
              onClose={() => setGameState("menu")}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GamesManager;
