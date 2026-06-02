import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Trash2, Edit2, Save, XCircle } from "lucide-react";
import { playClickSound } from "../../utils/sounds";
import { fetchRanking, deleteEntry, updateEntry, clearRanking } from "../../firebase";

const GAMES = [
  { id: 'quiz_easy', label: '🟢 Quiz Fácil' },
  { id: 'quiz_medium', label: '🟡 Quiz Médio' },
  { id: 'quiz_hard', label: '🔴 Quiz Difícil' },
  { id: 'memory', label: '🎴 Memória' },
  { id: 'scenarios', label: '🔍 Impacto da IA' },
];

const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('quiz_hard');
  const [ranking, setRanking] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRanking(activeTab);
  }, [activeTab]);

  const loadRanking = async (gameId) => {
    setLoading(true);
    try {
      const data = await fetchRanking(gameId);
      setRanking(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (player) => {
    playClickSound();
    if (window.confirm(`Tem certeza que deseja deletar "${player.name}"?`)) {
      await deleteEntry(activeTab, player._key || player.playerId);
      await loadRanking(activeTab);
    }
  };

  const startEdit = (player) => {
    playClickSound();
    setEditingId(player._key || player.playerId);
    setEditForm({ ...player });
  };

  const cancelEdit = () => {
    playClickSound();
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    playClickSound();
    const id = editingId;
    await updateEntry(activeTab, id, {
      name: editForm.name,
      turma: editForm.turma,
      score: parseInt(editForm.score) || 0,
      timeSpent: parseInt(editForm.timeSpent) || 0,
    });
    setEditingId(null);
    await loadRanking(activeTab);
  };

  const handleClearAll = async () => {
    playClickSound();
    const gameLabel = GAMES.find(g => g.id === activeTab)?.label || activeTab;
    if (window.confirm(`PERIGO: Tem certeza que deseja apagar TODOS os jogadores do ranking de ${gameLabel}?`)) {
      await clearRanking(activeTab);
      await loadRanking(activeTab);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl w-full mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden relative"
    >
      <button
        onClick={() => { playClickSound(); onClose(); }}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors z-10"
      >
        <X size={24} />
      </button>

      <div className="p-8 pb-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-rose-600 mb-2">Painel de Administração</h2>
          <p className="text-slate-500 dark:text-slate-400">Edite ou remova jogadores do ranking selecionado.</p>
        </div>

        <button
          onClick={handleClearAll}
          className="bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          <Trash2 size={18} />
          Zerar Ranking Atual
        </button>
      </div>

      <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex flex-wrap justify-center md:justify-start gap-2">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => { playClickSound(); setEditingId(null); setActiveTab(game.id); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors text-xs ${
              activeTab === game.id
                ? 'bg-slate-800 dark:bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
            }`}
          >
            {game.label}
          </button>
        ))}
      </div>

      <div className="p-8 max-h-[50vh] overflow-y-auto bg-white dark:bg-slate-800">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : ranking.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">Nenhum jogador registrado neste jogo.</p>
        ) : (
          <div className="w-full text-left text-sm">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 mb-2 bg-slate-50 dark:bg-slate-900 rounded-t-lg">
              <div className="col-span-3">Jogador</div>
              <div className="col-span-3">Turma</div>
              <div className="col-span-2 text-center">Pts</div>
              <div className="col-span-2 text-center">Tempo</div>
              <div className="col-span-2 text-right">Ações</div>
            </div>

            <div className="space-y-2">
              {ranking.map((player) => {
                const id = player._key || player.playerId;
                const isEditing = editingId === id;

                return (
                  <div key={id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                    {isEditing ? (
                      <>
                        <div className="col-span-3">
                          <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-3">
                          <input type="text" value={editForm.turma} onChange={e => setEditForm({ ...editForm, turma: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" value={editForm.score} onChange={e => setEditForm({ ...editForm, score: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1 text-slate-800 dark:text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" value={editForm.timeSpent} onChange={e => setEditForm({ ...editForm, timeSpent: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-2 py-1 text-slate-800 dark:text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button onClick={saveEdit} className="text-teal-600 hover:text-teal-700 p-1.5 bg-teal-50 dark:bg-teal-900/30 rounded-md hover:bg-teal-100 transition-colors">
                            <Save size={18} />
                          </button>
                          <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-700 p-1.5 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 transition-colors">
                            <XCircle size={18} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-3 font-semibold text-slate-800 dark:text-slate-200 truncate">{player.name}</div>
                        <div className="col-span-3 text-slate-500 dark:text-slate-400 truncate">{player.turma}</div>
                        <div className="col-span-2 text-center font-bold text-blue-600 dark:text-blue-400">{player.score}</div>
                        <div className="col-span-2 text-center font-medium text-slate-600 dark:text-slate-400">{player.timeSpent ? `${player.timeSpent}s` : '-'}</div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button onClick={() => startEdit(player)} className="text-blue-600 hover:text-blue-700 p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(player)} className="text-rose-600 hover:text-rose-700 p-1.5 bg-rose-50 dark:bg-rose-900/30 rounded-md hover:bg-rose-100 transition-colors">
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
