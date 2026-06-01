import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowLeft } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const QUESTIONS = [
  { id: 1, text: "A Inteligência Artificial pode sentir emoções verdadeiras como os humanos.", isTrue: false, explanation: "IAs apenas simulam empatia baseadas em padrões de texto, mas não têm sentimentos reais." },
  { id: 2, text: "Existem IAs que conseguem diagnosticar certas doenças com mais precisão que médicos humanos.", isTrue: true, explanation: "Modelos de visão computacional têm demonstrado precisão superior na análise de exames como raios-X e ressonâncias." },
  { id: 3, text: "Se uma IA cometer um crime, ela será presa e julgada no tribunal.", isTrue: false, explanation: "IAs não têm personalidade jurídica. A responsabilidade recai sobre os criadores ou usuários da ferramenta." },
  { id: 4, text: "Já existem músicas criadas inteiramente por IA que fizeram sucesso nas plataformas de streaming.", isTrue: true, explanation: "Artistas e produtores já utilizam IA para gerar instrumentais e até emular vozes de cantores famosos." },
  { id: 5, text: "A Inteligência Artificial vai inevitavelmente destruir todos os empregos humanos no futuro.", isTrue: false, explanation: "Embora a IA automatize tarefas e mude o mercado, ela também cria novas profissões e ferramentas que amplificam o trabalho humano." },
  { id: 6, text: "Algoritmos de IA podem herdar preconceitos e vieses dos dados com os quais foram treinados.", isTrue: true, explanation: "Se os dados históricos tiverem viés (ex: racismo ou sexismo), a IA pode replicar e até amplificar esses comportamentos." }
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl w-full mx-auto bg-white rounded-2xl formal-border shadow-sm overflow-hidden"
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
          <p className="text-sm font-medium text-slate-500">Questão <span className="text-primary font-bold">{currentQuestion + 1}</span> de {QUESTIONS.length}</p>
        </div>
      </div>

      <div className="p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Isso é IA?</h2>
          <p className="text-2xl md:text-3xl font-semibold text-slate-800 leading-relaxed min-h-[120px] flex items-center justify-center">
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
                className="flex-1 py-4 px-6 bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-600 hover:text-white rounded-xl font-bold text-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Check size={24} />
                Verdadeiro
              </button>
              <button 
                onClick={() => handleAnswer(false)}
                className="flex-1 py-4 px-6 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl font-bold text-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <X size={24} />
                Falso
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="explanation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-xl border ${lastAnswerCorrect ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${lastAnswerCorrect ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                  {lastAnswerCorrect ? <Check size={24} /> : <X size={24} />}
                </div>
                <h3 className="text-xl font-bold">
                  {lastAnswerCorrect ? "Correto!" : "Incorreto!"}
                </h3>
              </div>
              <p className="text-lg opacity-90 mb-6">{q.explanation}</p>
              
              <div className="text-center">
                <button 
                  onClick={handleNext}
                  className="px-8 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors shadow-sm"
                >
                  {currentQuestion < QUESTIONS.length - 1 ? "Próxima Questão" : "Ver Resultado"}
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
