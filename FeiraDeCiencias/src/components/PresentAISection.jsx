import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Share2, Play, Car, MessageSquare, Mic, Stethoscope, Gamepad2, Shield } from "lucide-react";
import { playClickSound } from "../utils/sounds";

const aiApps = [
  { id: 1, title: "Dispositivos Móveis", icon: Smartphone, desc: "Processadores neurais em smartphones otimizam desde a vida útil da bateria até o processamento computacional de fotografias em tempo real, realizando trilhões de operações por segundo." },
  { id: 2, title: "Mídias Sociais", icon: Share2, desc: "Algoritmos de aprendizado de máquina analisam o comportamento do usuário para curar feeds personalizados, prever tendências e até mesmo moderar conteúdos sensíveis automaticamente." },
  { id: 3, title: "Streaming e Entretenimento", icon: Play, desc: "Sistemas de recomendação complexos utilizam filtragem colaborativa para sugerir filmes e músicas, retendo a atenção do usuário baseando-se em padrões de consumo globais." },
  { id: 4, title: "Condução Autônoma", icon: Car, desc: "Veículos utilizam redes neurais convolucionais e fusão de sensores (LIDAR, radar, câmeras) para navegar no trânsito, tomar decisões em frações de segundo e evitar acidentes." },
  { id: 5, title: "Atendimento Corporativo", icon: MessageSquare, desc: "Modelos de Linguagem de Grande Escala (LLMs) assumiram o suporte ao cliente, sendo capazes de compreender contexto, traduzir idiomas e resolver problemas complexos sem intervenção humana." },
  { id: 6, title: "Assistentes Pessoais", icon: Mic, desc: "Processamento de Linguagem Natural avançado permite que assistentes compreendam nuances do tom de voz e contexto, automatizando tarefas domésticas integradas à Internet das Coisas (IoT)." },
  { id: 7, title: "Avanços Médicos", icon: Stethoscope, desc: "Sistemas de IA hoje conseguem detectar anomalias em exames de imagem (como radiografias e ressonâncias) com precisão frequentemente superior à de especialistas humanos, auxiliando no diagnóstico precoce." },
  { id: 8, title: "Indústria de Jogos", icon: Gamepad2, desc: "A IA não controla apenas os NPCs, mas é usada para geração procedural de mundos inteiros e adaptação dinâmica da dificuldade com base na habilidade cognitiva do jogador." },
  { id: 9, title: "Segurança Pública", icon: Shield, desc: "Visão computacional e análise preditiva são empregadas no monitoramento urbano para identificar padrões de comportamento atípicos e coordenar respostas a incidentes com maior eficiência." },
];

const PresentAISection = () => {
  const [activeId, setActiveId] = useState(null);

  return (
    <section id="present-ai" className="py-24 px-6 relative z-10 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
            A Presença Atual da <span className="text-primary">IA</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A Inteligência Artificial já deixou de ser ficção científica e atua silenciosamente nos bastidores das nossas interações tecnológicas diárias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiApps.map((app, index) => {
            const Icon = app.icon;
            const isActive = activeId === app.id;

            return (
               <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  playClickSound();
                  setActiveId(isActive ? null : app.id);
                }}
                className={`bg-white border border-slate-200 rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-sm ${isActive ? 'ring-2 ring-primary/20 shadow-md border-primary/40' : 'hover:shadow-md hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-lg bg-slate-100 text-slate-700">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">{app.title}</h3>
                </div>
                
                <AnimatePresence>
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-slate-600 mt-4 text-sm leading-relaxed">
                        {app.desc}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4"
                    >
                      <p className="text-primary text-sm font-medium flex items-center gap-1">
                        Ler mais
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PresentAISection;
