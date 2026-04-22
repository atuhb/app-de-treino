import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { WORKOUTS } from '../data/workouts';

const WEEKDAYS = [
  { key: 0, label: 'Domingo', emoji: '☀️' },
  { key: 1, label: 'Segunda', emoji: '🌙' },
  { key: 2, label: 'Terça', emoji: '🌙' },
  { key: 3, label: 'Quarta', emoji: '🌙' },
  { key: 4, label: 'Quinta', emoji: '🌙' },
  { key: 5, label: 'Sexta', emoji: '🌙' },
  { key: 6, label: 'Sábado', emoji: '✨' },
];

export default function WeekScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  
  const currentWorkout = WORKOUTS[selectedDay];
  const isRestDay = !currentWorkout;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📅 Semana de Treino</Text>
      </View>

      {/* Week Days Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.weekTabs}
        contentContainerStyle={styles.weekTabsContent}
      >
        {WEEKDAYS.map((day) => {
          const isSelected = day.key === selectedDay;
          const dayWorkout = WORKOUTS[day.key];
          
          return (
            <TouchableOpacity
              key={day.key}
              onPress={() => setSelectedDay(day.key)}
              style={[
                styles.dayTab,
                isSelected && styles.dayTabActive,
                !dayWorkout && styles.dayTabRest,
              ]}
            >
              <Text style={styles.dayEmoji}>{day.emoji}</Text>
              <Text 
                style={[
                  styles.dayLabel,
                  isSelected && styles.dayLabelActive,
                ]}
              >
                {day.label.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {isRestDay ? (
          <View style={styles.restContainer}>
            <Text style={styles.restEmoji}>🛌</Text>
            <Text style={styles.restTitle}>Dia de Descanso</Text>
            <Text style={styles.restMessage}>
              Aproveite para recuperar o corpo e voltar com energia!
            </Text>
          </View>
        ) : (
          <>
            {/* Workout Header */}
            <View style={[styles.workoutHeader, { borderColor: currentWorkout.color }]}>
              <Text style={[styles.workoutName, { color: currentWorkout.color }]}>
                {currentWorkout.name}
              </Text>
              <View style={styles.workoutStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{currentWorkout.exercises.length}</Text>
                  <Text style={styles.statLabel}>exercícios</Text>
                </View>
                <Text style={styles.statSeparator}>•</Text>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {currentWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0)}
                  </Text>
                  <Text style={styles.statLabel}>séries</Text>
                </View>
              </View>
            </View>

            {/* Exercises List */}
            <Text style={styles.sectionTitle}>Exercícios</Text>
            {currentWorkout.exercises.map((exercise, idx) => (
              <View 
                key={exercise.id} 
                style={[
                  styles.exerciseCard,
                  { borderLeftColor: currentWorkout.color }
                ]}
              >
                <View style={styles.exerciseHeader}>
                  <View 
                    style={[
                      styles.exerciseNumber,
                      { backgroundColor: currentWorkout.color + '33' }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.exerciseNumberText,
                        { color: currentWorkout.color }
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseLoad}>{exercise.load}</Text>
                  </View>
                </View>

                <Text style={styles.exerciseDescription}>{exercise.description}</Text>

                <View style={styles.exerciseMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Séries</Text>
                    <Text style={styles.metaValue}>{exercise.sets}</Text>
                  </View>
                  <Text style={styles.metaSeparator}>•</Text>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Reps</Text>
                    <Text style={styles.metaValue}>{exercise.reps}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  weekTabs: {
    maxHeight: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  weekTabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  dayTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    minWidth: 70,
  },
  dayTabActive: {
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#A78BFA',
  },
  dayTabRest: {
    opacity: 0.6,
  },
  dayEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  dayLabelActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  restContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  restEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  restTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  restMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    maxWidth: 280,
  },
  workoutHeader: {
    borderLeftWidth: 4,
    paddingLeft: 16,
    marginBottom: 24,
    paddingVertical: 8,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  statSeparator: {
    color: '#555',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  exerciseNumber: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  exerciseNumberText: {
    fontWeight: '700',
    fontSize: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  exerciseLoad: {
    fontSize: 13,
    color: '#888',
  },
  exerciseDescription: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 18,
    marginBottom: 12,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  metaItem: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'baseline',
  },
  metaLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  metaSeparator: {
    color: '#555',
  },
});
