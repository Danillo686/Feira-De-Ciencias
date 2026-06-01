import { motion } from "framer-motion";
import { BookOpen, Activity, Briefcase, Glasses, Zap } from "lucide-react";

const benefits = [
  { id: 1, title: "Educação", icon: BookOpen, stat: 85, color: "bg-blue-500", desc: "Plataformas que adaptam o ensino ao ritmo do aluno." },
  { id: 2, title: "Saúde", icon: Activity, stat: 92, color: "bg-green-500", desc: "Descoberta de novos remédios e tratamentos personalizados." },
  { id: 3, title: "Trabalho", icon: Briefcase, stat: 78, color: "bg-yellow-500", desc: "Automação de tarefas chatas e repetitivas." },
  { id: 4, title: "Acessibilidade", icon: Glasses, stat: 88, color: "bg-purple-500", desc: "Leitores de tela e tradutores de libras em tempo real." },
  { id: 5, title: "Produtividade", icon: Zap, stat: 95, color: "bg-red-500", desc: "Geração de textos, imagens e códigos rapidamente." },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 px-6 relative z-10 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
            Como a IA <span className="text-primary font-bold">ajuda</span> a sociedade?
          </h2>
          <p className="text-xl text-slate-600">Os benefícios reais da adoção da tecnologia.</p>
        </motion.div>

        <div className="space-y-8">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-panel p-6 flex flex-col md:flex-row items-center gap-6"
              >
                <div className={`p-4 rounded-2xl ${item.color} bg-opacity-10 text-${item.color.replace('bg-', '').replace('-500', '')}-700`}>
                  <Icon size={32} />
                </div>
                
                <div className="flex-1 w-full text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2 text-slate-800">{item.title}</h3>
                  <p className="text-slate-600 mb-4 md:mb-0 font-medium">{item.desc}</p>
                </div>

                <div className="w-full md:w-1/3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-600">Aumento de Eficiência*</span>
                    <span className="text-sm font-bold text-slate-800">{item.stat}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className={`h-3 rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.stat}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1, type: "spring" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="text-center text-xs text-slate-500 mt-8 font-medium">*Estatísticas fictícias para fins de demonstração.</p>
      </div>
    </section>
  );
};

export default BenefitsSection;
