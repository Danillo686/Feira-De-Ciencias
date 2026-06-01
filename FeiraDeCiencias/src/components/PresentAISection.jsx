import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Share2, Play, Car, MessageSquare, Mic, Stethoscope, Gamepad2, Shield } from "lucide-react";
import { playClickSound } from "../utils/sounds";

const aiApps = [
  { id: 1, title: "Celulares", icon: Smartphone, desc: "Câmeras que ajustam a luz automaticamente e reconhecimento facial." },
  { id: 2, title: "Redes Sociais", icon: Share2, desc: "Algoritmos que decidem quais vídeos ou posts mostrar para você." },
  { id: 3, title: "Netflix / Spotify", icon: Play, desc: "Recomendações baseadas no que você já assistiu ou ouviu." },
  { id: 4, title: "Carros Inteligentes", icon: Car, desc: "Sistemas de piloto automático e sensores para evitar colisões." },
  { id: 5, title: "Chatbots", icon: MessageSquare, desc: "Atendimento automático em sites de lojas e empresas." },
  { id: 6, title: "Assistentes Virtuais", icon: Mic, desc: "Alexa, Siri e Google Assistant respondendo perguntas e comandos." },
  { id: 7, title: "Medicina", icon: Stethoscope, desc: "IA ajudando a analisar exames e detectar doenças precocemente." },
  { id: 8, title: "Jogos", icon: Gamepad2, desc: "NPCs inteligentes que se adaptam ao estilo de jogo do jogador." },
  { id: 9, title: "Segurança", icon: Shield, desc: "Reconhecimento de padrões em câmeras para detectar atividades suspeitas." },
];

const PresentAISection = () => {
  const [activeId, setActiveId] = useState(null);

  return (
    <section id="present-ai" className="py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
            Onde a <span className="text-primary font-bold">IA</span> já está presente?
          </h2>
          <p className="text-xl text-slate-600">Ela já faz parte da nossa rotina, mesmo que a gente não perceba.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                className={`glass-panel p-6 cursor-pointer transition-all duration-300 ${isActive ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary/20 text-primary">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">{app.title}</h3>
                </div>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-slate-600 mt-2 border-t border-slate-200 pt-4 font-medium">
                        {app.desc}
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
