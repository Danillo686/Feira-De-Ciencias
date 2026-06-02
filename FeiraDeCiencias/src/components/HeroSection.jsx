import { motion } from "framer-motion";
import { playClickSound } from "../utils/sounds";

const HeroSection = ({ onStartGames }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-6 text-center pt-20 bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <motion.div 
        className="max-w-4xl w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6 inline-block">
          <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2 rounded-full text-sm font-semibold text-secondary dark:text-slate-400 tracking-wide uppercase shadow-sm">
            Feira de Ciências • Projeto Especial
          </span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-primary dark:text-white leading-tight"
          variants={itemVariants}
        >
          Inteligência Artificial: <br/> O Impacto no Nosso Futuro
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto font-normal leading-relaxed"
          variants={itemVariants}
        >
          Explore como a Inteligência Artificial está redefinindo a tecnologia, as profissões e a sociedade. Entenda os fundamentos, descubra os benefícios tangíveis e analise criticamente os desafios éticos e práticos que nos aguardam.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <button 
            onClick={() => {
              playClickSound();
              document.getElementById('present-ai').scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all font-medium text-lg flex items-center justify-center gap-2 group text-primary dark:text-white"
          >
            Explorar Artigos
            <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform text-accent dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              playClickSound();
              onStartGames();
            }}
            className="px-8 py-3 rounded-lg bg-slate-900 dark:bg-blue-600 hover:bg-slate-700 dark:hover:bg-blue-700 transition-colors font-medium text-lg text-white shadow-md flex items-center justify-center gap-2"
          >
            Acessar Jogos
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </motion.div>
      </motion.div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-white dark:from-slate-800/30 dark:via-slate-950 dark:to-slate-950 opacity-60"></div>
    </section>
  );
};

export default HeroSection;
