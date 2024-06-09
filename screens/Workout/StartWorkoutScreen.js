import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const StartWorkoutScreen = ({ route }) => {
    const navigation = useNavigation();
    const { day } = route.params;

    // Hide the header and bottom tab bar
    useFocusEffect(() => {
        navigation.setOptions({ headerShown: false });
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });

        return () => {
            navigation.getParent()?.setOptions({ headerShown: false });
            navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
        };
    });

    const handleEndWorkout = () => {
        navigation.navigate('Workout'); // Replace 'Workout' with the actual name of your target screen
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>{day.dayName} Workout</Text>
                {day.exercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseCard}>
                        <Text style={styles.exerciseText}>{exercise.name}</Text>
                        {exercise.reps.map((rep, setIndex) => (
                            <Text key={setIndex} style={styles.setText}>
                                Set {setIndex + 1}: {rep} reps @ {exercise.weight[setIndex]} lbs
                            </Text>
                        ))}
                    </View>
                ))}
                <TouchableOpacity style={styles.endWorkoutButton} onPress={handleEndWorkout}>
                    <Text style={styles.endWorkoutText}>End Workout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 40,
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
    endWorkoutButton: {
        backgroundColor: '#ff5c5c',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    endWorkoutText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default StartWorkoutScreen;