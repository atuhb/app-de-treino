import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Vibration,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { saveWorkoutHistory } from '../utils/storage';
import { REST_OPTIONS, DEFAULT_REST } from '../data/workouts';

export default function WorkoutScreen({ route, navigation }) {
  const { workout } = route.params;
  const exercises = workout.exercises;

  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(DEFAULT_REST);
  const [restRemaining, setRestRemaining] = useState(DEFAULT_REST);
  const [completedSets, setCompletedSets] = useState([]);

  const timerRef = useRef(null);
  const soundRef = useRef(null);

  const currentExercise = exercises[exerciseIdx];
  const totalExercises = exercises.length;
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSetsCount = completedSets.length;
  const progress = completedSetsCount / totalSets;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (!isResting) return;

    setRestRemaining(restDuration);
    timerRef.current = setInterval(() => {
      setRestRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleRestEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isResting, restDuration]);

  async function handleRestEnd() {
    setIsResting(false);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    Vibration.vibrate([0, 400, 100, 400]);
  }

  function handleSetDone() {
    const setKey = `${exerciseIdx}-${currentSet}`;
    setCompletedSets(prev => [...prev, setKey]);

    const isLastSetOfExercise = currentSet >= currentExercise.sets;
    const isLastExercise = exerciseIdx >= totalExercises - 1;

    if (isLastSetOfExercise && isLastExercise) {
      finishWorkout();
      return;
    }

    setIsResting(true);

    if (isLastSetOfExercise) {
      setCurrentSet(1);
      setExerciseIdx(prev => prev + 1);
    } else {
      setCurrentSet(prev => prev + 1);
    }
  }

  function skipExercise() {
    const isLastExercise = exerciseIdx >= totalExercises - 1;
    if (isLastExercise) {
      finishWorkout();
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsResting(false);
    setCurrentSet(1);
    setExerciseIdx(prev => prev + 1);
  }

  async function finishWorkout() {
    if (timerRef.current) clearInterval(timerRef.current);
    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      workoutName: workout.name,
      workoutKey: workout.key,
      color: workout.color,
      exerciseCount: totalExercises,
    };
    await saveWorkoutHistory(entry);
    navigation.replace('Finished', { workout });
  }

  function changeRestDuration(val) {
    setRestDuration(val);
    setRestRemaining(val);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRestRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleRestEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function skipRest() {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsResting(false);
  }

  const restPercent = restRemaining / restDuration;

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: workout.color }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.workoutTag, { color: workout.color }]}>{workout.name}</Text>
          <Text style={styles.progressText}>
            {exerciseIdx + 1}/{totalExercises}
          </Text>
        </View>

        {/* Exercise card */}
        <View style={[styles.exerciseCard, { borderColor: workout.color + '55' }]}>
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          <Text style={styles.exerciseDesc}>{currentExercise.description}</Text>

          <View style={[styles.loadBadge, { backgroundColor: workout.color + '22' }]}>
            <Text style={[styles.loadText, { color: workout.color }]}>
              {currentExercise.load}
            </Text>
          </View>

          <View style={styles.repsRow}>
            <View style={styles.repsBox}>
              <Text style={styles.repsValue}>{currentExercise.reps}</Text>
              <Text style={styles.repsLabel}>reps/tempo</Text>
            </View>
            <View style={styles.repsDivider} />
            <View style={styles.repsBox}>
              <Text style={styles.repsValue}>
                {currentSet} / {currentExercise.sets}
              </Text>
              <Text style={styles.repsLabel}>série</Text>
            </View>
          </View>
        </View>

        {/* Rest timer */}
        {isResting ? (
          <View style={styles.restCard}>
            <Text style={styles.restTitle}>Descanso</Text>
            <Text style={[styles.restTimer, { color: restRemaining <= 10 ? '#EF4444' : '#fff' }]}>
              {restRemaining}s
            </Text>

            <View style={styles.restTimerBarBg}>
              <View style={[
                styles.restTimerBarFill,
                { width: `${restPercent * 100}%`, backgroundColor: restRemaining <= 10 ? '#EF4444' : workout.color }
              ]} />
            </View>

            <View style={styles.restOptionsRow}>
              {REST_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.restOptionBtn,
                    restDuration === opt && { backgroundColor: workout.color },
                  ]}
                  onPress={() => changeRestDuration(opt)}
                >
                  <Text style={[
                    styles.restOptionText,
                    restDuration === opt && { color: '#fff' },
                  ]}>
                    {opt}s
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.skipRestBtn} onPress={skipRest}>
              <Text style={styles.skipRestText}>Pular Descanso →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: workout.color }]}
              onPress={handleSetDone}
              activeOpacity={0.85}
            >
              <Text style={styles.doneButtonText}>
                {currentSet >= currentExercise.sets && exerciseIdx >= totalExercises - 1
                  ? 'Finalizar Treino'
                  : 'Série Concluída ✓'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipExerciseBtn} onPress={skipExercise}>
              <Text style={styles.skipExerciseText}>Pular exercício</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Exercise list preview */}
        <View style={styles.exerciseList}>
          <Text style={styles.listTitle}>Exercícios</Text>
          {exercises.map((ex, idx) => (
            <View
              key={ex.id}
              style={[
                styles.listItem,
                idx === exerciseIdx && { borderLeftColor: workout.color, borderLeftWidth: 3 },
                idx < exerciseIdx && styles.listItemDone,
              ]}
            >
              <Text style={[
                styles.listItemName,
                idx < exerciseIdx && styles.listItemNameDone,
                idx === exerciseIdx && { color: '#fff' },
              ]}>
                {idx < exerciseIdx ? '✓ ' : ''}{ex.name}
              </Text>
              <Text style={styles.listItemMeta}>{ex.sets}x · {ex.reps}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#222',
    width: '100%',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  content: {
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
  workoutTag: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  exerciseDesc: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  loadBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  loadText: {
    fontSize: 14,
    fontWeight: '600',
  },
  repsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
  },
  repsBox: {
    flex: 1,
    alignItems: 'center',
  },
  repsValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  repsLabel: {
    color: '#555',
    fontSize: 12,
    marginTop: 2,
  },
  repsDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#333',
  },
  doneButton: {
    paddingVertical: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  skipExerciseBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  skipExerciseText: {
    color: '#555',
    fontSize: 14,
  },
  restCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  restTitle: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  restTimer: {
    fontSize: 72,
    fontWeight: '700',
    marginBottom: 12,
  },
  restTimerBarBg: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    width: '100%',
    marginBottom: 20,
  },
  restTimerBarFill: {
    height: 6,
    borderRadius: 3,
  },
  restOptionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  restOptionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  restOptionText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
  skipRestBtn: {
    paddingVertical: 10,
  },
  skipRestText: {
    color: '#555',
    fontSize: 14,
  },
  exerciseList: {
    marginTop: 8,
  },
  listTitle: {
    color: '#444',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    marginBottom: 6,
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
  },
  listItemDone: {
    opacity: 0.4,
  },
  listItemName: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  listItemNameDone: {
    color: '#444',
  },
  listItemMeta: {
    color: '#444',
    fontSize: 12,
    marginTop: 2,
  },
});
