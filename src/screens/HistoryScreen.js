import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getWorkoutHistory, clearHistory } from '../utils/storage';

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  async function loadHistory() {
    const data = await getWorkoutHistory();
    setHistory(data);
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }

  function handleClear() {
    Alert.alert(
      'Limpar histórico',
      'Tem certeza? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>Nenhum treino ainda</Text>
        <Text style={styles.emptyText}>
          Complete seu primeiro treino e ele vai aparecer aqui!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#555"
          />
        }
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              {history.length} {history.length === 1 ? 'treino' : 'treinos'}
            </Text>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearBtn}>Limpar</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardWorkoutName, { color: item.color }]}>
                {item.workoutName}
              </Text>
              <View style={[styles.checkBadge, { backgroundColor: item.color + '22' }]}>
                <Text style={[styles.checkText, { color: item.color }]}>✓ Completo</Text>
              </View>
            </View>
            <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
            <Text style={styles.cardTime}>
              {formatTime(item.date)} · {item.exerciseCount} exercícios
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  list: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  clearBtn: {
    color: '#EF4444',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardWorkoutName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  checkBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  checkText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDate: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  cardTime: {
    color: '#555',
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
