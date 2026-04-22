import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { WORKOUTS } from '../data/workouts';

const MOTIVATIONAL = [
  'Hoje é dia de descanso — aproveite para recuperar! 💜',
  'Seu corpo está crescendo enquanto descansa. Aproveite!',
  'Descanso faz parte do treino. Você merece!',
  'Recuperação é progresso. Descanse bem, Bruna!',
];

export default function HomeScreen({ navigation }) {
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [isRestDay, setIsRestDay] = useState(false);
  const [motivational, setMotivational] = useState('');

  useEffect(() => {
    const day = new Date().getDay();
    const workout = WORKOUTS[day];
    if (workout) {
      setTodayWorkout(workout);
      setIsRestDay(false);
    } else {
      setIsRestDay(true);
      setMotivational(MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]);
    }
  }, []);

  if (isRestDay) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.restContainer}>
          <Text style={styles.restEmoji}>🛌</Text>
          <Text style={styles.restTitle}>Dia de Descanso</Text>
          <Text style={styles.restMessage}>{motivational}</Text>
        </View>
      </View>
    );
  }

  if (!todayWorkout) return null;

  const totalSets = todayWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { borderColor: todayWorkout.color }]}>
        <Text style={styles.dayLabel}>{todayWorkout.day}</Text>
        <Text style={[styles.workoutName, { color: todayWorkout.color }]}>
          {todayWorkout.name}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{todayWorkout.exercises.length}</Text>
            <Text style={styles.statLabel}>exercícios</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalSets}</Text>
            <Text style={styles.statLabel}>séries totais</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>O que vem por aí</Text>
      {todayWorkout.exercises.map((ex, idx) => (
        <View key={ex.id} style={styles.exerciseRow}>
          <View style={[styles.exerciseNumber, { backgroundColor: todayWorkout.color + '33' }]}>
            <Text style={[styles.exerciseNumberText, { color: todayWorkout.color }]}>
              {idx + 1}
            </Text>
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseMeta}>
              {ex.sets}x · {ex.reps} · {ex.load}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: todayWorkout.color }]}
        onPress={() => navigation.navigate('Workout', { workout: todayWorkout })}
        activeOpacity={0.85}
      >
        <Text style={styles.startButtonText}>Iniciar Treino</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
  },
  dayLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  workoutName: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#333',
  },
  sectionTitle: {
    color: '#555',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 15,
    fontWeight: '700',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#ddd',
    fontSize: 15,
    fontWeight: '600',
  },
  exerciseMeta: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  startButton: {
    marginTop: 28,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  restContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  restEmoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  restTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  restMessage: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
