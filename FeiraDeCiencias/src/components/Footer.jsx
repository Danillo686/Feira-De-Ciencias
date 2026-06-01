import { playClickSound } from "../utils/sounds";

const Footer = ({ onStartGames }) => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-16 pb-8 px-6 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        
        {/* Créditos */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-primary mb-4">Projeto Inteligência Artificial</h2>
          <div className="text-slate-600 space-y-2">
            <p><span className="text-slate-800 font-semibold">Grupo:</span> Gustavo Wendel, Danillo Necchi e Eduardo Jorge</p>
            <p><span className="text-slate-800 font-semibold">Turma:</span> 201-Administração</p>
            <p><span className="text-slate-800 font-semibold">Escola:</span> Juscelino Kubitschek</p>
            <p><span className="text-slate-800 font-semibold">Professor Regente:</span> Gabriel</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center md:text-right flex flex-col items-center md:items-end">
          <p className="text-slate-600 font-medium mb-4">Teste seus conhecimentos agora!</p>
          <button 
            onClick={() => {
              playClickSound();
              onStartGames();
            }}
            className="px-8 py-3 rounded-lg bg-primary hover:bg-primary/90 transition-all font-bold text-lg shadow-md text-white"
          >
            Acessar Jogos Interativos
          </button>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500 font-medium">
        <p>&copy; 2026. Feira de Ciências - Escola Juscelino Kubitschek.</p>
      </div>
    </footer>
  );
};

export default Footer;
