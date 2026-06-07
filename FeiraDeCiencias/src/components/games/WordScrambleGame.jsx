import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, HelpCircle } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const WORDS_SCRAMBLE = {
  easy: [
    { word: "IA", hint: "Sigla padrão para inteligência artificial." },
    { word: "ROBO", hint: "Agente físico estruturado para execução autônoma." },
    { word: "CHAT", hint: "Interface digital baseada em diálogos e processamento de texto." },
    { word: "DADO", hint: "Elemento informacional básico processado por modelos de aprendizado." }
  ],
  medium: [
    { word: "NEURAL", hint: "Rede computacional matemática inspirada na estrutura sináptica do cérebro." },
    { word: "SENSOR", hint: "Transdutor físico que lê dados analógicos e os converte para a IA." },
    { word: "CODIGO", hint: "Instruções lógicas formais que ditam as ações do processador." },
    { word: "NUVEM", hint: "Infraestrutura de servidores remotos onde dados e modelos rodam online." }
  ],
  hard: [
    { word: "RETROPROPAGACAO", hint: "Algoritmo de treinamento que calcula gradientes para otimizar pesos em redes profundas (Backpropagation)." },
    { word: "HIPERPARAMETRO", hint: "Parâmetro pré-definido pelo cientista que regula a taxa de aprendizado e arquitetura do modelo." },
    { word: "EXPLICABILIDADE", hint: "Conceito ético e técnico (XAI) voltado a desmistificar a lógica de caixas-pretas neurais." },
    { word: "CONVOLUCIONAL", hint: "Operador matemático e tipo de rede neural profunda utilizada na extração de features em imagens." }
  ]
};

const ScrambleGame = ({ onComplete, onBack, difficulty = "easy" }) => {
  const [wordData, setWordData] = useState({ word: "", hint: "" });
  const [scrambled, setScrambled] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]); // tracks indices in the scrambled array
  const [startTime, setStartTime] = useState(null);
  const [status, setStatus] = useState("playing"); // playing, won, error

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    const list = WORDS_SCRAMBLE[difficulty] || WORDS_SCRAMBLE.easy;
    const chosen = list[Math.floor(Math.random() * list.length)];
    setWordData(chosen);

    // Scramble the word
    let letters = chosen.word.toUpperCase().split("");
    let scrambledLetters = [...letters];
    // Keep scrambling until it differs from original
    while (scrambledLetters.join("") === letters.join("") && letters.length > 1) {
      scrambledLetters.sort(() => Math.random() - 0.5);
    }

    setScrambled(scrambledLetters.map((l, i) => ({ letter: l, originalIndex: i })));
    setSelectedIndices([]);
    setStatus("playing");
    setStartTime(Date.now());
  };

  const selectLetter = (scrambledIndex) => {
    if (status !== "playing") return;
    playClickSound();
    if (selectedIndices.includes(scrambledIndex)) {
      // Remove it
      setSelectedIndices(selectedIndices.filter((idx) => idx !== scrambledIndex));
    } else {
      const newSelected = [...selectedIndices, scrambledIndex];
      setSelectedIndices(newSelected);

      // Check if word is completed
      if (newSelected.length === scrambled.length) {
        const formedWord = newSelected.map((idx) => scrambled[idx].letter).join("");
        if (formedWord === wordData.word.toUpperCase()) {
          setStatus("won");
          playSuccessSound();
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          const baseScore = difficulty === "easy" ? 30 : difficulty === "medium" ? 60 : 100;
          const finalScore = Math.max(10, baseScore - Math.floor(timeSpent * 0.5));
          setTimeout(() => {
            onComplete({ score: finalScore, timeSpent });
          }, 1500);
        } else {
          setStatus("error");
          setTimeout(() => {
            setSelectedIndices([]);
            setStatus("playing");
          }, 1000);
        }
      }
    }
  };

  const getFormedWord = () => {
    return selectedIndices.map((idx) => scrambled[idx].letter);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl w-full mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden font-sans"
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
          Palavras Embaralhadas • {difficulty === "easy" ? "🟢 Fácil" : difficulty === "hard" ? "🔴 Difícil" : "🟡 Médio"}
        </span>
      </div>

      <div className="p-8 text-center flex flex-col items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-slate-850 dark:text-white mb-2">Desembaralhe a Palavra</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-serif italic">Combine as letras na ordem correta para decifrar o termo científico.</p>
        </div>

        {/* Hint */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 max-w-2xl w-full flex gap-3 text-left">
          <HelpCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase font-sans">Definição Acadêmica</span>
            <p className="text-sm text-slate-750 dark:text-slate-300 leading-relaxed mt-1 font-serif italic">
              "{wordData.hint}"
            </p>
          </div>
        </div>

        {/* Formed Slots */}
        <div className="flex flex-wrap gap-1.5 justify-center my-4 min-h-[3.5rem] items-center w-full">
          {scrambled.map((_, i) => {
            const letter = getFormedWord()[i];
            return (
              <motion.div
                key={i}
                layout
                className={`w-9 sm:w-11 h-12 sm:h-14 border-2 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold transition-all shadow-sm font-mono ${
                  status === "won"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                    : status === "error"
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                    : letter
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-transparent"
                }`}
              >
                {letter || ""}
              </motion.div>
            );
          })}
        </div>

        {/* Shuffled pool */}
        <div className="flex flex-wrap gap-2 justify-center mt-4 w-full">
          {scrambled.map((item, idx) => {
            const isSelected = selectedIndices.includes(idx);
            return (
              <button
                key={idx}
                disabled={isSelected || status !== "playing"}
                onClick={() => selectLetter(idx)}
                className={`w-10 sm:w-11 h-10 sm:h-11 rounded-xl text-sm sm:text-base font-bold shadow-sm transition-all flex items-center justify-center border font-mono ${
                  isSelected
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-655 border-slate-200 dark:border-slate-700 opacity-40 scale-95"
                    : "bg-white dark:bg-slate-700 text-slate-800 dark:text-white border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105 active:scale-95"
                }`}
              >
                {item.letter}
              </button>
            );
          })}
        </div>

        {/* Win indicators */}
        <AnimatePresence>
          {status === "won" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold font-sans"
            >
              <CheckCircle size={20} /> Termo ordenado corretamente!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ScrambleGame;
