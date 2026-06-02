import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginScreen from "./LoginScreen";
import DifficultySelect from "./DifficultySelect";
import Quiz from "./Quiz";
import ResultScreen from "./ResultScreen";
import RankingBoard from "./RankingBoard";
import AdminPanel from "./AdminPanel";
import { saveScore } from "../../firebase";

const QuizManager = () => {
  // states: 'login', 'difficulty', 'playing', 'result', 'ranking'
  const [gameState, setGameState] = useState("login");
  const [userData, setUserData] = useState(null);
  const [difficulty, setDifficulty] = useState("hard");
  const [resultData, setResultData] = useState({ score: 0, timeSpent: 0 });
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

  const handleStart = (data) => {
    setUserData(data);
    setGameState("difficulty");
  };

  const handleSelectDifficulty = (diff) => {
    setDifficulty(diff);
    setGameState("playing");
  };

  const handleComplete = async ({ score, timeSpent }) => {
    setResultData({ score, timeSpent });

    // Salvar no ranking (Firebase ou localStorage)
    // gameKey para quiz inclui a dificuldade
    const gameKey = `quiz_${difficulty}`;
    await saveScore(gameKey, {
      name: userData.name,
      turma: userData.turma,
      score,
      timeSpent,
      difficulty,
    });

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

          {gameState === "difficulty" && !showAdmin && (
            <DifficultySelect
              key="difficulty"
              onSelect={handleSelectDifficulty}
              onBack={() => setGameState("login")}
            />
          )}

          {gameState === "playing" && !showAdmin && (
            <Quiz
              key={`quiz-${difficulty}`}
              difficulty={difficulty}
              onComplete={handleComplete}
              onBack={() => setGameState("difficulty")}
            />
          )}

          {gameState === "result" && !showAdmin && (
            <ResultScreen
              key="result"
              score={resultData.score}
              timeSpent={resultData.timeSpent}
              total={10}
              difficulty={difficulty}
              onShowRanking={() => setGameState("ranking")}
            />
          )}

          {gameState === "ranking" && !showAdmin && (
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
