import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { playClickSound } from "../../utils/sounds";

const LoginScreen = ({ onStart }) => {
  const [name, setName] = useState("");
  const [turma, setTurma] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("ai_quiz_name") || "";
    const savedTurma = localStorage.getItem("ai_quiz_turma") || "";
    setName(savedName);
    setTurma(savedTurma);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && turma.trim()) {
      playClickSound();
      localStorage.setItem("ai_quiz_name", name);
      localStorage.setItem("ai_quiz_turma", turma);
      onStart({ name, turma });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-md w-full mx-auto glass-panel p-8 rounded-3xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Entrar no <span className="text-primary">Quiz</span></h2>
      <p className="text-gray-400 text-center mb-8">Digite seus dados para participar do ranking global.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nome ou Nickname</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            placeholder="Seu nome"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Turma</label>
          <input 
            type="text" 
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            placeholder="Ex: 201-Administração"
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-primary hover:bg-primary/80 text-black font-bold text-lg py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] mt-4"
        >
          Começar Quiz
        </button>
      </form>
    </motion.div>
  );
};

export default LoginScreen;
