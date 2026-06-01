import { motion } from "framer-motion";
import { playClickSound } from "../utils/sounds";

const HeroSection = ({ onStartQuiz }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const text = "Inteligência Artificial: o futuro já começou";
  const textVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-6 text-center pt-20">
      <motion.div 
        className="max-w-4xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6 inline-block">
          <span className="glass-panel px-4 py-1.5 rounded-full text-sm font-medium text-primary border-primary/20">
            Projeto Feira de Ciências
          </span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
          variants={textVariants}
        >
          {text.split("").map((char, index) => (
            <motion.span key={index} variants={letterVariants} className={char === " " ? "mr-3" : "text-primary font-bold"}>
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p 
          className="text-lg md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium"
          variants={itemVariants}
        >
          Descubra como a IA está transformando nosso dia a dia, conheça seus benefícios incríveis e entenda os riscos para o nosso futuro.
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
            className="px-8 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 transition-all font-semibold text-lg flex items-center justify-center gap-2 group text-slate-700 shadow-sm"
          >
            Explorar Conteúdo
            <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              playClickSound();
              onStartQuiz();
            }}
            className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 transition-all font-semibold text-lg shadow-md text-white"
          >
            Fazer Quiz
          </button>
        </motion.div>
      </motion.div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-[120px]"></div>
    </section>
  );
};

export default HeroSection;
