import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, AlertTriangle, Minus } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const SCENARIOS_EASY = [
  {
    id: 1,
    context: "🏥 Saúde e Medicina",
    scenario: "Um sistema de IA analisa radiografias de tórax e detecta sinais precoces de pneumonia de forma quase instantânea, auxiliando o médico plantonista no diagnóstico rápido.",
    type: "benefit",
    explanation: "Uso benéfico e direto de visão computacional na triagem hospitalar, acelerando diagnósticos simples e salvando vidas."
  },
  {
    id: 2,
    context: "📞 Chamadas e Golpes",
    scenario: "Criminosos usam inteligência artificial para clonar a voz de parentes de uma pessoa por telefone e pedir transferências financeiras urgentes em uma situação falsa de emergência.",
    type: "risk",
    explanation: "Risco grave e crescente de engenharia social facilitada por IA generativa de áudio, lesando pessoas vulneráveis."
  },
  {
    id: 3,
    context: "🎓 Aprendizado Personalizado",
    scenario: "Uma plataforma educacional ajusta as tarefas e o ritmo de leitura de matemática de acordo com as dificuldades e acertos individuais exibidos por cada estudante.",
    type: "benefit",
    explanation: "Ferramentas adaptativas de IA auxiliam na personalização do ensino, preenchendo lacunas de conhecimento de forma eficiente."
  },
  {
    id: 4,
    context: "🔒 Senhas e Contas",
    scenario: "Um software hacker de IA tenta adivinhar senhas de contas pessoais testando milhões de variações por segundo com base em dados públicos das redes sociais dos usuários.",
    type: "risk",
    explanation: "A IA pode potencializar ataques de força bruta, tornando senhas simples obsoletas e exigindo autenticação em duas etapas."
  },
  {
    id: 5,
    context: "🛍️ Recomendações online",
    scenario: "Um aplicativo de compras sugere produtos parecidos com os que você já comprou ou pesquisou anteriormente no seu navegador.",
    type: "neutral",
    explanation: "Algoritmos de recomendação oferecem praticidade ao usuário e aumentam as vendas, mas também podem incentivar o consumismo impulsivo."
  }
];

const SCENARIOS_MEDIUM = [
  {
    id: 1,
    context: "⚖️ Algoritmos Judiciais",
    scenario: "Um tribunal adota um algoritmo de IA para sugerir a duração de penas. O sistema dá sistematicamente recomendações de sentenças mais longas para réus negros do que brancos em casos idênticos.",
    type: "risk",
    explanation: "Caso COMPAS: Viés algorítmico derivado de bases de dados históricas discriminatórias perpetua o preconceito sistêmico sob uma falsa roupagem de neutralidade tecnológica."
  },
  {
    id: 2,
    context: "🧬 Biologia Molecular",
    scenario: "A IA AlphaFold prevê com precisão atômica a estrutura tridimensional de quase todas as proteínas catalogadas na Terra, publicando os resultados gratuitamente para cientistas mundiais.",
    type: "benefit",
    explanation: "Uma revolução científica que encurta anos de trabalho laboratorial, acelerando o desenvolvimento de novos medicamentos para câncer, malária e outras doenças."
  },
  {
    id: 3,
    context: "📱 Redes Sociais e Notícias",
    scenario: "Uma IA de recomendação prioriza posts com títulos sensacionalistas ou polarizadores porque percebe que eles retêm os usuários por mais tempo navegando na plataforma.",
    type: "risk",
    explanation: "A busca por engajamento alimenta a desinformação, o extremismo e a criação de bolhas ideológicas prejudiciais à democracia e ao debate social saudável."
  },
  {
    id: 4,
    context: "🚗 Veículos Autônomos",
    scenario: "Carros sem motorista circulam em grandes cidades. Estatisticamente, causam menos acidentes comuns que motoristas humanos distraídos, mas falham gravemente em situações raras e imprevistas.",
    type: "neutral",
    explanation: "Um caso misto. A automação reduz erros humanos (embriaguez, fadiga), mas cria novos dilemas de segurança e responsabilidade civil que a sociedade ainda tenta regulamentar."
  },
  {
    id: 5,
    context: "🎨 Mercado de Design",
    scenario: "IAs generativas criam logos, ilustrações corporativas e layouts em segundos por custos irrisórios, reduzindo o número de contratações de profissionais freelancer de design e artes visuais.",
    type: "risk",
    explanation: "Dilema econômico real. A tecnologia otimiza os custos operacionais de empresas, mas causa desemprego e desvaloriza a renda de profissionais criativos independentes."
  },
  {
    id: 6,
    context: "🌍 Eficiência Energética",
    scenario: "O Google usa algoritmos de aprendizado por reforço para controlar e otimizar os sistemas de resfriamento de seus data centers, reduzindo o consumo de energia da rede em 40%.",
    type: "benefit",
    explanation: "Mostra como a IA pode otimizar a infraestrutura física complexa para mitigar o impacto ambiental de grandes indústrias digitais."
  },
  {
    id: 7,
    context: "🤖 Atendimento ao Cliente",
    scenario: "Uma seguradora substitui sua central telefônica de atendentes humanos por chatbots com IA que resolvem 70% das dúvidas simples sem filas, mas não conseguem resolver casos complexos.",
    type: "neutral",
    explanation: "Aumenta a eficiência operacional e a velocidade do suporte para problemas padrão, mas gera frustração em usuários com demandas singulares e elimina empregos de nível básico."
  },
  {
    id: 8,
    context: "🩺 Triagem de Câncer",
    scenario: "Uma IA analisa exames dermatológicos e detecta sinais de melanoma (câncer de pele) com precisão comparável a especialistas, servindo como uma ferramenta auxiliar em clínicas públicas.",
    type: "benefit",
    explanation: "Democratização e apoio na medicina, reduzindo o gargalo de exames de imagem e acelerando o encaminhamento médico."
  }
];

const SCENARIOS_HARD = [
  {
    id: 1,
    context: "⚖️ Policiamento Preditivo",
    scenario: "Um algoritmo avalia a probabilidade de reincidência de crimes cruzando dados familiares e histórico de crédito do réu. Ele direciona o policiamento a áreas específicas, mas amplia disparidades raciais históricas nas áreas de baixa renda.",
    type: "risk",
    explanation: "Embora reduza crimes no papel, a IA foca a repressão em locais historicamente desfavorecidos, retroalimentando as mesmas bases estatísticas e punindo de forma injusta indivíduos pelo contexto socioeconômico."
  },
  {
    id: 2,
    context: "📱 Moderação de Discurso",
    scenario: "Uma IA remove discursos de ódio em tempo real em redes sociais. Ela reduz posts abusivos em 98%, mas censura erroneamente discussões acadêmicas legítimas e gírias de dialetos de minorias devido à baixa representatividade nos dados de treino.",
    type: "neutral",
    explanation: "Demonstra o limite ético da moderação automatizada: a incapacidade do algoritmo em capturar ironias, contextos históricos ou nuances culturais de grupos minoritários resulta em censura involuntária."
  },
  {
    id: 3,
    context: "🚗 Dilemas Éticos Autônomos",
    scenario: "Um veículo autônomo é programado de fábrica para priorizar a proteção de seus passageiros. Diante de uma colisão inevitável gerada por um pedestre imprudente, o veículo desvia em direção à calçada, atropelando transeuntes inocentes.",
    type: "risk",
    explanation: "Dilema clássico da ética de máquinas. A escolha racionalizada de sacrificar terceiros inocentes para proteger o comprador levanta discussões jurídicas graves sobre a moralidade do software proprietário."
  },
  {
    id: 4,
    context: "🔎 Reconhecimento e Vigilância",
    scenario: "Um governo implanta reconhecimento facial automatizado nas ruas para monitorar a circulação e prever surtos de doenças contagiosas. O surto é contido rapidamente, mas o sistema de rastreamento de dados de localização permanece ativo indefinidamente.",
    type: "risk",
    explanation: "Uso do estado de emergência para justificar a perda permanente de privacidade e o estabelecimento de um aparato estatal de vigilância em massa, sem consentimento explícito dos cidadãos."
  },
  {
    id: 5,
    context: "🎨 Otimização e Forense",
    scenario: "Um sistema pericial de IA reconstrói e gera detalhes em fotos borradas capturadas por câmeras de segurança antigas. A polícia usa as imagens ampliadas para processar suspeitos, mas a IA gerou traços faciais arbitrários que não existiam originalmente.",
    type: "risk",
    explanation: "Uso indevido de IA generativa em processos legais. Modelos gerativos preenchem espaços com estimativas estatísticas verossímeis, mas factualmente falsas, correndo o risco de fabricar evidências e incriminar inocentes."
  },
  {
    id: 6,
    context: "💼 Mercado de Alta Frequência",
    scenario: "Algoritmos de IA de trading executam transações financeiras em milissegundos. Eles maximizam o retorno financeiro de grandes fundos e melhoram a liquidez de mercado, mas causam 'flash crashes' inexplicáveis que destroem economias de pequenos poupadores.",
    type: "neutral",
    explanation: "A eficiência sistêmica de curto prazo da automação financeira é contrabalançada pela perda de controle humano direto, gerando instabilidades extremas e desvantagem estrutural para investidores físicos."
  },
  {
    id: 7,
    context: "🔬 IA de Duplo Uso",
    scenario: "Um software de IA projetado para descobrir novos medicamentos úteis é reprogramado por pesquisadores e, em 6 horas de execução autônoma, desenha 40.000 novas moléculas de armas químicas letais inéditas.",
    type: "risk",
    explanation: "O perigo do duplo uso tecnológico. O mesmo modelo generativo que decifra curas pode ser facilmente pivotado para sintetizar neurotoxinas perigosas, exigindo rigoroso controle ético e de acesso a repositórios."
  },
  {
    id: 8,
    context: "💬 Revisão de Textos Acadêmicos",
    scenario: "Cientistas utilizam modelos de linguagem generativa para revisar textos acadêmicos em inglês. O processo democratiza a escrita internacional, mas insere alucinações sutis e raciocínios pseudo-lógicos difíceis de rastrear na revisão por pares.",
    type: "neutral",
    explanation: "Embora remova barreiras de linguagem para cientistas estrangeiros, a IA introduz o risco de poluir repositórios acadêmicos com desinformações lógicas de alta plausibilidade superficial."
  },
  {
    id: 9,
    context: "🎓 Diagnóstico Psicológico",
    scenario: "Um chatbot oferece suporte de terapia virtual para pacientes de baixa renda. A IA reduz em 50% os relatos de ansiedade, mas ocasionalmente dá conselhos perigosos ou frios para pacientes exibindo tendências graves de automutilação.",
    type: "neutral",
    explanation: "Caso complexo. Fornece acesso básico e escalável a quem não pode pagar terapia humana, mas a falta de compreensão existencial real e empatia coloca em risco vidas em momentos de crise severa."
  },
  {
    id: 10,
    context: "🏥 Algoritmos de Alocação",
    scenario: "Uma IA aloca pacientes na fila de transplante renal. Ela reduz o tempo de internação geral maximizando a compatibilidade de sobrevida, mas exclui sistematicamente idosos ou portadores de outras comorbidades crônicas.",
    type: "neutral",
    explanation: "A IA aplica lógica utilitarista crua (maximizar anos de vida ganhos), mas essa abordagem matemática colide diretamente com princípios de equidade humana e direitos iguais ao tratamento de saúde."
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
    btnClass: "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-400 hover:bg-slate-500 dark:hover:bg-slate-600 hover:text-white hover:border-slate-500",
    resultBg: "bg-slate-100 dark:bg-slate-705/50 border-slate-300 dark:border-slate-600",
    resultText: "text-slate-800 dark:text-slate-350",
    icon: Minus,
  },
};

const OPTIONS = ["benefit", "risk", "neutral"];

const ScenarioGame = ({ onComplete, onBack, difficulty = "easy" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime] = useState(Date.now());

  const getScenarios = () => {
    switch (difficulty) {
      case "easy":
        return SCENARIOS_EASY;
      case "medium":
        return SCENARIOS_MEDIUM;
      case "hard":
      default:
        return SCENARIOS_HARD;
    }
  };

  const activeScenarios = getScenarios();
  const scenario = activeScenarios[currentIndex] || activeScenarios[0];
  const progress = (currentIndex / activeScenarios.length) * 100;

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
    if (currentIndex < activeScenarios.length - 1) {
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
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-400 dark:text-slate-500">Cenário</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {currentIndex + 1} / {activeScenarios.length}
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
            <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-sans">
              Impacto da IA • Classifique o Cenário
            </h2>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-650 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
              {scenario.context}
            </span>
          </div>
          <p className="text-xl md:text-2xl font-serif text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
            "{scenario.scenario}"
          </p>
        </div>

        {/* Answer label */}
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 text-center font-sans">
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
              className={`p-6 rounded-2xl border-2 ${isCorrect ? TYPE_CONFIG[scenario.type].resultBg : 'bg-slate-100 dark:bg-slate-705/50 border-slate-300 dark:border-slate-600'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{isCorrect ? '🎯' : '💡'}</span>
                <div>
                  <h3 className={`text-lg font-bold ${isCorrect ? correctConfig.resultText : 'text-slate-700 dark:text-slate-300'}`}>
                    {isCorrect ? 'Correto!' : `Incorreto — a resposta é "${correctConfig.emoji} ${correctConfig.label}"`}
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-750 dark:text-slate-300 mb-5 font-serif italic">
                {scenario.explanation}
              </p>

              <button
                onClick={handleNext}
                className="w-full px-8 py-3 bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-700 dark:hover:bg-white transition-colors shadow-sm"
              >
                {currentIndex < activeScenarios.length - 1 ? 'Próximo Cenário →' : 'Ver Resultado 🏆'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ScenarioGame;
