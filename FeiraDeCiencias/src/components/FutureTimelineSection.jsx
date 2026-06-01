import { motion } from "framer-motion";

const timelineEvents = [
  { year: "Hoje", title: "IA Generativa", desc: "Criação de textos, imagens e códigos quase instantaneamente." },
  { year: "2026", title: "Assistentes Pessoais Avançados", desc: "IAs que agem como tutores, médicos e conselheiros 24h." },
  { year: "2030", title: "Automação Física", desc: "Robôs humanoides realizando tarefas domésticas e perigosas." },
  { year: "Futuro", title: "AGI (IA Geral)", desc: "Uma inteligência artificial capaz de aprender qualquer tarefa intelectual que um humano pode." },
];

const FutureTimelineSection = () => {
  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
            O <span className="text-primary font-bold">Futuro</span> da IA
          </h2>
          <p className="text-xl text-slate-600">O que nos aguarda nos próximos anos?</p>
        </motion.div>

        <div className="relative">
          {/* Linha central */}
          <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent -translate-x-[50%] opacity-20"></div>
          <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-slate-300 -translate-x-[50%]"></div>

          <div className="space-y-16">
            {timelineEvents.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="relative flex items-center justify-between w-full">
                  {/* Ponto na linha */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="absolute left-[50%] w-6 h-6 rounded-full bg-white border-4 border-primary -translate-x-[50%] z-10 shadow-sm"
                  ></motion.div>

                  {/* Conteúdo Esquerda */}
                  <div className={`w-5/12 ${isEven ? 'text-right pr-8' : 'opacity-0'}`}>
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-panel p-6"
                      >
                        <h3 className="text-3xl font-bold text-primary mb-2">{event.year}</h3>
                        <h4 className="text-xl font-semibold text-slate-800 mb-2">{event.title}</h4>
                        <p className="text-slate-600 font-medium">{event.desc}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Conteúdo Direita */}
                  <div className={`w-5/12 ${!isEven ? 'text-left pl-8' : 'opacity-0'}`}>
                    {!isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-panel p-6 border-secondary/50 shadow-[0_0_15px_rgba(188,19,254,0.1)]"
                      >
                        <h3 className="text-3xl font-bold text-secondary mb-2">{event.year}</h3>
                        <h4 className="text-xl font-semibold text-slate-800 mb-2">{event.title}</h4>
                        <p className="text-slate-600 font-medium">{event.desc}</p>
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
