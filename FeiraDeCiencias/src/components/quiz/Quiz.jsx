import { useState } from "react";
import { motion } from "framer-motion";
import { playClickSound } from "../../utils/sounds";

const questions = [
  {
    question: "O que é Inteligência Artificial?",
    options: [
      "Um robô de metal.",
      "Sistemas capazes de simular o comportamento e raciocínio humano.",
      "Um tipo de computador antigo.",
      "Um site de buscas na internet."
    ],
    answer: 1
  },
  {
    question: "Onde a IA já é bastante utilizada hoje em dia?",
    options: [
      "Apenas em filmes de ficção científica.",
      "Apenas em laboratórios da NASA.",
      "Nos smartphones, redes sociais e assistentes de voz.",
      "Ainda não existe no mundo real."
    ],
    answer: 2
  },
  {
    question: "O que é um Deepfake?",
    options: [
      "Um mergulho profundo na internet.",
      "Áudios ou vídeos falsos gerados por IA muito realistas.",
      "Um antivírus de computador.",
      "Uma rede social nova."
    ],
    answer: 1
  },
  {
    question: "Como a IA pode ajudar na Medicina?",
    options: [
      "Diagnosticando doenças e sugerindo tratamentos.",
      "Contaminando os pacientes com vírus virtuais.",
      "Substituindo completamente todos os hospitais.",
      "A IA não é usada na medicina."
    ],
    answer: 0
  },
  {
    question: "Qual destes é um risco potencial da IA?",
    options: [
      "As pessoas ficarem mais inteligentes do nada.",
      "Geração excessiva de empregos difíceis.",
      "Criação e disseminação rápida de fake news.",
      "A internet ficar mais rápida."
    ],
    answer: 2
  },
  {
    question: "Como a Netflix e o Spotify usam a IA?",
    options: [
      "Para gravar filmes e músicas sozinhas.",
      "Para recomendar conteúdos que você provavelmente vai gostar.",
      "Para cobrar mais caro a mensalidade.",
      "Para apagar as suas playlists antigas."
    ],
    answer: 1
  },
  {
    question: "O que os carros autônomos usam para dirigir sozinhos?",
    options: [
      "Magia e ímãs.",
      "Cordas invisíveis nas estradas.",
      "Apenas GPS de celular.",
      "Câmeras, sensores e IA para analisar o ambiente."
    ],
    answer: 3
  },
  {
    question: "Assistentes virtuais como Alexa e Siri são exemplos de IA?",
    options: [
      "Sim, elas usam processamento de linguagem natural.",
      "Não, são apenas gravadores de voz.",
      "Não, existe uma pessoa real respondendo do outro lado.",
      "Sim, mas elas só funcionam no espaço."
    ],
    answer: 0
  },
  {
    question: "A Inteligência Artificial pode substituir o trabalho humano?",
    options: [
      "Sim, pode automatizar tarefas, mudando o mercado de trabalho.",
      "Não, a IA não consegue fazer absolutamente nada de útil.",
      "Sim, amanhã todos estaremos desempregados.",
      "Não, robôs não conseguem se mexer."
    ],
    answer: 0
  },
  {
    question: "O que é necessário para a IA não ser um perigo no futuro?",
    options: [
      "Desligar a internet mundial.",
      "Regulamentação, ética e uso consciente.",
      "Proibir a criação de computadores.",
      "Não precisamos fazer nada."
    ],
    answer: 1
  }
];

const Quiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startTime] = useState(Date.now());

  const handleOptionClick = (index) => {
    playClickSound();
    setSelectedOption(index);
    
    const isCorrect = index === questions[currentQuestion].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        onComplete({ score: score + (isCorrect ? 1 : 0), timeSpent });
      }
    }, 1000);
  };

  const progress = ((currentQuestion) / questions.length) * 100;

  return (
    <div className="max-w-2xl w-full mx-auto">
      {/* Barra de Progresso */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div 
            className="bg-primary h-2 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <motion.div 
        key={currentQuestion}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="glass-panel p-8 rounded-3xl"
      >
        <h3 className="text-2xl font-bold text-white mb-8">
          {questions[currentQuestion].question}
        </h3>

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => {
            let buttonClass = "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300 hover:text-white hover:border-primary/50";
            
            if (selectedOption !== null) {
              if (index === questions[currentQuestion].answer) {
                buttonClass = "bg-green-500/20 border-green-500 text-green-400";
              } else if (index === selectedOption) {
                buttonClass = "bg-red-500/20 border-red-500 text-red-400";
              } else {
                buttonClass = "bg-white/5 border-white/10 opacity-50";
              }
            }

            return (
              <button
                key={index}
                disabled={selectedOption !== null}
                onClick={() => handleOptionClick(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${buttonClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Quiz;
