import { motion } from "framer-motion";
import { playClickSound } from "../../utils/sounds";

const difficulties = [
  {
    id: "easy",
    label: "Fácil",
    emoji: "🟢",
    color: "emerald",
    description: "Perguntas sobre IA no cotidiano e conceitos básicos.",
    detail: "Ideal para quem está começando a explorar o mundo da Inteligência Artificial.",
    questions: 10,
    points: "1 pt cada",
    borderClass: "border-emerald-200 dark:border-emerald-700 hover:border-emerald-500 dark:hover:border-emerald-500",
    activeBorder: "border-emerald-500",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    btnClass: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    id: "medium",
    label: "Médio",
    emoji: "🟡",
    color: "amber",
    description: "Conceitos intermediários de Machine Learning e IA.",
    detail: "Para quem já conhece o básico e quer aprofundar seus conhecimentos.",
    questions: 10,
    points: "1 pt cada",
    borderClass: "border-amber-200 dark:border-amber-700 hover:border-amber-500 dark:hover:border-amber-500",
    activeBorder: "border-amber-500",
    badgeBg: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    btnClass: "bg-amber-500 hover:bg-amber-600",
  },
  {
    id: "hard",
    label: "Difícil",
    emoji: "🔴",
    color: "rose",
    description: "Arquiteturas avançadas, ética, segurança e pesquisa em IA.",
    detail: "Nível avançado para especialistas e entusiastas da área.",
    questions: 10,
    points: "1 pt cada",
    borderClass: "border-rose-200 dark:border-rose-700 hover:border-rose-500 dark:hover:border-rose-500",
    activeBorder: "border-rose-500",
    badgeBg: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
    btnClass: "bg-rose-600 hover:bg-rose-700",
  },
];

const DifficultySelect = ({ onSelect, onBack, title = "Escolha a Dificuldade", subtitle = "Cada nível possui uma pontuação e ranking próprios." }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl w-full mx-auto"
    >
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden font-['Inter']">
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 px-8 pt-10 pb-8 text-center">
          <div className="text-5xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>

        <div className="p-6 space-y-4">
          {difficulties.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => { playClickSound(); onSelect(d.id); }}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group
                bg-slate-50 dark:bg-slate-900
                ${d.borderClass}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-0.5">{d.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{d.label}</h3>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-0.5">{d.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{d.detail}</p>
                </div>
                <div className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform text-lg font-bold flex-shrink-0">
                  →
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={() => { playClickSound(); onBack(); }}
            className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-all"
          >
            ← Voltar ao Login
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DifficultySelect;
