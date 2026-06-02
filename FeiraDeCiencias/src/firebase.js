// =====================================================
// CONFIGURAÇÃO DO FIREBASE
// =====================================================
// Leia o arquivo FIREBASE_SETUP.md para configurar!
// =====================================================
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, remove, onValue, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCYhSFhDO1aEgCArxE-G0UmGWXioCigZ-g",
  authDomain: "feira-e5730.firebaseapp.com",
  databaseURL: "https://feira-e5730-default-rtdb.firebaseio.com",
  projectId: "feira-e5730",
  storageBucket: "feira-e5730.firebasestorage.app",
  messagingSenderId: "104631321674",
  appId: "1:104631321674:web:025df28e178597bc1fd2b3",
  measurementId: "G-2ZQTZNJCSP"
};

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (e) {
  console.warn('Firebase não configurado. Usando localStorage como fallback.');
}

// Gera um ID único por jogador (nome + turma normalizados)
export const getPlayerId = (name, turma) => {
  return (name.trim().toLowerCase() + '_' + turma.trim().toLowerCase())
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

// Salva ou atualiza um score no ranking global
// Só atualiza se o novo score for melhor
export const saveScore = async (gameKey, playerData) => {
  if (!db) return saveScoreLocal(gameKey, playerData);

  const playerId = getPlayerId(playerData.name, playerData.turma);
  const entryRef = ref(db, `rankings/${gameKey}/${playerId}`);

  try {
    const snapshot = await get(entryRef);
    if (snapshot.exists()) {
      const existing = snapshot.val();
      // Só atualiza se o novo score for MELHOR
      const isBetter =
        playerData.score > existing.score ||
        (playerData.score === existing.score && playerData.timeSpent < (existing.timeSpent || 9999));
      if (!isBetter) return;
    }
    await set(entryRef, {
      ...playerData,
      playerId,
      date: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Erro ao salvar no Firebase:', e);
    saveScoreLocal(gameKey, playerData);
  }
};

// Ouve mudanças no ranking em tempo real
export const listenRanking = (gameKey, callback) => {
  if (!db) {
    callback(getRankingLocal(gameKey));
    return () => {};
  }
  const rankingRef = ref(db, `rankings/${gameKey}`);
  const unsubscribe = onValue(rankingRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list = Object.entries(data).map(([key, val]) => ({ ...val, _key: key }));
    list.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if ((a.timeSpent || 9999) !== (b.timeSpent || 9999)) return (a.timeSpent || 9999) - (b.timeSpent || 9999);
      return new Date(b.date) - new Date(a.date);
    });
    callback(list.slice(0, 15));
  });
  return unsubscribe;
};

// Deleta uma entrada (admin)
export const deleteEntry = async (gameKey, playerId) => {
  if (!db) return deleteEntryLocal(gameKey, playerId);
  const entryRef = ref(db, `rankings/${gameKey}/${playerId}`);
  await remove(entryRef);
};

// Atualiza uma entrada (admin)
export const updateEntry = async (gameKey, playerId, data) => {
  if (!db) return updateEntryLocal(gameKey, playerId, data);
  const entryRef = ref(db, `rankings/${gameKey}/${playerId}`);
  await update(entryRef, data);
};

// Busca ranking uma vez (para admin)
export const fetchRanking = async (gameKey) => {
  if (!db) return getRankingLocal(gameKey);
  const rankingRef = ref(db, `rankings/${gameKey}`);
  const snapshot = await get(rankingRef);
  const data = snapshot.val() || {};
  const list = Object.entries(data).map(([key, val]) => ({ ...val, _key: key }));
  list.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if ((a.timeSpent || 9999) !== (b.timeSpent || 9999)) return (a.timeSpent || 9999) - (b.timeSpent || 9999);
    return new Date(b.date) - new Date(a.date);
  });
  return list;
};

// Apaga todo o ranking de um jogo (admin)
export const clearRanking = async (gameKey) => {
  if (!db) {
    localStorage.removeItem(`ai_ranking_${gameKey}`);
    return;
  }
  const rankingRef = ref(db, `rankings/${gameKey}`);
  await remove(rankingRef);
};

// =====================================================
// FALLBACK: localStorage (caso Firebase não configurado)
// =====================================================
const saveScoreLocal = (gameKey, playerData) => {
  const key = `ai_ranking_${gameKey}`;
  const playerId = getPlayerId(playerData.name, playerData.turma);
  const saved = JSON.parse(localStorage.getItem(key) || '{}');
  const existing = saved[playerId];
  if (!existing ||
    playerData.score > existing.score ||
    (playerData.score === existing.score && playerData.timeSpent < (existing.timeSpent || 9999))) {
    saved[playerId] = { ...playerData, playerId, date: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(saved));
  }
};

const getRankingLocal = (gameKey) => {
  const key = `ai_ranking_${gameKey}`;
  const saved = JSON.parse(localStorage.getItem(key) || '{}');
  const list = Object.values(saved);
  list.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if ((a.timeSpent || 9999) !== (b.timeSpent || 9999)) return (a.timeSpent || 9999) - (b.timeSpent || 9999);
    return new Date(b.date) - new Date(a.date);
  });
  return list.slice(0, 15);
};

const deleteEntryLocal = (gameKey, playerId) => {
  const key = `ai_ranking_${gameKey}`;
  const saved = JSON.parse(localStorage.getItem(key) || '{}');
  delete saved[playerId];
  localStorage.setItem(key, JSON.stringify(saved));
};

const updateEntryLocal = (gameKey, playerId, data) => {
  const key = `ai_ranking_${gameKey}`;
  const saved = JSON.parse(localStorage.getItem(key) || '{}');
  if (saved[playerId]) {
    saved[playerId] = { ...saved[playerId], ...data };
    localStorage.setItem(key, JSON.stringify(saved));
  }
};

export { db };
