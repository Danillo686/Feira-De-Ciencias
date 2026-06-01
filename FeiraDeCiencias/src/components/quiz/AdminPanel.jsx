import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Trash2, Edit2, Save, XCircle } from "lucide-react";
import { playClickSound } from "../../utils/sounds";

const AdminPanel = ({ onClose }) => {
  const [ranking, setRanking] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = () => {
    const saved = JSON.parse(localStorage.getItem("ai_quiz_ranking") || "[]");
    // Ordenar do mesmo jeito do ranking
    saved.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.timeSpent !== b.timeSpent) return (a.timeSpent || 999) - (b.timeSpent || 999);
      return new Date(b.date) - new Date(a.date);
    });
    
    // Adicionar um ID artificial para edição se não existir
    const rankingWithIds = saved.map((item, index) => ({
      ...item,
      id: item.id || Date.now().toString() + index
    }));
    
    setRanking(rankingWithIds);
  };

  const saveToStorage = (newRanking) => {
    localStorage.setItem("ai_quiz_ranking", JSON.stringify(newRanking));
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
    
    // Reordenar após edição
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
    if (window.confirm("PERIGO: Tem certeza que deseja apagar TODOS os jogadores? Essa ação não pode ser desfeita.")) {
      saveToStorage([]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl w-full mx-auto glass-panel rounded-3xl overflow-hidden relative"
    >
      <button 
        onClick={() => {
          playClickSound();
          onClose();
        }}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors z-10"
      >
        <X size={24} />
      </button>

      <div className="p-8 pb-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-red-500 mb-2">Painel de Administração</h2>
          <p className="text-gray-400">Edite ou remova jogadores do ranking.</p>
        </div>
        <button 
          onClick={clearAll}
          className="bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition-colors font-medium flex items-center gap-2"
        >
          <Trash2 size={18} />
          Zerar Ranking
        </button>
      </div>

      <div className="p-8 max-h-[60vh] overflow-y-auto">
        {ranking.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum jogador registrado ainda.</p>
        ) : (
          <div className="w-full text-left text-sm">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-white/10 mb-2">
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
                  <div key={player.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    {isEditing ? (
                      <>
                        <div className="col-span-3">
                          <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white" />
                        </div>
                        <div className="col-span-3">
                          <input type="text" value={editForm.turma} onChange={e => setEditForm({...editForm, turma: e.target.value})} className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" value={editForm.score} onChange={e => setEditForm({...editForm, score: e.target.value})} className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-center" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" value={editForm.timeSpent} onChange={e => setEditForm({...editForm, timeSpent: e.target.value})} className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-center" />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button onClick={saveEdit} className="text-green-400 hover:text-green-300 p-1 bg-green-400/10 rounded">
                            <Save size={18} />
                          </button>
                          <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-300 p-1 bg-white/10 rounded">
                            <XCircle size={18} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-3 font-medium text-white truncate">{player.name}</div>
                        <div className="col-span-3 text-gray-400 truncate">{player.turma}</div>
                        <div className="col-span-2 text-center font-bold text-primary">{player.score}</div>
                        <div className="col-span-2 text-center text-gray-300">{player.timeSpent ? `${player.timeSpent}s` : '-'}</div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button onClick={() => startEdit(player)} className="text-blue-400 hover:text-blue-300 p-1 bg-blue-400/10 rounded transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(player.id)} className="text-red-400 hover:text-red-300 p-1 bg-red-400/10 rounded transition-colors">
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
