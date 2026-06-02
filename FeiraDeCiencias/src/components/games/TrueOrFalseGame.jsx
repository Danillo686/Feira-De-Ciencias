import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowLeft, Brain } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const QUESTIONS = [
  {
    id: 1,
    text: "O modelo GPT-4 da OpenAI foi treinado com mais de 1 trilhão de parâmetros.",
    isTrue: false,
    explanation: "Embora a OpenAI não tenha divulgado o número oficial, estimativas técnicas apontam entre 170 e 220 bilhões de parâmetros — não 1 trilhão. Esse valor é frequentemente exagerado na mídia."
  },
  {
    id: 2,
    text: "Redes neurais convolucionais (CNNs) foram originalmente desenvolvidas para reconhecimento de imagens.",
    isTrue: true,
    explanation: "As CNNs foram concebidas por Yann LeCun para reconhecimento de dígitos escritos à mão (LeNet, 1998) e se tornaram o padrão em visão computacional."
  },
  {
    id: 3,
    text: "Uma IA com AGI (Inteligência Geral Artificial) já existe e opera em servidores secretos do governo.",
    isTrue: false,
    explanation: "Nenhum sistema de AGI foi criado até hoje. Toda IA atual é 'estreita' (Narrow AI) — especializada em tarefas específicas. AGI ainda é um objetivo de pesquisa, não uma realidade."
  },
  {
    id: 4,
    text: "O algoritmo AlphaFold da DeepMind resolveu um problema de 50 anos: prever a estrutura 3D de proteínas a partir de sua sequência de aminoácidos.",
    isTrue: true,
    explanation: "O AlphaFold 2 (2020) revolucionou a biologia computacional ao prever estruturas de proteínas com precisão atômica, acelerando pesquisas em medicina e desenvolvimento de fármacos."
  },
  {
    id: 5,
    text: "IAs treinadas apenas com dados de texto podem desenvolver capacidade de raciocínio matemático sem treinamento específico em matemática.",
    isTrue: true,
    explanation: "Modelos como GPT-4 demonstraram capacidade de raciocínio matemático emergente a partir de textos gerais. Isso sugere que a linguagem carrega estruturas lógicas que a IA absorve implicitamente."
  },
  {
    id: 6,
    text: "O conceito de 'backpropagation' (retropropagação) foi inventado nos anos 2010, com o surgimento das GPUs modernas.",
    isTrue: false,
    explanation: "O backpropagation foi formalizado por Rumelhart, Hinton e Williams em 1986. O que mudou nos anos 2010 foi o poder computacional das GPUs, que tornou prático treinar redes profundas."
  },
  {
    id: 7,
    text: "O problema da 'Caixa Preta' em IA refere-se ao fato de que, muitas vezes, é impossível compreender exatamente como um modelo chegou a uma decisão.",
    isTrue: true,
    explanation: "Redes neurais profundas com milhões de parâmetros são inerentemente opacas. A área de XAI (Explainable AI) busca criar métodos para interpretar essas decisões."
  },
  {
    id: 8,
    text: "Computadores quânticos já tornam todas as técnicas modernas de criptografia obsoletas.",
    isTrue: false,
    explanation: "Computadores quânticos atuais ainda são muito limitados (poucos qubits estáveis). Algoritmos como o de Shor poderiam quebrar RSA no futuro, mas ainda não existe um computador quântico poderoso o suficiente para isso."
  },
  {
    id: 9,
    text: "O famoso estudo 'Attention is All You Need' (2017) introduziu a arquitetura Transformer, que é a base dos LLMs modernos.",
    isTrue: true,
    explanation: "Publicado por pesquisadores do Google, o artigo substituiu as RNNs pelo mecanismo de Auto-Atenção, revolucionando NLP e permitindo modelos como BERT, GPT, Gemini e LLaMA."
  },
  {
    id: 10,
    text: "IAs generativas como DALL-E e Midjourney criam imagens 'do zero', sem nunca terem visto imagens humanas durante o treinamento.",
    isTrue: false,
    explanation: "Esses modelos são treinados em bilhões de pares imagem-texto coletados da internet. Eles aprendem padrões estatísticos desses dados — não criam do zero, mas recombinham o que aprenderam."
  }
];

const TrueOrFalseGame = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleAnswer = (answer) => {
    if (showExplanation) return;

    playClickSound();
    const isCorrect = answer === QUESTIONS[currentQuestion].isTrue;
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      playSuccessSound();
      setScore(s => s + 1);
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    playClickSound();
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
      setShowExplanation(false);
      setLastAnswerCorrect(null);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete({ score, timeSpent });
    }
  };

  const q = QUESTIONS[currentQuestion];
  const progress = (currentQuestion / QUESTIONS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl w-full mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
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

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-400 dark:text-slate-500">Questão</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {currentQuestion + 1} / {QUESTIONS.length}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
            <Brain size={14} />
            {score} pts
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-200 dark:bg-slate-700">
        <motion.div
          className="h-1 bg-blue-600"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Content */}
      <div className="p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-5">
            Verdadeiro ou Falso? • Nível Avançado
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 leading-relaxed min-h-[100px] flex items-center justify-center">
            "{q.text}"
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showExplanation ? (
            <motion.div
              key="buttons"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-5 px-6 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white hover:border-emerald-500 dark:hover:border-emerald-600 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
              >
                <Check size={26} />
                Verdadeiro
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-5 px-6 bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-400 hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white hover:border-rose-500 dark:hover:border-rose-600 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
              >
                <X size={26} />
                Falso
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border-2 ${
                lastAnswerCorrect
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700"
                  : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${lastAnswerCorrect ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300" : "bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300"}`}>
                  {lastAnswerCorrect ? <Check size={22} /> : <X size={22} />}
                </div>
                <h3 className={`text-xl font-bold ${lastAnswerCorrect ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"}`}>
                  {lastAnswerCorrect ? "Correto! 🎯" : "Incorreto! 💡"}
                </h3>
              </div>
              <p className={`text-base leading-relaxed mb-6 ${lastAnswerCorrect ? "text-emerald-900 dark:text-emerald-200" : "text-red-900 dark:text-red-200"}`}>
                {q.explanation}
              </p>

              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-700 dark:hover:bg-white transition-colors shadow-sm"
                >
                  {currentQuestion < QUESTIONS.length - 1 ? "Próxima Questão →" : "Ver Resultado 🏆"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TrueOrFalseGame;
