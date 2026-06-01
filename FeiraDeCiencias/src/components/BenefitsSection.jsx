import { motion } from "framer-motion";
import { BookOpen, Activity, Briefcase, Glasses, Zap } from "lucide-react";

const benefits = [
  { id: 1, title: "Revolução Educacional", icon: BookOpen, stat: 85, color: "bg-blue-600", desc: "Plataformas de ensino adaptativo utilizam IA para mapear lacunas de conhecimento de alunos individualmente, personalizando trilhas de estudo e promovendo maior equidade no aprendizado." },
  { id: 2, title: "Avanços na Medicina", icon: Activity, stat: 92, color: "bg-teal-600", desc: "Algoritmos aceleram a descoberta de novos fármacos e auxiliam em cirurgias robóticas de alta precisão, além de prever epidemias analisando vastos conjuntos de dados epidemiológicos." },
  { id: 3, title: "Transformação do Trabalho", icon: Briefcase, stat: 78, color: "bg-indigo-600", desc: "A automação de processos robóticos (RPA) combinada com IA assume tarefas repetitivas, permitindo que profissionais foquem em atividades que exigem criatividade, estratégia e empatia." },
  { id: 4, title: "Inclusão e Acessibilidade", icon: Glasses, stat: 88, color: "bg-violet-600", desc: "Avanços em visão computacional e síntese de voz geram ferramentas transformadoras, como descritores de ambiente em tempo real para deficientes visuais e tradução simultânea de libras." },
  { id: 5, title: "Otimização Científica", icon: Zap, stat: 95, color: "bg-sky-600", desc: "Aceleração exponencial de pesquisas científicas, como o mapeamento de estruturas proteicas (ex: AlphaFold), resolvendo em dias problemas biológicos que levariam décadas." },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 px-6 relative z-10 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
            Impactos Positivos na <span className="text-primary">Sociedade</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Quando aplicada com ética e responsabilidade, a IA atua como um amplificador das capacidades humanas.
          </p>
        </motion.div>

        <div className="space-y-8">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white formal-border rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8"
              >
                <div className={`p-4 rounded-xl ${item.color} text-white shadow-md flex-shrink-0`}>
                  <Icon size={32} />
                </div>
                
                <div className="flex-1 w-full text-center md:text-left">
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>

                <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Aumento Estimado*</span>
                    <span className="text-sm font-bold text-slate-900">{item.stat}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      className={`h-2.5 rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.stat}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 1.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="text-center text-sm text-slate-500 mt-10">*Estimativas representativas baseadas em estudos recentes de adoção tecnológica.</p>
      </div>
    </section>
  );
};

export default BenefitsSection;
