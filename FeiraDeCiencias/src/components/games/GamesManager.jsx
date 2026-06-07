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
import HangmanGame from "./HangmanGame";
import ScrambleGame from "./WordScrambleGame";
import WordSearchGame from "./WordSearchGame";
import TuringTestGame from "./TuringTestGame";
import IntrusoGame from "./IntrusoGame";
import AssociationGame from "./AssociationGame";
import { playClickSound } from "../../utils/sounds";
import { saveScore } from "../../firebase";

const GAMES_LIST = [
  { id: 'quiz', label: 'Quiz da IA', emoji: '🧠', desc: 'Responda perguntas sobre conceitos, ética e o futuro da inteligência artificial.' },
  { id: 'memory', label: 'Jogo da Memória', emoji: '🎴', desc: 'Encontre os pares de termos fundamentais da IA e seus conceitos.' },
  { id: 'scenarios', label: 'Impacto da IA', emoji: '🔍', desc: 'Avalie situações reais e defina se a IA está ajudando, prejudicando ou se é neutra.' },
  { id: 'hangman', label: 'Jogo da Forca', emoji: '🔤', desc: 'Descubra a palavra secreta sobre inteligência artificial antes de esgotar as tentativas.' },
  { id: 'scramble', label: 'Palavras Embaralhadas', emoji: '🔄', desc: 'Ordene as letras embaralhadas para desvendar importantes termos do nosso tema.' },
  { id: 'wordsearch', label: 'Caça-Palavras', emoji: '🧩', desc: 'Localize palavras escondidas na grade de letras relacionadas ao impacto da IA.' },
  { id: 'turing', label: 'Teste de Turing', emoji: '🤖', desc: 'Analise as respostas e decida se foram escritas por uma pessoa ou por uma IA.' },
  { id: 'intruso', label: 'O Intruso', emoji: '❌', desc: 'Encontre qual palavra do grupo de termos não pertence à categoria de IA exibida.' },
  { id: 'association', label: 'Conectar Pares', emoji: '🔗', desc: 'Associe corretamente os termos da esquerda com suas respectivas descrições na direita.' },
];

const GamesManager = () => {
  // states: 'login', 'menu', 'difficulty', 'playing_quiz', 'playing_memory', 'playing_scenarios',
  //         'playing_hangman', 'playing_scramble', 'playing_wordsearch',
  //         'playing_turing', 'playing_intruso', 'playing_association', 'result', 'ranking'
  const [gameState, setGameState] = useState("login");
  const [userData, setUserData] = useState(null);
  const [resultData, setResultData] = useState({ score: 0, timeSpent: 0, maxScore: 0 });
  const [currentGame, setCurrentGame] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
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
    setGameState('difficulty');
  };

  const handleSelectDifficulty = (diff) => {
    setDifficulty(diff);
    if (currentGame === 'quiz') setGameState('playing_quiz');
    else if (currentGame === 'memory') setGameState('playing_memory');
    else if (currentGame === 'scenarios') setGameState('playing_scenarios');
    else if (currentGame === 'hangman') setGameState('playing_hangman');
    else if (currentGame === 'scramble') setGameState('playing_scramble');
    else if (currentGame === 'wordsearch') setGameState('playing_wordsearch');
    else if (currentGame === 'turing') setGameState('playing_turing');
    else if (currentGame === 'intruso') setGameState('playing_intruso');
    else if (currentGame === 'association') setGameState('playing_association');
  };

  const getGameMaxScore = (gameId, diff) => {
    if (gameId === 'quiz') return 10;
    if (gameId === 'memory') return 100;
    if (gameId === 'scenarios') {
      return diff === 'easy' ? 5 : diff === 'medium' ? 8 : 10;
    }
    return diff === 'easy' ? 30 : diff === 'medium' ? 60 : 100;
  };

  const handleComplete = async ({ score, timeSpent }) => {
    const maxScore = getGameMaxScore(currentGame, difficulty);
    setResultData({ score, timeSpent, maxScore });

    // Determina a chave do ranking (ex: quiz_easy, memory_hard, scenarios_medium)
    const gameKey = `${currentGame}_${difficulty}`;

    await saveScore(gameKey, {
      name: userData.name,
      turma: userData.turma,
      score,
      timeSpent,
    });

    setGameState("result");
  };

  return (
    <section id="games-section" className="py-24 px-6 relative z-10 min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 transition-colors duration-300">

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
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl max-w-5xl mx-auto font-sans"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white mb-3">
                  Bem-vindo, {userData?.name}!
                </h2>
                <p className="text-slate-550 dark:text-slate-450 max-w-2xl mx-auto text-sm font-serif leading-relaxed italic">
                  Escolha um dos desafios acadêmicos abaixo para testar seus conhecimentos e concorrer no ranking científico global.
                  Compreenda a extensão de como a Inteligência Artificial auxilia o desenvolvimento social e quais os riscos atrelados.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {GAMES_LIST.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => selectGame(game.id)}
                    className="p-6 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer bg-slate-50 dark:bg-slate-900 text-center group flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">{game.emoji}</div>
                      <h3 className="text-lg font-display font-bold text-slate-800 dark:text-white mb-2">{game.label}</h3>
                      <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed font-serif mb-4">{game.desc}</p>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xs group-hover:underline mt-auto">
                      Jogar Agora →
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={() => { playClickSound(); setGameState('ranking'); }}
                  className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl hover:bg-slate-850 dark:hover:bg-blue-700 font-bold text-sm transition-all shadow-md shadow-blue-500/10"
                >
                  🏆 Ver Ranking Global
                </button>
              </div>
            </motion.div>
          )}

          {gameState === "difficulty" && !showAdmin && (
            <DifficultySelect
              key="difficulty"
              title={`Nível de Dificuldade - ${GAMES_LIST.find(g => g.id === currentGame)?.label}`}
              subtitle="Escolha como deseja jogar este game."
              onSelect={handleSelectDifficulty}
              onBack={() => setGameState('menu')}
            />
          )}

          {gameState === "playing_quiz" && !showAdmin && (
            <Quiz
              key={`quiz-${difficulty}`}
              difficulty={difficulty}
              onComplete={handleComplete}
              onBack={() => setGameState('difficulty')}
            />
          )}

          {gameState === "playing_memory" && !showAdmin && (
            <MemoryGame
              key={`memory-${difficulty}`}
              difficulty={difficulty}
              onComplete={handleComplete}
              onBack={() => setGameState('difficulty')}
            />
          )}

          {gameState === "playing_scenarios" && !showAdmin && (
            <ScenarioGame
              key={`scenarios-${difficulty}`}
              difficulty={difficulty}
              onComplete={handleComplete}
              onBack={() => setGameState('difficulty')}
            />
          )}

          {gameState === "playing_hangman" && !showAdmin && (
            <HangmanGame
              key={`hangman-${difficulty}`}
              difficulty={difficulty}
              onComplete={handleComplete}
              onBack={() => setGameState('difficulty')}
            />
          )}

          {gameState === "playing_scramble" && !showAdmin && (
            <ScrambleGame
              key={`scramble-${difficulty}`}
              difficulty={difficulty}
              onComplete={handleComplete}
              onBack={() => setGameState('difficulty')}
            />
          )}

          {gameState === "playing_wordsearch" && !showAdmin && (
            <WordSearchGame
              key={`wordsearch-${difficulty}`}
              difficulty={difficulty}
              onComplete={handleComplete}
              onBack={() => setGameState('difficulty')}
            />
          )}

          {gameState === "playing_turing" && !showAdmin && (
            <TuringTestGame
              key={`turing-${difficulty}`}
              difficulty={difficulty}
              onComplete={handleComplete}
              onBack={() => setGameState('difficulty')}
            />
          )}

          {gameState === "playing_intruso" && !showAdmin && (
            <IntrusoGame
              key={`intruso-${difficulty}`}
              difficulty={difficulty}
              onComplete={handleComplete}
              onBack={() => setGameState('difficulty')}
            />
          )}

          {gameState === "playing_association" && !showAdmin && (
            <AssociationGame
              key={`association-${difficulty}`}
              difficulty={difficulty}
              onComplete={handleComplete}
              onBack={() => setGameState('difficulty')}
            />
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
