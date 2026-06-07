import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const QUESTIONS_INTRUSO = {
  easy: [
    {
      id: 1,
      theme: "Benefícios / Ajudas reais da IA",
      options: ["Traduzir idiomas", "Recomendar filmes", "Sentir dor de dente", "Prever tempo de trânsito"],
      answer: "Sentir dor de dente",
      explanation: "A IA é um software de processamento lógico de dados. Ela não possui corpo físico, receptores nervosos ou sentimentos, logo não é capaz de sentir dor de dente física."
    },
    {
      id: 2,
      theme: "Conceitos relacionados à Inteligência Artificial",
      options: ["Rede Neural", "Algoritmo", "Geladeira Convencional", "Deep Learning"],
      answer: "Geladeira Convencional",
      explanation: "Geladeira convencional é um eletrodoméstico analógico/elétrico comum. Já Redes Neurais, Algoritmos e Deep Learning são pilares fundamentais da tecnologia de IA."
    }
  ],
  medium: [
    {
      id: 1,
      theme: "Perigos ou danos que a IA pode causar",
      options: ["Invasão de privacidade", "Deepfakes de mentira", "Dobramento de proteínas grátis", "Viés algorítmico discriminatório"],
      answer: "Dobramento de proteínas grátis",
      explanation: "O dobramento de proteínas grátis (como o feito pelo AlphaFold) é um grande benefício científico para a medicina, não um perigo."
    },
    {
      id: 2,
      theme: "Aplicações diretas da IA na saúde",
      options: ["Análise de exames de Raio-X", "Diagnóstico de câncer de pele", "Prescrição manual com caneta", "Previsão de estrutura de vírus"],
      answer: "Prescrição manual com caneta",
      explanation: "A prescrição manual com caneta é um ato analógico tradicional executado diretamente pelo médico humano, sem envolvimento de IA."
    }
  ],
  hard: [
    {
      id: 1,
      theme: "Algoritmos e Métodos de Otimização no Deep Learning",
      options: ["AdamW", "SGD com Momentum", "RMSprop", "Algoritmo de Prim"],
      answer: "Algoritmo de Prim",
      explanation: "AdamW, SGD e RMSprop são otimizadores usados para minimizar a função de perda durante o treinamento de redes neurais. O Algoritmo de Prim é um método para encontrar a Árvore Geradora Mínima em grafos."
    },
    {
      id: 2,
      theme: "Arquiteturas neurais especializadas para processamento sequencial",
      options: ["Long Short-Term Memory (LSTM)", "Gated Recurrent Unit (GRU)", "Transformers", "K-Means Clustering"],
      answer: "K-Means Clustering",
      explanation: "LSTM, GRU e Transformers são arquiteturas para dados sequenciais (texto/áudio). K-Means é um algoritmo clássico de agrupamento estatístico não supervisionado."
    }
  ]
};

const IntrusoGame = ({ onComplete, onBack, difficulty = "easy" }) => {
  const questions = QUESTIONS_INTRUSO[difficulty] || QUESTIONS_INTRUSO.easy;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, [difficulty]);

  const handleSelect = (option) => {
    if (showExplanation) return;
    playClickSound();
    setSelectedOption(option);
    setShowExplanation(true);

    if (option === questions[currentIndex].answer) {
      playSuccessSound();
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete({ score: score * (difficulty === "easy" ? 15 : difficulty === "medium" ? 30 : 50), timeSpent });
    }
  };

  const q = questions[currentIndex] || questions[0];
  const isCorrect = selectedOption === q.answer;

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
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-sans">
            Encontre o Intruso • {difficulty === "easy" ? "🟢 Fácil" : difficulty === "hard" ? "🔴 Difícil" : "🟡 Médio"}
          </span>
          <span className="text-sm font-bold text-slate-450 font-sans">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col gap-6">
        <div className="text-center">
          <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full mb-3 shadow-inner">
            <HelpCircle size={28} />
          </div>
          <h2 className="text-2xl font-display font-black text-slate-800 dark:text-white mb-1">Qual termo não se encaixa?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-serif italic">Identifique o intruso na lista com base na categoria acadêmica abaixo.</p>
        </div>

        {/* Category Header */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-700 rounded-xl p-4 text-center font-sans">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Categoria de Análise</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400 font-serif italic">"{q.theme}"</span>
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2 font-sans">
          {q.options.map((option) => {
            let btnStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-slate-50 dark:hover:bg-slate-750 hover:scale-[1.01]";
            if (showExplanation) {
              if (option === q.answer) {
                btnStyle = "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-300 dark:ring-emerald-800";
              } else if (option === selectedOption) {
                btnStyle = "bg-rose-50 dark:bg-rose-950/20 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-300 dark:ring-rose-800";
              } else {
                btnStyle = "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 opacity-60";
              }
            }

            return (
              <button
                key={option}
                disabled={showExplanation}
                onClick={() => handleSelect(option)}
                className={`py-4 px-6 border-2 rounded-xl font-bold text-base shadow-sm transition-all duration-200 flex items-center justify-center text-center ${btnStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback and Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border-2 max-w-2xl mx-auto w-full font-sans ${
                isCorrect
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-350 dark:border-emerald-700 text-emerald-800 dark:text-emerald-350"
                  : "bg-rose-50 dark:bg-rose-900/20 border-rose-350 dark:border-rose-700 text-rose-800 dark:text-rose-350"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {isCorrect ? (
                  <CheckCircle className="text-emerald-500" size={22} />
                ) : (
                  <AlertCircle className="text-rose-500" size={22} />
                )}
                <h3 className="text-lg font-bold">
                  {isCorrect ? "Correto! Você identificou o intruso acadêmico." : `Incorreto! O intruso era: "${q.answer}"`}
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed mb-5 font-serif italic">
                {q.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-sm transition-all"
              >
                {currentIndex < questions.length - 1 ? "Próxima Questão →" : "Ver Resultado 🏆"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default IntrusoGame;
