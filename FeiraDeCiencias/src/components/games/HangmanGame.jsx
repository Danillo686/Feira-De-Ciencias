import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const WORDS_DATA = {
  easy: [
    { word: "IA", hint: "Abreviação padrão de Inteligência Artificial." },
    { word: "CHAT", hint: "Interface de comunicação textual automatizada." },
    { word: "DADO", hint: "Unidade fundamental de informação que alimenta redes neurais." },
    { word: "ROBO", hint: "Agente físico ou lógico projetado para automação." }
  ],
  medium: [
    { word: "ALGORITMO", hint: "Instrução computacional passo a passo que executa operações lógicas." },
    { word: "BIOMETRIA", hint: "Medição estatística de características físicas individuais." },
    { word: "VIRTUAL", hint: "Representação de ambiente ou objeto simulado por software." },
    { word: "AUTOMACAO", hint: "Execução operacional autônoma de processos industriais ou digitais." }
  ],
  hard: [
    { word: "RETROPROPAGACAO", hint: "Método matemático de correção de erro que recalcula pesos em redes profundas (Backpropagation)." },
    { word: "HIPERPARAMETRO", hint: "Configuração estrutural de uma rede definida antes do início do processo de treino." },
    { word: "EXPLICABILIDADE", hint: "Propriedade de tornar decisões de modelos de caixa preta legíveis e interpretáveis por humanos." },
    { word: "CONVOLUCIONAL", hint: "Arquitetura de rede profunda baseada em filtros espaciais, ideal para visão computacional." }
  ]
};

const HangmanGame = ({ onComplete, onBack, difficulty = "easy" }) => {
  const [wordData, setWordData] = useState({ word: "", hint: "" });
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameState, setGameState] = useState("playing"); // playing, won, lost
  const [startTime, setStartTime] = useState(null);

  const maxWrong = difficulty === "easy" ? 6 : difficulty === "medium" ? 5 : 4;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    const list = WORDS_DATA[difficulty] || WORDS_DATA.easy;
    const chosen = list[Math.floor(Math.random() * list.length)];
    setWordData(chosen);
    setGuessedLetters([]);
    setWrongCount(0);
    setGameState("playing");
    setStartTime(Date.now());
  };

  const handleGuess = (letter) => {
    if (gameState !== "playing" || guessedLetters.includes(letter)) return;
    playClickSound();

    const newGuesses = [...guessedLetters, letter];
    setGuessedLetters(newGuesses);

    const targetWord = wordData.word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const cleanLetter = letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

    if (targetWord.includes(cleanLetter)) {
      // Check if won
      const allGuessed = targetWord.split("").every(
        (char) => char === " " || newGuesses.includes(char)
      );
      if (allGuessed) {
        setGameState("won");
        playSuccessSound();
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        // Score calculation
        const baseScore = difficulty === "easy" ? 30 : difficulty === "medium" ? 60 : 100;
        const penalty = wrongCount * 5;
        const finalScore = Math.max(10, baseScore - penalty);
        setTimeout(() => {
          onComplete({ score: finalScore, timeSpent });
        }, 1500);
      }
    } else {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      if (newWrong >= maxWrong) {
        setGameState("lost");
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        setTimeout(() => {
          onComplete({ score: 0, timeSpent });
        }, 1500);
      }
    }
  };

  const getDisplayWord = () => {
    const targetWord = wordData.word.toUpperCase();
    return targetWord.split("").map((char) => {
      if (char === " ") return " ";
      const cleanChar = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return guessedLetters.includes(cleanChar) ? char : "_";
    });
  };

  // Hangman SVG Drawing based on wrongCount
  const renderHangman = () => {
    // scale SVG based on maxWrong
    const ratio = 6 / maxWrong;
    const errorsToDraw = wrongCount * ratio;

    return (
      <svg className="w-32 h-40 stroke-slate-800 dark:stroke-slate-200 stroke-[3] fill-none" viewBox="0 0 100 120">
        {/* Gallows base & post */}
        <line x1="10" y1="110" x2="60" y2="110" />
        <line x1="30" y1="110" x2="30" y2="10" />
        <line x1="30" y1="10" x2="70" y2="10" />
        <line x1="70" y1="10" x2="70" y2="25" />

        {/* Head */}
        {errorsToDraw >= 1 && <circle cx="70" cy="35" r="10" />}
        {/* Body */}
        {errorsToDraw >= 2 && <line x1="70" y1="45" x2="70" y2="75" />}
        {/* Left Arm */}
        {errorsToDraw >= 3 && <line x1="70" y1="55" x2="55" y2="45" />}
        {/* Right Arm */}
        {errorsToDraw >= 4 && <line x1="70" y1="55" x2="85" y2="45" />}
        {/* Left Leg */}
        {errorsToDraw >= 5 && <line x1="70" y1="75" x2="55" y2="95" />}
        {/* Right Leg */}
        {errorsToDraw >= 6 && <line x1="70" y1="75" x2="85" y2="95" />}
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl w-full mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden font-sans"
    >
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-sans">
          Jogo da Forca • {difficulty === "easy" ? "🟢 Fácil" : difficulty === "hard" ? "🔴 Difícil" : "🟡 Médio"}
        </span>
      </div>

      <div className="p-8 flex flex-col md:flex-row items-center justify-center gap-8 min-h-[350px]">
        {/* Hangman Visualization */}
        <div className="flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 w-full md:w-auto">
          {renderHangman()}
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-sans">
            Erros: {wrongCount} / {maxWrong}
          </span>
        </div>

        {/* Word and Controls */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="mb-4">
            <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-bold font-sans">
              Dica Acadêmica
            </span>
            <p className="mt-2 text-slate-700 dark:text-slate-350 text-base leading-relaxed italic font-serif">
              "{wordData.hint}"
            </p>
          </div>

          {/* Letter Slots */}
          <div className="flex flex-wrap gap-1.5 justify-center md:justify-start my-6 w-full">
            {getDisplayWord().map((char, idx) => (
              <span
                key={idx}
                className={`w-7 sm:w-9 h-12 flex items-center justify-center border-b-4 text-xl sm:text-2xl font-bold font-mono transition-colors ${
                  char === " " ? "border-transparent" : "border-slate-350 dark:border-slate-600 text-slate-800 dark:text-white"
                }`}
              >
                {char !== "_" ? char : ""}
              </span>
            ))}
          </div>

          {/* Game Status Messages */}
          <AnimatePresence>
            {gameState === "won" && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-4 font-sans">
                <CheckCircle size={20} /> Descoberta com sucesso!
              </motion.div>
            )}
            {gameState === "lost" && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold mb-4 font-sans">
                <XCircle size={20} /> Esgotado! A palavra era: <span className="underline">{wordData.word}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Virtual Keyboard */}
          <div className="flex flex-wrap gap-1.5 justify-center md:justify-start max-w-md">
            {alphabet.map((letter) => {
              const isUsed = guessedLetters.includes(letter);
              return (
                <button
                  key={letter}
                  disabled={isUsed || gameState !== "playing"}
                  onClick={() => handleGuess(letter)}
                  className={`w-8 h-9 rounded-md text-xs font-bold transition-all ${
                    isUsed
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HangmanGame;
