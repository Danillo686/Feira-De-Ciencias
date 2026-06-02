import { motion } from "framer-motion";
import { AlertTriangle, EyeOff, UserX, Cpu, Lock, Video } from "lucide-react";

const dangers = [
  { id: 1, title: "Desinformação Automatizada", icon: AlertTriangle, desc: "A geração de texto em larga escala facilita a criação de campanhas de desinformação altamente persuasivas, ameaçando a integridade de processos democráticos e a confiança pública." },
  { id: 2, title: "Mídias Sintéticas (Deepfakes)", icon: Video, desc: "Avanços em IA generativa permitem a clonagem de voz e rosto com hiper-realismo, sendo frequentemente utilizados para fraudes financeiras, extorsão e difamação." },
  { id: 3, title: "Erosão da Privacidade", icon: EyeOff, desc: "Modelos dependem de volumes colossais de dados de treinamento. A extração indiscriminada de dados pessoais levanta questões complexas sobre consentimento e vigilância algorítmica." },
  { id: 4, title: "Vieses Algorítmicos", icon: Cpu, desc: "Se treinados com dados não representativos, algoritmos podem perpetuar ou até amplificar preconceitos históricos em decisões de crédito, recrutamento e justiça criminal." },
  { id: 5, title: "Impactos Socioeconômicos", icon: UserX, desc: "Embora crie novos empregos, a transição é assimétrica. Profissões baseadas em tarefas previsíveis enfrentam risco iminente de obsolescência, exigindo políticas urgentes de requalificação." },
  { id: 6, title: "Armamento Cibernético", icon: Lock, desc: "Atacantes utilizam IA para automatizar a descoberta de vulnerabilidades (zero-day), criar malwares mutantes e orquestrar ataques de phishing de alta sofisticação." },
];

const DangersSection = () => {
  return (
    <section className="py-24 px-6 relative z-10 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 mb-6 border border-rose-100 dark:border-rose-800">
            <AlertTriangle size={36} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
            Desafios Éticos e <span className="text-rose-700 dark:text-rose-400">Riscos</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A inovação acelerada sem diretrizes regulatórias claras apresenta vulnerabilidades sistêmicas críticas para a sociedade contemporânea.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dangers.map((danger, index) => {
            const Icon = danger.icon;
            return (
              <motion.div
                key={danger.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-xl hover:border-rose-300 dark:hover:border-rose-700 transition-colors shadow-sm"
              >
                <div className="text-rose-700 dark:text-rose-400 mb-6 bg-rose-50 dark:bg-rose-900/30 inline-block p-3 rounded-lg">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{danger.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{danger.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DangersSection;
