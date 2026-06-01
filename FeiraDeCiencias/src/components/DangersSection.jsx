import { motion } from "framer-motion";
import { AlertTriangle, EyeOff, UserX, Cpu, Lock, Video } from "lucide-react";

const dangers = [
  { id: 1, title: "Fake News", icon: AlertTriangle, desc: "Textos gerados por IA espalhando desinformação em massa." },
  { id: 2, title: "Deepfakes", icon: Video, desc: "Vídeos e áudios falsos muito realistas usados para golpes." },
  { id: 3, title: "Perda de Privacidade", icon: EyeOff, desc: "Coleta excessiva de dados pessoais para treinar os modelos." },
  { id: 4, title: "Dependência Tecnológica", icon: Cpu, desc: "Pessoas perdendo a capacidade de pensar e criar sozinhas." },
  { id: 5, title: "Desemprego", icon: UserX, desc: "Substituição de trabalhadores humanos por sistemas automatizados." },
  { id: 6, title: "Uso Criminoso", icon: Lock, desc: "Hackers usando IA para criar vírus mais avançados." },
];

const DangersSection = () => {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="absolute inset-0 bg-red-50 -z-10"></div>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-block p-4 rounded-full bg-red-100 text-red-600 mb-4">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
            Os <span className="text-red-600 font-bold">Perigos</span> da IA
          </h2>
          <p className="text-xl text-slate-600">O lado sombrio do avanço tecnológico rápido e sem regulamentação.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dangers.map((danger, index) => {
            const Icon = danger.icon;
            return (
              <motion.div
                key={danger.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white border border-red-200 p-8 rounded-2xl shadow-sm hover:border-red-400 transition-colors"
              >
                <div className="text-red-600 mb-6">
                  <Icon size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{danger.title}</h3>
                <p className="text-slate-600 font-medium">{danger.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DangersSection;
