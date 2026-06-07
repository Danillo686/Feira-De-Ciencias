import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Edit2, Save, XCircle } from "lucide-react";
import { playClickSound } from "../../utils/sounds";
import { fetchRanking, deleteEntry, updateEntry, clearRanking } from "../../firebase";

const GAMES_LIST = [
  { id: 'quiz', label: 'Quiz da IA', emoji: '🧠' },
  { id: 'memory', label: 'Jogo da Memória', emoji: '🎴' },
  { id: 'scenarios', label: 'Impacto da IA', emoji: '🔍' },
  { id: 'hangman', label: 'Jogo da Forca', emoji: '🔤' },
  { id: 'scramble', label: 'Palavras Embaralhadas', emoji: '🔄' },
  { id: 'wordsearch', label: 'Caça-Palavras', emoji: '🧩' },
  { id: 'turing', label: 'Teste de Turing', emoji: '🤖' },
  { id: 'intruso', label: 'O Intruso', emoji: '❌' },
  { id: 'association', label: 'Conectar Pares', emoji: '🔗' },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Fácil', emoji: '🟢' },
  { id: 'medium', label: 'Médio', emoji: '🟡' },
  { id: 'hard', label: 'Difícil', emoji: '🔴' },
];

const AdminPanel = ({ onClose }) => {
  const [activeGame, setActiveGame] = useState('quiz');
  const [activeDifficulty, setActiveDifficulty] = useState('easy');
  const [ranking, setRanking] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);

  const activeTab = `${activeGame}_${activeDifficulty}`;

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
    const gameLabel = GAMES_LIST.find(g => g.id === activeGame)?.label || activeGame;
    const diffLabel = DIFFICULTIES.find(d => d.id === activeDifficulty)?.label || activeDifficulty;
    if (window.confirm(`PERIGO: Tem certeza que deseja apagar TODOS os jogadores do ranking de ${gameLabel} (${diffLabel})?`)) {
      await clearRanking(activeTab);
      await loadRanking(activeTab);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl w-full mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative font-['Inter']"
    >
      <button
        onClick={() => { playClickSound(); onClose(); }}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-750 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
      >
        <X size={24} />
      </button>

      {/* Header */}
      <div className="p-8 pb-4 border-b border-slate-150 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-display font-black text-rose-600 mb-1 font-sans">Painel de Administração</h2>
          <p className="text-slate-550 dark:text-slate-400 text-sm font-serif italic">Gerencie o banco de dados de pontuações de forma granular.</p>
        </div>

        <button
          onClick={handleClearAll}
          className="bg-rose-50 text-rose-650 border border-rose-200 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-xl transition-all duration-200 font-bold text-xs flex items-center gap-2"
        >
          <Trash2 size={16} />
          Zerar Ranking Atual
        </button>
      </div>

      {/* Selection Filters */}
      <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-700 flex flex-col gap-4">
        {/* Game selection */}
        <div>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Selecione o Jogo</span>
          <div className="flex flex-wrap gap-2">
            {GAMES_LIST.map(game => (
              <button
                key={game.id}
                onClick={() => { playClickSound(); setEditingId(null); setActiveGame(game.id); }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 ${
                  activeGame === game.id
                    ? 'bg-slate-800 dark:bg-blue-600 border-slate-850 dark:border-blue-650 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <span>{game.emoji}</span>
                {game.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="flex items-center gap-3 border-t border-slate-200/50 dark:border-slate-800 pt-3">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Dificuldade:</span>
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            {DIFFICULTIES.map(diff => (
              <button
                key={diff.id}
                onClick={() => { playClickSound(); setEditingId(null); setActiveDifficulty(diff.id); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDifficulty === diff.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {diff.emoji} {diff.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="p-8 max-h-[50vh] overflow-y-auto bg-white dark:bg-slate-800">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : ranking.length === 0 ? (
          <p className="text-center text-slate-450 dark:text-slate-500 py-12 font-medium">Nenhum jogador registrado neste jogo.</p>
        ) : (
          <div className="w-full text-left text-sm">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 mb-2 bg-slate-50 dark:bg-slate-900 rounded-t-xl">
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
                  <div key={id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-650 transition-colors">
                    {isEditing ? (
                      <>
                        <div className="col-span-3">
                          <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-3">
                          <input type="text" value={editForm.turma} onChange={e => setEditForm({ ...editForm, turma: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" value={editForm.score} onChange={e => setEditForm({ ...editForm, score: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-2">
                          <input type="number" value={editForm.timeSpent} onChange={e => setEditForm({ ...editForm, timeSpent: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-white text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button onClick={saveEdit} className="text-teal-600 hover:text-teal-700 p-2 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 rounded-lg hover:bg-teal-100 transition-colors">
                            <Save size={16} />
                          </button>
                          <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-700 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                            <XCircle size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-3 font-bold text-slate-800 dark:text-slate-200 truncate">{player.name}</div>
                        <div className="col-span-3 font-semibold text-slate-500 dark:text-slate-450 truncate">{player.turma}</div>
                        <div className="col-span-2 text-center font-black text-blue-600 dark:text-blue-400">{player.score}</div>
                        <div className="col-span-2 text-center font-bold text-slate-500 dark:text-slate-450">{player.timeSpent ? `${player.timeSpent}s` : '-'}</div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <button onClick={() => startEdit(player)} className="text-blue-600 hover:text-blue-700 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg hover:bg-blue-100 transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(player)} className="text-rose-600 hover:text-rose-700 p-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-lg hover:bg-rose-100 transition-colors">
                            <Trash2 size={16} />
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
