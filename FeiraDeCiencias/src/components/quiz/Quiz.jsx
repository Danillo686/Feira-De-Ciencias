import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { playClickSound } from "../../utils/sounds";

const questions = [
  {
    question: "O que é o conceito de 'Hallucination' em modelos de linguagem (LLMs)?",
    options: [
      "Quando a IA fica sem energia e para de responder.",
      "Quando o modelo gera informações falsas com alta confiança, como se fossem verdadeiras.",
      "Um efeito visual gerado por GPUs potentes.",
      "Um recurso criativo para gerar poesia e arte."
    ],
    answer: 1,
    explanation: "Alucinação é quando modelos como GPT geram respostas plausíveis mas incorretas — um dos maiores desafios de segurança da IA."
  },
  {
    question: "O que diferencia 'Machine Learning' de 'Deep Learning'?",
    options: [
      "Machine Learning usa regras manuais; Deep Learning não aprende nada.",
      "Deep Learning é uma subcategoria de ML que usa redes neurais artificiais com múltiplas camadas.",
      "Machine Learning é exclusivo para imagens; Deep Learning para textos.",
      "Não há diferença, são sinônimos."
    ],
    answer: 1,
    explanation: "Deep Learning é um subset de Machine Learning que usa redes neurais profundas (muitas camadas) para aprender padrões complexos nos dados."
  },
  {
    question: "O que é o 'Teste de Turing' e qual seu objetivo?",
    options: [
      "Medir a velocidade de processamento de uma CPU.",
      "Classificar IAs por nível de segurança cibernética.",
      "Avaliar se uma IA consegue imitar o comportamento humano a ponto de ser indistinguível.",
      "Verificar se um código está livre de bugs."
    ],
    answer: 2,
    explanation: "Proposto por Alan Turing em 1950, o teste avalia se uma máquina pode exibir comportamento inteligente indistinguível de um humano em conversação."
  },
  {
    question: "Qual algoritmo está por trás dos sistemas de recomendação do YouTube e Netflix?",
    options: [
      "Bubble Sort adaptado para conteúdo.",
      "Filtros de Colaboração e Aprendizado por Reforço.",
      "Pesquisa binária em tabelas de histórico.",
      "Algoritmos genéticos baseados em DNA."
    ],
    answer: 1,
    explanation: "Esses serviços usam Filtragem Colaborativa (comparando preferências de usuários similares) e Aprendizado por Reforço para otimizar o engajamento."
  },
  {
    question: "O que é 'Viés Algorítmico' (Algorithmic Bias) e por que é um problema crítico?",
    options: [
      "Quando um algoritmo é mais rápido que outros.",
      "Preferência do algoritmo por dados mais recentes.",
      "Quando padrões discriminatórios nos dados de treino fazem a IA reproduzir preconceitos em escala.",
      "Um erro de cálculo que desacelera o processamento."
    ],
    answer: 2,
    explanation: "Se os dados históricos contêm preconceitos raciais, de gênero ou socioeconômicos, a IA os aprende e amplifica, causando discriminação sistêmica em decisões de crédito, recrutamento e até justiça."
  },
  {
    question: "O que é 'Aprendizado por Reforço' (Reinforcement Learning)?",
    options: [
      "Um método onde a IA aprende exclusivamente com humanos supervisionando cada resposta.",
      "A IA aprende por tentativa e erro, recebendo recompensas ou penalidades pelas suas ações.",
      "Um processo de memorizar um banco de dados fixo.",
      "Treinar a IA com imagens de reforços físicos como pesos."
    ],
    answer: 1,
    explanation: "No Aprendizado por Reforço, um agente interage com um ambiente e aprende a maximizar recompensas acumuladas — técnica usada no AlphaGo e em IAs de jogos."
  },
  {
    question: "Qual foi o impacto da arquitetura 'Transformer' (2017) no campo da IA?",
    options: [
      "Permitiu criar robôs que se transformam como nos desenhos animados.",
      "Revolucionou o Processamento de Linguagem Natural (NLP), sendo a base do GPT, BERT e outros LLMs.",
      "Acelerou exclusivamente o processamento de imagens médicas.",
      "Tornou obsoletos todos os computadores anteriores a 2017."
    ],
    answer: 1,
    explanation: "O artigo 'Attention is All You Need' (2017) introduziu os Transformers com mecanismo de atenção, tornando possível treinar modelos gigantes como GPT-4 e Gemini."
  },
  {
    question: "O que é o 'Problema de Alinhamento' (AI Alignment) em sistemas de IA avançados?",
    options: [
      "Dificuldade em alinhar fisicamente componentes de hardware.",
      "Garantir que os objetivos e comportamentos de uma IA correspondam aos valores e intenções humanas.",
      "Sincronizar múltiplas GPUs para processamento paralelo.",
      "Traduzir código de IA entre linguagens de programação."
    ],
    answer: 1,
    explanation: "Alinhamento é o desafio de fazer com que sistemas de IA poderosos ajam de forma consistente com o que realmente queremos — não apenas com o que especificamos literalmente, prevenindo comportamentos inesperados."
  },
  {
    question: "O que caracteriza um 'Ataque Adversarial' em sistemas de IA de visão computacional?",
    options: [
      "Quando dois sistemas de IA competem entre si num torneio.",
      "Um ciberataque que desliga fisicamente os servidores de IA.",
      "Pequenas perturbações imperceptíveis ao humano em imagens que fazem a IA classificar erroneamente com alta confiança.",
      "Quando usuários reportam resultados incorretos à empresa."
    ],
    answer: 2,
    explanation: "Ataques adversariais exploram vulnerabilidades de redes neurais: pixels levemente alterados (invisíveis ao humano) podem fazer a IA identificar um stop sign como velocidade máxima, por exemplo."
  },
  {
    question: "Qual princípio ético da IA define que sistemas devem ser capazes de explicar suas decisões de forma compreensível?",
    options: [
      "Princípio da Velocidade Máxima.",
      "Explainability / Interpretabilidade (XAI — Explainable AI).",
      "Princípio da Caixa Preta Definitiva.",
      "Teoria da Redundância Neural."
    ],
    answer: 1,
    explanation: "Explainable AI (XAI) é crucial para confiança e responsabilidade: médicos precisam entender por que a IA diagnosticou um câncer, e juízes precisam entender por que ela recomendou uma sentença."
  }
];

const Quiz = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startTime] = useState(Date.now());

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return;
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
    }, 1400);
  };

  const progress = (currentQuestion / questions.length) * 100;
  const q = questions[currentQuestion];

  return (
    <div className="max-w-2xl w-full mx-auto">

      {/* Back + Progress Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{score} ponto{score !== 1 ? 's' : ''}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Question */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100 dark:border-slate-700">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Quiz de IA • Nível Avançado
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3 leading-snug">
            {q.question}
          </h3>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          {q.options.map((option, index) => {
            let cls =
              "w-full text-left px-5 py-4 rounded-xl border font-medium transition-all duration-200 text-sm leading-snug ";

            if (selectedOption === null) {
              cls += "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer";
            } else if (index === q.answer) {
              cls += "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-300";
            } else if (index === selectedOption) {
              cls += "bg-red-50 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-400";
            } else {
              cls += "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 opacity-60";
            }

            return (
              <button
                key={index}
                disabled={selectedOption !== null}
                onClick={() => handleOptionClick(index)}
                className={cls}
              >
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold
                    border-current">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation after answer */}
        {selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mb-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
          >
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">💡 Explicação</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{q.explanation}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Quiz;
