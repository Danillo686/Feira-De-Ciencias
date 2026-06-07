import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Cpu, Database, Network, Eye, Bot, ArrowLeft, AlertTriangle, Lock, Zap, Server, Activity, Layers } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const ALL_CARD_PAIRS = [
  { id: 1, icon: Brain, label: "Redes Neurais" },
  { id: 2, icon: Cpu, label: "Processamento" },
  { id: 3, icon: Database, label: "Big Data" },
  { id: 4, icon: Network, label: "Deep Learning" },
  { id: 5, icon: Eye, label: "Visão Computacional" },
  { id: 6, icon: Bot, label: "Automação" },
  { id: 7, icon: AlertTriangle, label: "Viés de IA" },
  { id: 8, icon: Lock, label: "Privacidade" }
];

const MemoryGame = ({ onComplete, onBack, difficulty = "easy" }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const getCardSubset = () => {
    if (difficulty === "easy") {
      return [
        { id: 1, icon: Brain, label: "Inteligência Artificial" },
        { id: 2, icon: Bot, label: "Robótica" },
        { id: 3, icon: Database, label: "Dados Digitais" },
        { id: 4, icon: Eye, label: "Chatbot" }
      ];
    } else if (difficulty === "medium") {
      return [
        { id: 1, icon: Brain, label: "Redes Neurais" },
        { id: 2, icon: Cpu, label: "Processamento" },
        { id: 3, icon: Database, label: "Big Data" },
        { id: 4, icon: Network, label: "Deep Learning" },
        { id: 5, icon: Eye, label: "Visão Computacional" },
        { id: 6, icon: Bot, label: "Automação" }
      ];
    } else {
      // Hard - REALLY hard technical terms (12 pairs / 24 cards)
      return [
        { id: 1, icon: Network, label: "Retropropagação de Erros" },
        { id: 2, icon: Cpu, label: "Hiperparâmetros do Modelo" },
        { id: 3, icon: Brain, label: "Mecanismo de Auto-Atenção" },
        { id: 4, icon: Bot, label: "Aprendizado por Reforço (RLHF)" },
        { id: 5, icon: Eye, label: "Alucinação Estatística" },
        { id: 6, icon: AlertTriangle, label: "Viés de Confirmação Algorítmica" },
        { id: 7, icon: Lock, label: "Invasão Sistêmica de Privacidade" },
        { id: 8, icon: Database, label: "Ataque Adversarial com Ruído" },
        { id: 9, icon: Zap, label: "Rede Convolucional Profunda" },
        { id: 10, icon: Server, label: "Treinamento Paralelo Massivo" },
        { id: 11, icon: Activity, label: "Otimizador AdamW" },
        { id: 12, icon: Layers, label: "Camadas Ocultas (Hidden)" }
      ];
    }
  };

  const initializeGame = () => {
    const subset = getCardSubset();
    const shuffledCards = [...subset, ...subset]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }));
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setStartTime(Date.now());
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;

    playClickSound();
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const match = cards[newFlipped[0]].id === cards[newFlipped[1]].id;

      if (match) {
        setTimeout(() => {
          playSuccessSound();
          setSolved(prev => [...prev, ...newFlipped]);
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      let optimalMoves = 6;
      let penaltyFactorMoves = 5;
      let timeLimit = 20;
      let penaltyFactorTime = 1;

      if (difficulty === "easy") {
        optimalMoves = 4;
        penaltyFactorMoves = 6;
        timeLimit = 15;
        penaltyFactorTime = 1.5;
      } else if (difficulty === "hard") {
        optimalMoves = 12;
        penaltyFactorMoves = 4;
        timeLimit = 50;
        penaltyFactorTime = 0.8;
      }

      const penaltyMoves = Math.max(0, moves - optimalMoves) * penaltyFactorMoves;
      const penaltyTime = Math.max(0, timeSpent - timeLimit) * penaltyFactorTime;
      let finalScore = 100 - penaltyMoves - penaltyTime;
      if (finalScore < 10) finalScore = 10;
      
      setTimeout(() => {
        onComplete({ score: Math.floor(finalScore), timeSpent });
      }, 1000);
    }
  }, [solved, cards.length, startTime, moves, onComplete, difficulty]);

  const getGridCols = () => {
    switch (difficulty) {
      case "easy":
        return "grid-cols-2 sm:grid-cols-4 max-w-md";
      case "hard":
        return "grid-cols-4 sm:grid-cols-6 max-w-3xl";
      case "medium":
      default:
        return "grid-cols-3 sm:grid-cols-4 max-w-xl";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl w-full mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden font-sans"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
        <button 
          onClick={() => { playClickSound(); onBack(); }}
          className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </button>
        <div className="text-right">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Movimentos: <span className="font-bold text-slate-800 dark:text-white">{moves}</span>
          </p>
        </div>
      </div>

      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white mb-2">Jogo da Memória</h2>
          <p className="text-slate-600 dark:text-slate-400 font-serif italic">Encontre os pares de conceitos relacionados à IA. (Nível {difficulty === "easy" ? "Fácil" : difficulty === "hard" ? "Difícil" : "Médio"})</p>
        </div>

        <div className={`grid gap-4 mx-auto ${getGridCols()}`}>
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || solved.includes(index);
            const isSolved = solved.includes(index);
            const Icon = card.icon;

            return (
              <div 
                key={card.uniqueId} 
                className="aspect-square perspective-1000"
                onClick={() => handleCardClick(index)}
              >
                <motion.div 
                  className="w-full h-full relative preserve-3d cursor-pointer duration-500"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                >
                  {/* Front (card back) */}
                  <div className="absolute w-full h-full backface-hidden bg-slate-900 dark:bg-blue-700 text-white rounded-xl shadow-sm flex items-center justify-center hover:bg-slate-700 dark:hover:bg-blue-600 transition-colors">
                    <span className="text-4xl opacity-40">?</span>
                  </div>

                  {/* Back (card face) */}
                  <div className={`absolute w-full h-full backface-hidden rounded-xl shadow-sm flex flex-col items-center justify-center border-2 bg-white dark:bg-slate-700 transform rotate-y-180 ${
                    isSolved
                      ? 'opacity-60 ring-2 ring-emerald-500 border-emerald-500 dark:border-emerald-500'
                      : 'border-slate-200 dark:border-slate-600'
                  }`}>
                    <Icon size={28} className={`mb-2 ${isSolved ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`} />
                    <span className="text-[10px] sm:text-xs font-semibold text-center text-slate-700 dark:text-slate-200 px-1 font-sans leading-tight">{card.label}</span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MemoryGame;
