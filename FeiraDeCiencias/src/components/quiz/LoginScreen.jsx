import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound } from "../../utils/sounds";
import { LogIn, User, School, GraduationCap, BookOpen } from "lucide-react";

const LoginScreen = ({ onStart }) => {
  const [role, setRole] = useState("aluno"); // 'aluno' | 'professor'
  const [name, setName] = useState("");
  const [turma, setTurma] = useState("");

  useEffect(() => {
    // Carrega apenas se os valores salvos NÃO forem os defaults antigos
    const savedName = localStorage.getItem("ai_quiz_name") || "";
    const savedTurma = localStorage.getItem("ai_quiz_turma") || "";
    const savedRole = localStorage.getItem("ai_quiz_role") || "aluno";

    // Ignora valores legados "Danillo" / "Admin"
    const blocklist = ["danillo", "admin"];
    if (!blocklist.includes(savedName.toLowerCase())) setName(savedName);
    if (!blocklist.includes(savedTurma.toLowerCase())) setTurma(savedTurma);
    setRole(savedRole);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedTurma = turma.trim();

    if (!trimmedName) return;
    if (role === "aluno" && !trimmedTurma) return;

    playClickSound();
    localStorage.setItem("ai_quiz_name", trimmedName);
    localStorage.setItem("ai_quiz_turma", role === "aluno" ? trimmedTurma : "Professor");
    localStorage.setItem("ai_quiz_role", role);

    onStart({
      name: trimmedName,
      turma: role === "aluno" ? trimmedTurma : "Professor",
      role,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-md w-full mx-auto"
    >
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 px-8 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg mb-5">
            <LogIn size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Entrar nos Jogos</h2>
          <p className="text-slate-400 text-sm">
            Registre seus dados para participar do ranking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">

          {/* Role selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Você é...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { playClickSound(); setRole("aluno"); }}
                className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200
                  ${role === "aluno"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}
              >
                <GraduationCap size={24} />
                Aluno
              </button>
              <button
                type="button"
                onClick={() => { playClickSound(); setRole("professor"); }}
                className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200
                  ${role === "professor"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                  }`}
              >
                <BookOpen size={24} />
                Professor
              </button>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Nome ou Nickname
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Seu nome"
                required
                autoComplete="off"
              />
            </div>
          </div>

          {/* Turma — só aparece se for aluno */}
          <AnimatePresence>
            {role === "aluno" && (
              <motion.div
                key="turma-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-1">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Turma
                  </label>
                  <div className="relative">
                    <School size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={turma}
                      onChange={(e) => setTurma(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ex: 201-Administração"
                      required={role === "aluno"}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Começar Jogos
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginScreen;
