import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, AlertTriangle, Minus } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

// =====================================================
// CENÁRIOS: Como a IA nos Ajuda, Prejudica ou é Neutra
// =====================================================
const SCENARIOS = [
  {
    id: 1,
    context: "🏥 Saúde",
    scenario: "Um sistema de IA analisa tomografias e identifica tumores cancerígenos com 94% de precisão — antes mesmo do radiologista, acelerando o diagnóstico em semanas.",
    type: "benefit",
    explanation: "Este é um caso real de IA salvando vidas! Ferramentas como o DeepMind AlphaFold e sistemas de visão computacional já são usadas em hospitais para detectar câncer precocemente, aumentando as chances de cura."
  },
  {
    id: 2,
    context: "⚖️ Justiça",
    scenario: "Um tribunal americano usa um algoritmo de IA para recomendar a duração das penas de prisioneiros. O sistema foi descoberto sistematicamente dando penas mais longas para réus negros.",
    type: "risk",
    explanation: "Este é o caso real do algoritmo COMPAS. Viés algorítmico na justiça é um dos problemas éticos mais graves da IA — perpetuando e ampliando discriminação racial histórica em decisões que afetam vidas."
  },
  {
    id: 3,
    context: "🎓 Educação",
    scenario: "Uma plataforma de ensino usa IA para adaptar o conteúdo ao ritmo de aprendizado de cada aluno, apresentando exercícios mais difíceis quando o aluno acerta e revisões quando ele erra.",
    type: "benefit",
    explanation: "Educação personalizada com IA (como Khan Academy e Duolingo) permite que cada aluno aprenda no seu ritmo ideal — algo impossível numa sala de aula tradicional com um professor para 30 alunos."
  },
  {
    id: 4,
    context: "📱 Privacidade",
    scenario: "Uma rede social usa IA para analisar padrões de comportamento dos usuários e vender essas informações para seguradoras, que usam os dados para negar planos de saúde a pessoas consideradas 'de risco'.",
    type: "risk",
    explanation: "Este cenário ilustra o risco real de vigilância por IA e uso não transparente de dados. Sem regulação, as empresas podem usar dados pessoais de formas prejudiciais que o usuário nunca imaginaria."
  },
  {
    id: 5,
    context: "🌍 Meio Ambiente",
    scenario: "Uma IA da Google está sendo usada para otimizar o resfriamento de data centers, reduzindo o consumo de energia em 40% — economizando o equivalente à energia de milhares de casas.",
    type: "benefit",
    explanation: "A IA de gestão energética da DeepMind/Google já economiza energia real. Ironicamente, a IA também consome muita energia — mas quando bem aplicada, pode contribuir significativamente para a sustentabilidade."
  },
  {
    id: 6,
    context: "🛡️ Segurança Digital",
    scenario: "Criminosos usam IA para criar deepfakes de vídeo de CEOs de empresas ordenando transferências bancárias urgentes. Várias empresas já perderam milhões de dólares nesse golpe.",
    type: "risk",
    explanation: "Golpes com deepfake já causaram perdas de milhões de dólares. Em 2020, criminosos usaram deepfake de voz para enganar um funcionário bancário a transferir $35 milhões. É uma ameaça real e crescente."
  },
  {
    id: 7,
    context: "🚗 Mobilidade",
    scenario: "Carros autônomos com IA já rodaram milhões de quilômetros nos EUA. Em algumas métricas, eles causam menos acidentes que motoristas humanos — mas ainda existem casos fatais.",
    type: "neutral",
    explanation: "Carros autônomos são um caso genuinamente misto: dados mostram que são mais seguros em muitos cenários, mas ainda cometem erros. A tecnologia está em desenvolvimento e o debate sobre segurança é legítimo e complexo."
  },
  {
    id: 8,
    context: "🎨 Criatividade",
    scenario: "Uma IA generativa cria logotipos, ilustrações e designs profissionais em segundos por apenas $1 — levando freelancers a perderem clientes e renda de projetos que antes valiam centenas de dólares.",
    type: "risk",
    explanation: "O impacto da IA generativa no mercado de design e arte já é real. Artistas e designers estão perdendo trabalho para ferramentas como Midjourney e Adobe Firefly. É um desafio econômico e ético sem solução fácil."
  },
  {
    id: 9,
    context: "🧬 Medicina",
    scenario: "O AlphaFold 2 da DeepMind previu a estrutura 3D de mais de 200 milhões de proteínas — o que levaria décadas de pesquisa laboratorial — em apenas alguns meses. Resultados publicados gratuitamente.",
    type: "benefit",
    explanation: "O AlphaFold resolveu um problema de 50 anos da biologia. Pesquisadores do mundo inteiro agora podem acelerar a descoberta de medicamentos para doenças como Alzheimer, malária e câncer usando esses dados gratuitamente."
  },
  {
    id: 10,
    context: "🔍 Informação",
    scenario: "Mecanismos de busca usam IA para ranquear resultados, priorizando conteúdos que cada usuário tende a clicar. Isso pode criar 'bolhas de informação' onde pessoas só veem o que já concordam.",
    type: "neutral",
    explanation: "O efeito de câmara de eco das redes sociais e buscadores é real, mas o debate sobre quanto a IA contribui para isso (vs. escolhas humanas) ainda está em aberto. É um risco sério que merece atenção, mas sem evidências definitivas."
  }
];

const TYPE_CONFIG = {
  benefit: {
    label: "Benefício",
    emoji: "✅",
    color: "emerald",
    btnClass: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white hover:border-emerald-500",
    resultBg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700",
    resultText: "text-emerald-800 dark:text-emerald-300",
    icon: Zap,
  },
  risk: {
    label: "Risco",
    emoji: "⚠️",
    color: "rose",
    btnClass: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-400 hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white hover:border-rose-500",
    resultBg: "bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700",
    resultText: "text-rose-800 dark:text-rose-300",
    icon: AlertTriangle,
  },
  neutral: {
    label: "Neutro / Misto",
    emoji: "🔄",
    color: "slate",
    btnClass: "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-500 dark:hover:bg-slate-600 hover:text-white hover:border-slate-500",
    resultBg: "bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600",
    resultText: "text-slate-800 dark:text-slate-300",
    icon: Minus,
  },
};

const OPTIONS = ["benefit", "risk", "neutral"];

const ScenarioGame = ({ onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime] = useState(Date.now());

  const scenario = SCENARIOS[currentIndex];
  const progress = (currentIndex / SCENARIOS.length) * 100;

  const handleAnswer = (type) => {
    if (showExplanation) return;
    playClickSound();
    setSelected(type);
    setShowExplanation(true);
    if (type === scenario.type) {
      playSuccessSound();
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete({ score, timeSpent });
    }
  };

  const correctConfig = TYPE_CONFIG[scenario.type];
  const isCorrect = selected === scenario.type;

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
            <p className="text-xs text-slate-400 dark:text-slate-500">Cenário</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {currentIndex + 1} / {SCENARIOS.length}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
            🎯 {score} pts
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
      <div className="p-8 md:p-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Impacto da IA • Classifique o Cenário
            </h2>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-semibold">
              {scenario.context}
            </span>
          </div>
          <p className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
            {scenario.scenario}
          </p>
        </div>

        {/* Answer label */}
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 text-center">
          Este cenário representa um...
        </p>

        <AnimatePresence mode="wait">
          {!showExplanation ? (
            <motion.div
              key="buttons"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {OPTIONS.map((type) => {
                const cfg = TYPE_CONFIG[type];
                const Icon = cfg.icon;
                return (
                  <button
                    key={type}
                    onClick={() => handleAnswer(type)}
                    className={`py-5 px-4 border-2 rounded-2xl font-bold text-base transition-all duration-200 flex flex-col items-center gap-2 shadow-sm ${cfg.btnClass}`}
                  >
                    <span className="text-2xl">{cfg.emoji}</span>
                    <span>{cfg.label}</span>
                    <Icon size={18} className="opacity-60" />
                  </button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="explanation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border-2 ${isCorrect ? TYPE_CONFIG[scenario.type].resultBg : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{isCorrect ? '🎯' : '💡'}</span>
                <div>
                  <h3 className={`text-lg font-bold ${isCorrect ? correctConfig.resultText : 'text-slate-700 dark:text-slate-300'}`}>
                    {isCorrect ? 'Correto!' : `Incorreto — a resposta é "${correctConfig.emoji} ${correctConfig.label}"`}
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-5">
                {scenario.explanation}
              </p>

              <button
                onClick={handleNext}
                className="w-full px-8 py-3 bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-700 dark:hover:bg-white transition-colors shadow-sm"
              >
                {currentIndex < SCENARIOS.length - 1 ? 'Próximo Cenário →' : 'Ver Resultado 🏆'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ScenarioGame;
