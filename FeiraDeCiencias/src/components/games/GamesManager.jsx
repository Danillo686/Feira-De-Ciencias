import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginScreen from "../quiz/LoginScreen";
import Quiz from "../quiz/Quiz";
import ResultScreen from "../quiz/ResultScreen";
import RankingBoard from "./RankingBoard";
import AdminPanel from "./AdminPanel";
import MemoryGame from "./MemoryGame";
import TrueOrFalseGame from "./TrueOrFalseGame";
import { playClickSound } from "../../utils/sounds";

const GamesManager = () => {
  // states: 'login', 'menu', 'playing_quiz', 'playing_memory', 'playing_tf', 'result', 'ranking'
  const [gameState, setGameState] = useState("login");
  const [userData, setUserData] = useState(null);
  const [resultData, setResultData] = useState({ score: 0, timeSpent: 0, maxScore: 0 });
  const [currentGame, setCurrentGame] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + Shift + A para abrir o admin
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
    if (gameId === 'quiz') setGameState('playing_quiz');
    if (gameId === 'memory') setGameState('playing_memory');
    if (gameId === 'tf') setGameState('playing_tf');
  };

  const handleComplete = ({ score, timeSpent, maxScore }) => {
    setResultData({ score, timeSpent, maxScore });
    
    // Salvar no ranking centralizado
    const rankingKey = `ai_ranking_${currentGame}`;
    const currentRanking = JSON.parse(localStorage.getItem(rankingKey) || "[]");
    
    // Limpar flags de 'isRecent' antigas
    const cleanedRanking = currentRanking.map(p => ({ ...p, isRecent: false }));
    
    const newEntry = {
      name: userData.name,
      turma: userData.turma,
      score: score,
      timeSpent: timeSpent,
      date: new Date().toISOString(),
      isRecent: true // Para destacar na UI
    };
    
    cleanedRanking.push(newEntry);
    localStorage.setItem(rankingKey, JSON.stringify(cleanedRanking));

    setGameState("result");
  };

  return (
    <section id="games-section" className="py-24 px-6 relative z-10 min-h-screen flex items-center justify-center bg-slate-50 border-t border-slate-200">
      
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
              className="bg-white p-8 rounded-2xl formal-border shadow-sm max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Bem-vindo, {userData?.name}!</h2>
                <p className="text-slate-600">Escolha um dos jogos abaixo para testar seus conhecimentos e concorrer no Top Global.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => selectGame('quiz')}
                  className="p-6 border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all cursor-pointer bg-slate-50 text-center"
                >
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Quiz da IA</h3>
                  <p className="text-sm text-slate-600 mb-4">10 perguntas para testar o que você aprendeu nas seções.</p>
                  <button className="text-primary font-semibold">Jogar Agora &rarr;</button>
                </div>

                <div 
                  onClick={() => selectGame('memory')}
                  className="p-6 border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all cursor-pointer bg-slate-50 text-center"
                >
                  <div className="text-4xl mb-4">🎴</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Jogo da Memória</h3>
                  <p className="text-sm text-slate-600 mb-4">Encontre os pares de conceitos relacionados à Inteligência Artificial.</p>
                  <button className="text-primary font-semibold">Jogar Agora &rarr;</button>
                </div>

                <div 
                  onClick={() => selectGame('tf')}
                  className="p-6 border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all cursor-pointer bg-slate-50 text-center"
                >
                  <div className="text-4xl mb-4">⚖️</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Verdadeiro ou Falso?</h3>
                  <p className="text-sm text-slate-600 mb-4">Identifique quais afirmações sobre IA são reais ou apenas mitos.</p>
                  <button className="text-primary font-semibold">Jogar Agora &rarr;</button>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setGameState('ranking')}
                  className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium"
                >
                  Ver Ranking Global
                </button>
              </div>
            </motion.div>
          )}
          
          {gameState === "playing_quiz" && !showAdmin && (
            <Quiz key="quiz" onComplete={(res) => handleComplete({ ...res, maxScore: 10 })} onBack={() => setGameState('menu')} />
          )}

          {gameState === "playing_memory" && !showAdmin && (
            <MemoryGame key="memory" onComplete={(res) => handleComplete({ ...res, maxScore: 100 })} onBack={() => setGameState('menu')} />
          )}

          {gameState === "playing_tf" && !showAdmin && (
            <TrueOrFalseGame key="tf" onComplete={(res) => handleComplete({ ...res, maxScore: 10 })} onBack={() => setGameState('menu')} />
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
