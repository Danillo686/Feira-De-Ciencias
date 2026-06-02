import { motion } from "framer-motion";

const timelineEvents = [
  { year: "Curto Prazo", title: "Integração Multimodal", desc: "Modelos capazes de processar e relacionar texto, áudio, vídeo e dados sensoriais em tempo real, tornando interações homem-máquina quase indistinguíveis do diálogo natural." },
  { year: "Médio Prazo", title: "Agentes Autônomos", desc: "Sistemas capazes de não apenas responder, mas planejar, orquestrar e executar fluxos de trabalho complexos, negociando entre si para resolver problemas logísticos e científicos." },
  { year: "Longo Prazo", title: "Simbiose Humano-Máquina", desc: "Avanços em interfaces cérebro-computador (BCIs) permitindo comunicação direta, levantando debates profundos sobre a redefinição da cognição e identidade humana." },
  { year: "Especulativo", title: "Inteligência Artificial Geral (AGI)", desc: "A emergência de sistemas com capacidade de aprendizado e generalização superior à inteligência humana em qualquer domínio cognitivo." },
];

const FutureTimelineSection = () => {
  return (
    <section className="py-24 px-6 relative z-10 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
            Projeções para o <span className="text-primary dark:text-blue-400">Futuro</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            As trajetórias prováveis da evolução da Inteligência Artificial e seus possíveis pontos de inflexão tecnológica.
          </p>
        </motion.div>

        <div className="relative">
          {/* Linha central */}
          <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-700 -translate-x-[50%]"></div>

          <div className="space-y-12 md:space-y-20">
            {timelineEvents.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="relative flex flex-col md:flex-row items-center justify-between w-full">
                  {/* Ponto na linha (desktop) */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="hidden md:block absolute left-[50%] w-5 h-5 rounded-full bg-white dark:bg-slate-950 border-[3px] border-primary dark:border-blue-500 -translate-x-[50%] z-10 shadow-sm"
                  ></motion.div>

                  {/* Conteúdo Esquerda */}
                  <div className={`w-full md:w-[45%] mb-8 md:mb-0 ${isEven ? 'md:text-right md:pr-8' : 'md:opacity-0 md:order-last'}`}>
                    {(!isEven ? 'block md:hidden' : 'block') && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-8 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-sm font-bold text-accent dark:text-blue-400 uppercase tracking-widest mb-3">{event.year}</h3>
                        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{event.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{event.desc}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Conteúdo Direita */}
                  <div className={`w-full md:w-[45%] ${!isEven ? 'md:text-left md:pl-8' : 'md:opacity-0 md:hidden'}`}>
                    {!isEven && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm p-8 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-sm font-bold text-secondary dark:text-slate-400 uppercase tracking-widest mb-3">{event.year}</h3>
                        <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{event.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{event.desc}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureTimelineSection;
