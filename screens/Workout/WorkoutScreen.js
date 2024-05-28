import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, TouchableWithoutFeedback, Button } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

import { fetchPrivateUserSplits, updateWorkoutData } from '../../api/userData';
import styles from './WorkoutStyles';

const WorkoutScreen = ({ navigation }) => {
    const [workoutData, setWorkoutData] = useState([]);
    const [maxDayCardHeight, setMaxDayCardHeight] = useState(0);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedExercises, setSelectedExercises] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await fetchPrivateUserSplits();
            if (data) {
                setWorkoutData(data);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedDay) {
            setSelectedExercises(selectedDay.exercises);
        }
    }, [selectedDay]);

    const renderExercise = (exercise, index) => {
        const minReps = Math.min(...exercise.reps);
        const maxReps = Math.max(...exercise.reps);
        const repsDisplay = minReps === maxReps ? minReps : `${minReps}-${maxReps}`;

        return (
            <View key={index} style={styles.exerciseCard}>
                <Text style={styles.exerciseText}>
                    {exercise.name} {exercise.sets}x{repsDisplay}
                </Text>
            </View>
        );
    };

    const renderExerciseInPopupView = ({ item, drag, isActive }) => (
        <ScaleDecorator>
            <TouchableOpacity
                onLongPress={drag}
                disabled={isActive}
                style={[
                    styles.exerciseCardPopup,
                    { backgroundColor: isActive ? "red" : "transparent" },
                ]}
            >
                <View style={styles.exercisePopupContainer}>
                    {item.reps.map((rep, repIndex) => (
                        <Text key={repIndex} style={styles.exerciseTextPopup}>
                            {item.name} {rep} @ {item.weight[repIndex]} lbs
                        </Text>
                    ))}
                </View>
            </TouchableOpacity>
        </ScaleDecorator>
    );

    const renderDay = ({ item }) => (
        <TouchableOpacity
            onPress={() => setSelectedDay(item)}
            onLayout={event => {
                const { height } = event.nativeEvent.layout;
                if (height > maxDayCardHeight) {
                    setMaxDayCardHeight(height);
                }
            }}
            style={[styles.dayCard, { minHeight: maxDayCardHeight }]}
        >
            <Text style={styles.dayText}>{item.dayName}</Text>
            <View style={styles.exerciseList}>
                {item.exercises.map(renderExercise)}
            </View>
        </TouchableOpacity>
    );

    const renderSplit = ({ item }) => (
        <View style={styles.splitContainer}>
            <Text style={styles.splitTitle}>{item.splitName}</Text>
            <FlatList
                horizontal
                data={item.days}
                renderItem={renderDay}
                keyExtractor={(day, index) => `${day.dayName}-${index}`}
                contentContainerStyle={styles.horizontalFlatListContent}
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.line} />
        </View>
    );

    const navigateToStartWorkout = () => {
        if (selectedDay) {
            navigation.navigate('Start Workout', { day: selectedDay });
            setSelectedDay(null);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={workoutData}
                renderItem={renderSplit}
                keyExtractor={(item, index) => `split-${index}`}
                contentContainerStyle={styles.verticalFlatListContent}
                showsVerticalScrollIndicator={false}
            />

            <Modal
                visible={!!selectedDay}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setSelectedDay(null)}
            >
                <TouchableWithoutFeedback onPress={() => setSelectedDay(null)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{selectedDay?.dayName}</Text>
                                    <Button title="Close" onPress={() => setSelectedDay(null)} />
                                </View>
                                <View style={styles.modalBody}>
                                    <DraggableFlatList
                                        data={selectedExercises}
                                        onDragEnd={({ data }) => setSelectedExercises(data)}
                                        keyExtractor={(exercise, index) => `${exercise.name}-${index}`}
                                        renderItem={renderExerciseInPopupView}
                                        contentContainerStyle={styles.popupExerciseList}
                                    />
                                    <TouchableOpacity>
                                        <Text style={styles.removeButton}>Remove {selectedDay?.dayName}</Text>
                                    </TouchableOpacity>
                                    <Button
                                        title="Start Workout"
                                        onPress={navigateToStartWorkout}
                                        color="green"
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default WorkoutScreen;