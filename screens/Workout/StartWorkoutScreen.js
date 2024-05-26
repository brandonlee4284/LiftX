import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StartWorkoutScreen = ({ route }) => {
    console.log(route.params?.day);
    const { day } = route.params;

    return (
        
        <View style={styles.container}>
            <Text style={styles.title}>{day.dayName} Workout</Text>
            {day.exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseCard}>
                    <Text style={styles.exerciseText}>{exercise.name} - {exercise.volume} @ {exercise.weight} lbs</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    exerciseCard: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
    },
    exerciseText: {
        fontSize: 18,
    },
});

export default StartWorkoutScreen;
