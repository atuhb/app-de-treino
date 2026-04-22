import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@treino_history';

export async function saveWorkoutHistory(entry) {
  try {
    const existing = await getWorkoutHistory();
    const updated = [entry, ...existing];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao salvar histórico:', e);
  }
}

export async function getWorkoutHistory() {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erro ao ler histórico:', e);
    return [];
  }
}

export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Erro ao limpar histórico:', e);
  }
}
