import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Trash2, Edit2, Save, XCircle } from "lucide-react";
import { playClickSound } from "../../utils/sounds";

const GAMES = [
  { id: 'quiz', label: 'Quiz da IA' },
  { id: 'memory', label: 'Jogo da Memória' },
  { id: 'tf', label: 'Verdadeiro ou Falso' }
];

const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('quiz');
  const [ranking, setRanking] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadRanking(activeTab);
  }, [activeTab]);

  const loadRanking = (gameId) => {
    const saved = JSON.parse(localStorage.getItem(`ai_ranking_${gameId}`) || "[]");
    saved.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.timeSpent !== b.timeSpent) return (a.timeSpent || 999) - (b.timeSpent || 999);
      return new Date(b.date) - new Date(a.date);
    });
    
    const rankingWithIds = saved.map((item, index) => ({
      ...item,
      id: item.id || Date.now().toString() + index
    }));
    
    setRanking(rankingWithIds);
  };

  const saveToStorage = (newRanking) => {
    localStorage.setItem(`ai_ranking_${activeTab}`, JSON.stringify(newRanking));
    setRanking(newRanking);
  };

  const handleDelete = (id) => {
    playClickSound();
    if (window.confirm("Tem certeza que deseja deletar este jogador?")) {
      const newRanking = ranking.filter(p => p.id !== id);
      saveToStorage(newRanking);
    }
  };

  const startEdit = (player) => {
    playClickSound();
    setEditingId(player.id);
    setEditForm({ ...player });
  };

  const cancelEdit = () => {
    playClickSound();
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    playClickSound();
    const newRanking = ranking.map(p => {
      if (p.id === editingId) {
        return {
          ...p,
          name: editForm.name,
          turma: editForm.turma,
          score: parseInt(editForm.score) || 0,
          timeSpent: parseInt(editForm.timeSpent) || 0
        };
      }
      return p;
    });
    
    newRanking.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.timeSpent !== b.timeSpent) return (a.timeSpent || 999) - (b.timeSpent || 999);
      return new Date(b.date) - new Date(a.date);
    });

    saveToStorage(newRanking);
    setEditingId(null);
  };

  const clearAll = () => {
    playClickSound();
    if (window.confirm(`PERIGO: Tem certeza que deseja apagar TODOS os jogadores do ranking de ${GAMES.find(g => g.id === activeTab).label}?`)) {
      saveToStorage([]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl w-full mx-auto bg-white rounded-2xl formal-border shadow-lg overflow-hidden relative"
    >
      <button 
        onClick={() => {
          playClickSound();
          onClose();
        }}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors z-10"
      >
        <X size={24} />
      </button>

      <div className="p-8 pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-rose-600 mb-2">Painel de Administração</h2>
          <p className="text-slate-500">Edite ou remova jogadores do ranking selecionado.</p>
        </div>
        
        <button 
          onClick={clearAll}
          className="bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          <Trash2 size={18} />
          Zerar Ranking Atual
        </button>
      </div>

      <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-center md:justify-start gap-2">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => {
              playClickSound();
              setEditingId(null);
              setActiveTab(game.id);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === game.id ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            {game.label}
          </button>
        ))}
      </div>

      <div className="p-8 max-h-[50vh] overflow-y-auto bg-white">
        {ranking.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Nenhum jogador registrado neste jogo.</p>
        ) : (
          <div className="w-full text-left text-sm">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 mb-2 bg-slate-50 rounded-t-lg">
              <div className="col-span-3">Jogador</div>
              <div className="col-span-3">Turma</div>
              <div className="col-span-2 text-center">Pts</div>
              <div className="col-span-2 text-center">Tempo</div>
              <div className="col-span-2 text-right">Ações</div>
            </div>
            
            <div className="space-y-2">
              {ranking.map((player) => {
                const isEditing = editingId === player.id;
                
                return (
                  <div key={player.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg border border-slate-100 bg-white hover:border-slate-300 transition-colors">
                    {isEditing ? (
                      <>
                        <div className="col-span-3">
                          <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div className="col-span-3">
                          <input type="text" value={editForm.turma} onChange={e => setEditForm({...editForm, turma: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" value={editForm.score} onChange={e => setEditForm({...editForm, score: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" value={editForm.timeSpent} onChange={e => setEditForm({...editForm, timeSpent: e.target.value})} className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button onClick={saveEdit} className="text-teal-600 hover:text-teal-700 p-1.5 bg-teal-50 rounded-md hover:bg-teal-100 transition-colors">
                            <Save size={18} />
                          </button>
                          <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-700 p-1.5 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                            <XCircle size={18} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-3 font-semibold text-slate-800 truncate">{player.name}</div>
                        <div className="col-span-3 text-slate-500 truncate">{player.turma}</div>
                        <div className="col-span-2 text-center font-bold text-primary">{player.score}</div>
                        <div className="col-span-2 text-center font-medium text-slate-600">{player.timeSpent ? `${player.timeSpent}s` : '-'}</div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button onClick={() => startEdit(player)} className="text-blue-600 hover:text-blue-700 p-1.5 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(player.id)} className="text-rose-600 hover:text-rose-700 p-1.5 bg-rose-50 rounded-md hover:bg-rose-100 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminPanel;
