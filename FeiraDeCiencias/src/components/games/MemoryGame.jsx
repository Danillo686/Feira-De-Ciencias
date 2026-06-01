import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Cpu, Database, Network, Eye, Bot, ArrowLeft } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const CARD_PAIRS = [
  { id: 1, icon: Brain, label: "Redes Neurais" },
  { id: 2, icon: Cpu, label: "Processamento" },
  { id: 3, icon: Database, label: "Big Data" },
  { id: 4, icon: Network, label: "Deep Learning" },
  { id: 5, icon: Eye, label: "Visão Computacional" },
  { id: 6, icon: Bot, label: "Automação" }
];

const MemoryGame = ({ onComplete, onBack }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = [...CARD_PAIRS, ...CARD_PAIRS]
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
      
      // Calculate score based on moves and time (Max 100)
      const optimalMoves = 6;
      const penaltyMoves = Math.max(0, moves - optimalMoves) * 5;
      const penaltyTime = Math.max(0, timeSpent - 20) * 1;
      let finalScore = 100 - penaltyMoves - penaltyTime;
      if (finalScore < 10) finalScore = 10; // Minimum score
      
      setTimeout(() => {
        onComplete({ score: Math.floor(finalScore), timeSpent });
      }, 1000);
    }
  }, [solved, cards.length, startTime, moves, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl w-full mx-auto bg-white rounded-2xl formal-border shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <button 
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </button>
        <div className="text-right">
          <p className="text-sm text-slate-500">Movimentos: <span className="font-bold text-slate-800">{moves}</span></p>
        </div>
      </div>

      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Jogo da Memória</h2>
          <p className="text-slate-600">Encontre os pares de conceitos relacionados à IA.</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
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
                  {/* Frente (costas da carta) */}
                  <div className="absolute w-full h-full backface-hidden bg-primary text-white rounded-xl shadow-sm flex items-center justify-center border-2 border-primary/20 hover:bg-primary/90 transition-colors">
                    <span className="text-4xl opacity-50">?</span>
                  </div>

                  {/* Verso (face da carta) */}
                  <div className={`absolute w-full h-full backface-hidden rounded-xl shadow-sm flex flex-col items-center justify-center border-2 border-slate-200 bg-white transform rotate-y-180 ${isSolved ? 'opacity-50 ring-2 ring-green-500 border-green-500' : ''}`}>
                    <Icon size={32} className={`mb-2 ${isSolved ? 'text-green-500' : 'text-primary'}`} />
                    <span className="text-xs font-semibold text-center text-slate-700 px-1">{card.label}</span>
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
