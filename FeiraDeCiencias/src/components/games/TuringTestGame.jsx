import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Bot, HelpCircle, AlertCircle } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const QUESTIONS_TURING = {
  easy: [
    {
      id: 1,
      prompt: "Você gosta de pizza?",
      response: "Como uma inteligência artificial desenvolvida por engenheiros de software, eu não possuo corpo físico e nem papilas gustativas, portanto não consumo alimentos. Contudo, posso ajudá-lo a encontrar receitas ou pizzarias próximas.",
      answer: "AI",
      explanation: "A resposta é clássica de uma IA formal: usa termos de salvaguarda técnicos, esclarece que é um modelo de linguagem e oferece ajuda de forma mecânica."
    },
    {
      id: 2,
      prompt: "O que você fez ontem no final de semana?",
      response: "Nossa, ontem eu fui na casa da minha vó comer aquele bolo de cenoura com cobertura de chocolate que ela sempre faz. Depois fiquei jogando videogame com meu irmão até tarde.",
      answer: "Human",
      explanation: "A resposta traz memórias afetivas humanas extremamente específicas e coloquiais, impossíveis de serem experienciadas de forma genuína por softwares."
    }
  ],
  medium: [
    {
      id: 1,
      prompt: "O que é o amor?",
      response: "O amor é uma complexa combinação de reações neuroquímicas no cérebro dos mamíferos terrestres. Ocorre a liberação de hormônios como oxitocina, dopamina e endorfinas, cujo propósito evolutivo principal é garantir o apego entre indivíduos para a reprodução da espécie.",
      answer: "AI",
      explanation: "A resposta é puramente científica, objetiva e desprovida de sensibilidade literária, reduzindo a emoção humana a reações hormonais e utilitarismo evolutivo."
    },
    {
      id: 2,
      prompt: "Como consertar um pneu furado do carro?",
      response: "Cara, primeiro de tudo, acha um lugar plano pra parar pra segurança. Puxa o freio de mão bem forte. Pega o macaco e o estepe lá atrás. Dá uma folgada nos parafusos da roda antes de subir o carro, senão ela vai ficar girando e vc não vai conseguir tirar kkkk.",
      answer: "Human",
      explanation: "Apresenta gírias ('Cara', 'vc'), abreviações coloquiais, e informalidades estruturais típicas de conversas humanas instantâneas."
    }
  ],
  hard: [
    {
      id: 1,
      prompt: "Qual a relação entre a consciência humana e a simulação computacional da inteligência?",
      response: "A consciência não reside na complexidade abstrata dos cálculos, mas na irredutibilidade da experiência vivida. Uma simulação computacional de inteligência opera tão somente no domínio da sintaxe — manipulando símbolos discretos segundo regras lógicas —, ao passo que a mente humana opera no domínio da semântica, onde o significado subjetivo emerge da vivência ontológica e da corporeidade do ser.",
      answer: "Human",
      explanation: "Esta resposta contém nuances filosóficas fenomenológicas profundas (inspiradas no argumento do Quarto Chinês de John Searle). A articulação da antítese entre 'sintaxe' e 'semântica' e o uso do termo 'corporeidade' são característicos do raciocínio analítico de filósofos humanos."
    },
    {
      id: 2,
      prompt: "Escreva uma reflexão sobre a percepção do tempo sob a ótica da física moderna.",
      response: "A linearidade temporal é uma ilusão cognitiva decorrente do nosso processamento sensorial limitado. Pela teoria da relatividade geral, o tempo é uma dimensão intrínseca ao tecido do espaço-tempo, onde passado, presente e futuro coexistem no bloco estático do universo quadridimensional. A entropia apenas direciona nossa percepção macroscópica de causalidade.",
      answer: "AI",
      explanation: "Apesar de formalmente bela, esta resposta apresenta uma compilação perfeitamente limpa e didática dos conceitos físicos de espaço-tempo e entropia. Ela segue a estrutura clássica de redação de IAs acadêmicas: síntese exata, ausência de voz autoral literária e conclusão didática concisa."
    }
  ]
};

const TuringTestGame = ({ onComplete, onBack, difficulty = "easy" }) => {
  const questions = QUESTIONS_TURING[difficulty] || QUESTIONS_TURING.easy;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedGuess, setSelectedGuess] = useState(null); // 'Human' or 'AI'
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, [difficulty]);

  const handleGuess = (guess) => {
    if (showExplanation) return;
    playClickSound();
    setSelectedGuess(guess);
    setShowExplanation(true);
    if (guess === questions[currentIndex].answer) {
      playSuccessSound();
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedGuess(null);
      setShowExplanation(false);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete({ score: score * (difficulty === "easy" ? 15 : difficulty === "medium" ? 30 : 50), timeSpent });
    }
  };

  const q = questions[currentIndex] || questions[0];
  const isCorrect = selectedGuess === q.answer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl w-full mx-auto bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-900 px-2.5 py-1 rounded-full font-bold font-sans">
            Teste de Turing • {difficulty === "easy" ? "🟢 Fácil" : difficulty === "hard" ? "🔴 Difícil" : "🟡 Médio"}
          </span>
          <span className="text-sm font-bold text-slate-450 font-sans">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="p-8 md:p-10 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-black text-white mb-2 flex items-center justify-center gap-2">
            <HelpCircle className="text-cyan-400" size={24} /> Humano ou Inteligência Artificial?
          </h2>
          <p className="text-slate-400 text-sm font-serif italic">Analise criticamente o prompt e o texto gerado para identificar o autor.</p>
        </div>

        {/* Chat UI Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 text-sm leading-relaxed max-w-2xl mx-auto w-full">
          {/* Prompt */}
          <div className="flex gap-3 items-start border-b border-slate-800/80 pb-4">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <User size={18} />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block mb-1 font-sans">PROMPT ENVIADO</span>
              <p className="text-slate-200 font-serif italic">"{q.prompt}"</p>
            </div>
          </div>

          {/* Response */}
          <div className="flex gap-3 items-start pt-2">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400">
              <HelpCircle size={18} />
            </div>
            <div>
              <span className="text-xs text-cyan-500 font-bold block mb-1 font-sans">RESPOSTA GERADA</span>
              <p className="text-cyan-100 italic bg-slate-950 p-4 rounded-xl border border-slate-800/60 mt-1 font-serif leading-relaxed">
                "{q.response}"
              </p>
            </div>
          </div>
        </div>

        {/* Guessing UI */}
        <AnimatePresence mode="wait">
          {!showExplanation ? (
            <motion.div
              key="guess-buttons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-4 justify-center max-w-md mx-auto w-full font-sans"
            >
              <button
                onClick={() => handleGuess("Human")}
                className="flex-1 py-4 px-6 bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700 hover:scale-102 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-lg transition-all"
              >
                <User size={20} className="text-slate-450" />
                Humano
              </button>
              <button
                onClick={() => handleGuess("AI")}
                className="flex-1 py-4 px-6 bg-cyan-950/40 border border-cyan-900/60 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-700 hover:scale-102 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-lg transition-all"
              >
                <Bot size={20} className="text-cyan-400" />
                Inteligência Artificial
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border-2 max-w-2xl mx-auto w-full font-sans ${
                isCorrect
                  ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-300"
                  : "bg-rose-950/20 border-rose-900/60 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className={isCorrect ? "text-emerald-400" : "text-rose-400"} size={24} />
                <h3 className="text-lg font-bold">
                  {isCorrect ? "Parabéns, você acertou!" : `Incorreto! O autor era: ${q.answer === "AI" ? "Inteligência Artificial" : "Humano"}`}
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-5 font-serif italic">
                {q.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-sm transition-all"
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

export default TuringTestGame;
