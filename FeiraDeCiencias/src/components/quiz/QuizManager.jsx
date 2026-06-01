import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginScreen from "./LoginScreen";
import Quiz from "./Quiz";
import ResultScreen from "./ResultScreen";
import RankingBoard from "./RankingBoard";
import AdminPanel from "./AdminPanel";

const QuizManager = () => {
  // states: 'login', 'playing', 'result', 'ranking'
  const [gameState, setGameState] = useState("login");
  const [userData, setUserData] = useState(null);
  const [resultData, setResultData] = useState({ score: 0, timeSpent: 0 });
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + Shift + A para abrir o admin (evita conflito com o Brave)
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStart = (data) => {
    setUserData(data);
    setGameState("playing");
  };

  const handleComplete = ({ score, timeSpent }) => {
    setResultData({ score, timeSpent });
    
    // Salvar no ranking
    const currentRanking = JSON.parse(localStorage.getItem("ai_quiz_ranking") || "[]");
    
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
    localStorage.setItem("ai_quiz_ranking", JSON.stringify(cleanedRanking));

    setGameState("result");
  };

  return (
    <section id="quiz-section" className="py-24 px-6 relative z-10 min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-primary/5 -z-10"></div>
      
      <div className="w-full">
        <AnimatePresence mode="wait">
          {showAdmin ? (
            <AdminPanel key="admin" onClose={() => setShowAdmin(false)} />
          ) : gameState === "login" && (
            <LoginScreen key="login" onStart={handleStart} />
          )}
          
          {gameState === "playing" && (
            <Quiz key="quiz" onComplete={handleComplete} />
          )}
          
          {gameState === "result" && (
            <ResultScreen 
              key="result" 
              score={resultData.score} 
              timeSpent={resultData.timeSpent}
              total={10} 
              onShowRanking={() => setGameState("ranking")} 
            />
          )}

          {gameState === "ranking" && (
            <RankingBoard 
              key="ranking" 
              onClose={() => setGameState("login")} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default QuizManager;
