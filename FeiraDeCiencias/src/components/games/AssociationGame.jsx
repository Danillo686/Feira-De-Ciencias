import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const PAIRS_DATA = {
  easy: [
    { id: 1, left: "ChatGPT", right: "IA que gera textos e responde dúvidas" },
    { id: 2, left: "Alexa", right: "Assistente de voz inteligente para casa" },
    { id: 3, left: "Robô Industrial", right: "Máquina física para fabricar carros e produtos" }
  ],
  medium: [
    { id: 1, left: "Deep Learning", right: "Redes neurais artificiais de aprendizado profundo" },
    { id: 2, icon: null, left: "Processamento", right: "Capacidade computacional dos chips e placas" },
    { id: 3, left: "Big Data", right: "Grande volume de dados coletados para treinar a IA" },
    { id: 4, left: "Privacidade", right: "Risco de termos dados coletados de forma abusiva" }
  ],
  hard: [
    { id: 1, left: "Gradiente Descendente", right: "Algoritmo de ajuste de pesos baseado em cálculo de derivadas" },
    { id: 2, left: "Regularização L2 (Ridge)", right: "Penalização matemática dos pesos grandes para evitar overfitting" },
    { id: 3, left: "Dropout", right: "Desativação aleatória de neurônios para forçar redundância de aprendizado" },
    { id: 4, left: "Função de Perda (Loss)", right: "Métrica matemática que quantifica a disparidade entre a previsão e o real" },
    { id: 5, left: "Função de Ativação", right: "Introduz não-linearidade matemática para viabilizar aprendizado complexo" }
  ]
};

const AssociationGame = ({ onComplete, onBack, difficulty = "easy" }) => {
  const [pairs, setPairs] = useState([]);
  const [shuffledLeft, setShuffledLeft] = useState([]);
  const [shuffledRight, setShuffledRight] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    const list = PAIRS_DATA[difficulty] || PAIRS_DATA.easy;
    setPairs(list);

    // Shuffle left items
    const leftItems = list.map(item => ({ id: item.id, text: item.left }));
    const rightItems = list.map(item => ({ id: item.id, text: item.right }));

    setShuffledLeft([...leftItems].sort(() => Math.random() - 0.5));
    setShuffledRight([...rightItems].sort(() => Math.random() - 0.5));

    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setStartTime(Date.now());
  };

  const handleLeftClick = (item) => {
    if (matchedIds.includes(item.id)) return;
    playClickSound();
    setSelectedLeft(item);

    // If right is already selected, check match
    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  const handleRightClick = (item) => {
    if (matchedIds.includes(item.id)) return;
    playClickSound();
    setSelectedRight(item);

    // If left is already selected, check match
    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const checkMatch = (leftItem, rightItem) => {
    if (leftItem.id === rightItem.id) {
      playSuccessSound();
      const nextMatches = [...matchedIds, leftItem.id];
      setMatchedIds(nextMatches);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all matched
      if (nextMatches.length === pairs.length) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const baseScore = difficulty === "easy" ? 30 : difficulty === "medium" ? 60 : 100;
        const finalScore = Math.max(10, baseScore - Math.floor(timeSpent * 0.5));
        setTimeout(() => {
          onComplete({ score: finalScore, timeSpent });
        }, 1500);
      }
    } else {
      // Wrong match: flash error and reset selection
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl w-full mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden font-sans"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-sans">
          Conectar Pares • {difficulty === "easy" ? "🟢 Fácil" : difficulty === "hard" ? "🔴 Difícil" : "🟡 Médio"}
        </span>
      </div>

      <div className="p-8 text-center flex flex-col items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-slate-800 dark:text-white mb-2">Conecte os Conceitos</h2>
          <p className="text-slate-550 dark:text-slate-400 text-sm font-serif italic font-medium">Selecione um termo na coluna esquerda e sua descrição teórica correspondente na coluna direita.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl my-4">
          {/* Left Column (Concepts) */}
          <div className="flex flex-col gap-3 font-sans">
            <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider text-left pl-2">Conceito</h3>
            {shuffledLeft.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isActive = selectedLeft?.id === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => handleLeftClick(item)}
                  className={`p-4 rounded-xl text-left font-bold text-sm border-2 transition-all shadow-sm ${
                    isMatched
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 opacity-60 cursor-not-allowed"
                      : isActive
                      ? "bg-blue-50 dark:bg-blue-950/20 border-blue-500 text-blue-600 dark:text-blue-400 ring-2 ring-blue-300 dark:ring-blue-800"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500"
                  }`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>

          {/* Right Column (Descriptions) */}
          <div className="flex flex-col gap-3 font-serif italic">
            <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider text-left pl-2 font-sans not-italic">Descrição Acadêmica</h3>
            {shuffledRight.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isActive = selectedRight?.id === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => handleRightClick(item)}
                  className={`p-4 rounded-xl text-left text-xs sm:text-sm font-semibold border-2 transition-all shadow-sm leading-relaxed ${
                    isMatched
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 opacity-60 cursor-not-allowed"
                      : isActive
                      ? "bg-blue-50 dark:bg-blue-950/20 border-blue-500 text-blue-600 dark:text-blue-400 ring-2 ring-blue-300 dark:ring-blue-800"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500"
                  }`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        </div>

        {matchedIds.length === pairs.length && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mt-4 font-sans">
            <CheckCircle size={20} /> Todas as conexões teóricas foram estabelecidas!
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AssociationGame;
