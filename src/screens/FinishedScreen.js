import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MESSAGES = [
  'Arrasou, Bruna! 💪',
  'Mais um treino no bolso! 🔥',
  'Consistência é tudo. Você é incrível!',
  'Missão cumprida! Glúteos agradecidos 🍑',
  'Treino concluído! Hora de recuperar!',
];

export default function FinishedScreen({ route, navigation }) {
  const { workout } = route.params;
  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏆</Text>
      <Text style={[styles.title, { color: workout.color }]}>Treino Finalizado!</Text>
      <Text style={styles.workoutName}>{workout.name}</Text>
      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: workout.color }]}
        onPress={() => navigation.navigate('MainTabs')}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Voltar ao Início</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Histórico' })}
      >
        <Text style={styles.historyBtnText}>Ver Histórico</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  workoutName: {
    color: '#888',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  message: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  historyBtn: {
    paddingVertical: 12,
  },
  historyBtnText: {
    color: '#666',
    fontSize: 15,
  },
});
