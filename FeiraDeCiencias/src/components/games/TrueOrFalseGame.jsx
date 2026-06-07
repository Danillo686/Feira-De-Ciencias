import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowLeft, Brain } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const QUESTIONS_EASY = [
  {
    id: 1,
    text: "A IA é capaz de sentir emoções reais como amor, tristeza e empatia.",
    isTrue: false,
    explanation: "IAs apenas simulam emoções através de padrões de texto e voz. Elas não possuem sentimentos, consciência ou experiências subjetivas."
  },
  {
    id: 2,
    text: "Assistentes como Alexa e Siri utilizam inteligência artificial para entender a nossa fala.",
    isTrue: true,
    explanation: "Esses assistentes usam processamento de linguagem natural (NLP) para decodificar áudio de voz em texto, interpretar a intenção e dar uma resposta adequada."
  },
  {
    id: 3,
    text: "Carros autônomos são 100% seguros e nunca se envolveram em acidentes de trânsito.",
    isTrue: false,
    explanation: "Carros autônomos já se envolveram em acidentes, inclusive fatais. Embora reduzam o erro humano, a tecnologia ainda está em desenvolvimento e enfrenta desafios complexos."
  },
  {
    id: 4,
    text: "Filtros de spam de e-mail usam inteligência artificial para classificar mensagens perigosas ou indesejadas.",
    isTrue: true,
    explanation: "Algoritmos de aprendizado de máquina analisam o conteúdo, cabeçalho e reputação do remetente para bloquear automaticamente mensagens de spam."
  },
  {
    id: 5,
    text: "Deepfakes são vídeos ou áudios gerados por IA que imitam rostos e vozes de pessoas reais.",
    isTrue: true,
    explanation: "Deepfakes usam redes neurais profundas para sobrepor rostos e clonar vozes, permitindo criar mídias altamente realistas de pessoas fazendo ou dizendo coisas que nunca fizeram."
  }
];

const QUESTIONS_MEDIUM = [
  {
    id: 1,
    text: "O termo 'Machine Learning' refere-se a computadores programados manualmente com todas as regras rígidas possíveis.",
    isTrue: false,
    explanation: "Machine Learning é o oposto: em vez de programar regras fixas, alimentamos o sistema com dados e ele aprende a identificar os padrões e tomar decisões sozinho."
  },
  {
    id: 2,
    text: "O viés algorítmico ocorre porque as IAs aprendem preconceitos contidos nos dados históricos de treinamento.",
    isTrue: true,
    explanation: "Se os dados de treino contêm preconceito humano ou desigualdades históricas, a IA aprenderá esses padrões como regras gerais, reproduzindo e amplificando a discriminação."
  },
  {
    id: 3,
    text: "O ChatGPT gera respostas combinando palavras estatisticamente e não buscando informações diretamente em um banco de dados estático de perguntas prontas.",
    isTrue: true,
    explanation: "Os LLMs são modelos gerativos probabilísticos. Eles preveem a próxima palavra mais provável com base no contexto, gerando textos inéditos em vez de apenas copiar e colar."
  },
  {
    id: 4,
    text: "A Visão Computacional permite que os computadores extraiam informações e compreendam imagens e vídeos.",
    isTrue: true,
    explanation: "Visão Computacional é uma subárea da IA focada em fazer com que máquinas enxerguem e interpretem o mundo visual de forma semelhante aos humanos."
  },
  {
    id: 5,
    text: "Uma Inteligência Geral Artificial (AGI) já existe e é utilizada secretamente por grandes corporações globais.",
    isTrue: false,
    explanation: "Nenhum sistema de AGI foi criado até o momento. Toda IA atual é classificada como 'Narrow AI' (IA estreita), especializada em tarefas específicas (como tradução, jogos ou detecção de imagens)."
  }
];

const QUESTIONS_HARD = [
  {
    id: 1,
    text: "O modelo GPT-4 da OpenAI foi treinado oficialmente com mais de 10 trilhões de parâmetros.",
    isTrue: false,
    explanation: "A OpenAI nunca divulgou oficialmente o número exato de parâmetros do GPT-4, mas especialistas e vazamentos de mercado apontam para cerca de 1.7 trilhão de parâmetros em arquitetura MoE — não 10 trilhões."
  },
  {
    id: 2,
    text: "O famoso estudo 'Attention is All You Need' (2017) introduziu a arquitetura Transformer, que é a fundação dos LLMs modernos.",
    isTrue: true,
    explanation: "Este artigo do Google substituiu arquiteturas recorrentes pelo mecanismo de auto-atenção, possibilitando o treinamento paralelo massivo que viabilizou os LLMs atuais."
  },
  {
    id: 3,
    text: "O algoritmo AlphaFold da DeepMind resolveu o problema científico de prever a estrutura 3D de proteínas a partir de aminoácidos.",
    isTrue: true,
    explanation: "O AlphaFold previu estruturas tridimensionais de proteínas com precisão atômica em tempo recorde, resolvendo um desafio de mais de 50 anos da biologia molecular."
  },
  {
    id: 4,
    text: "O conceito de retropropagação (backpropagation) foi inventado apenas em 2012 com o surgimento de placas de vídeo modernas.",
    isTrue: false,
    explanation: "O backpropagation foi formalizado e popularizado por Rumelhart, Hinton e Williams em 1986. O que ocorreu em 2012 foi a viabilização computacional pelo uso de GPUs em redes profundas (AlexNet)."
  },
  {
    id: 5,
    text: "Redes neurais profundas de 'caixa preta' são chamadas assim porque é impossível entender os pesos de conexões matematicamente.",
    isTrue: false,
    explanation: "Nós sabemos os valores exatos dos bilhões de pesos matemáticos. O problema da 'caixa preta' é que a quantidade e a complexidade dessas interações matemáticas impossibilitam interpretar de forma intuitiva como a IA tomou a decisão."
  }
];

const QUESTION_BANKS = {
  easy: QUESTIONS_EASY,
  medium: QUESTIONS_MEDIUM,
  hard: QUESTIONS_HARD
};

const TrueOrFalseGame = ({ onComplete, onBack, difficulty = "easy" }) => {
  const questions = QUESTION_BANKS[difficulty] || QUESTIONS_EASY;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, [difficulty]);

  const handleAnswer = (answer) => {
    if (showExplanation) return;

    playClickSound();
    const isCorrect = answer === questions[currentQuestion].isTrue;
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      playSuccessSound();
      setScore(s => s + 1);
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    playClickSound();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setShowExplanation(false);
      setLastAnswerCorrect(null);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete({ score, timeSpent });
    }
  };

  const q = questions[currentQuestion] || questions[0];
  const progress = (currentQuestion / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl w-full mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden font-['Inter']"
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
              {currentQuestion + 1} / {questions.length}
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
            Verdadeiro ou Falso? • Nível {difficulty === "easy" ? "Fácil" : difficulty === "hard" ? "Difícil" : "Médio"}
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
                className="flex-1 py-5 px-6 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white hover:border-emerald-500 dark:hover:bg-emerald-600 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
              >
                <Check size={26} />
                Verdadeiro
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-5 px-6 bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-400 hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white hover:border-rose-500 dark:hover:bg-rose-600 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
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
                  {currentQuestion < questions.length - 1 ? "Próxima Questão →" : "Ver Resultado 🏆"}
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
