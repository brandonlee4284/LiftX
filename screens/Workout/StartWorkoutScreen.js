import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5 for icons
import { Entypo } from '@expo/vector-icons'; // Import FontAwesome5 for icons

const StartWorkoutScreen = ({ route }) => {
    const navigation = useNavigation();
    const { day } = route.params;
    const [activeSetIndex, setActiveSetIndex] = useState(0);
    const [completed, setCompleted] = useState(false); // State to track workout completion

    useFocusEffect(
        React.useCallback(() => {
            navigation.setOptions({ headerShown: false });
            navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });

            return () => {
                // Reset options when screen is unfocused
                navigation.getParent()?.setOptions({ 
                    headerShown: false,
                    tabBarActiveTintColor: "white",
                    tabBarInactiveTintColor: "gray",
                    tabBarStyle: [
                      {
                        display: "flex",
                        backgroundColor: "#121212",
                        borderTopWidth: 0,
                      }
                    ], 
                    tabBarShowLabel: false, });
            };
        }, [navigation])
    );

    const handleEndWorkout = () => {
        navigation.navigate('Home'); 
    };

    const handleNextSet = () => {
        const totalSets = day.exercises.reduce((sum, exercise) => sum + exercise.reps.length, 0);
        const nextIndex = activeSetIndex + 1;
        if (nextIndex < totalSets) {
            setActiveSetIndex(nextIndex);
        } else {
            setCompleted(true); // Mark workout as completed
        }
    };

    const handlePreviousSet = () => {
        const prevIndex = activeSetIndex - 1;
        if (prevIndex >= 0) {
            setActiveSetIndex(prevIndex);
        }
    };

    const handleSkipSet = () => {
        handleNextSet();
    };

    useEffect(() => {
        setActiveSetIndex(0); // Set the first set as active when loading the screen
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{day.dayName} Workout</Text>
                {day.exercises.map((exercise, exerciseIndex) => (
                    exercise.reps.map((rep, setIndex) => {
                        const globalSetIndex = exercise.reps.slice(0, setIndex).length + day.exercises.slice(0, exerciseIndex).reduce((sum, ex) => sum + ex.reps.length, 0);
                        const isActive = globalSetIndex === activeSetIndex;

                        return (
                            <TouchableOpacity
                                key={`${exerciseIndex}-${setIndex}`}
                                style={[
                                    styles.setCard,
                                    { opacity: isActive ? 1 : 0.6 },
                                    { transform: [{ scale: isActive ? 1 : 0.8 }] }
                                ]}
                            >
                                <Text style={styles.exerciseText}>{exercise.name}</Text>
                                <Text style={styles.setText}>
                                    Set {setIndex + 1}: {rep} reps @ {exercise.weight[setIndex]} lbs
                                </Text>
                            </TouchableOpacity>
                        );
                    })
                ))}
            </ScrollView>
            {!completed && (
                <>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleNextSet}>
                            <FontAwesome5 name="check-circle" size={42} color="#009688" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleSkipSet}>
                            <Entypo name="circle-with-cross" size={42} color="#ff5c5c" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleNextSet}>
                            <FontAwesome5 name="step-forward" size={42} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.endWorkoutButton} onPress={handleEndWorkout}>
                        <Text style={styles.endWorkoutText}>End Workout</Text>
                    </TouchableOpacity>
                </>
            )}
            {completed && (
                <TouchableOpacity style={styles.endWorkoutButton} onPress={handleEndWorkout}>
                    <Text style={styles.endWorkoutText}>Complete Workout</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20,
    },
    setCard: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#dddddd',
        opacity: 0.6, // Initial opacity for non-active cards
        transform: [{ scale: 0.8 }], // Initial scale for non-active cards
    },
    exerciseText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    setText: {
        fontSize: 16,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    button: {
        marginHorizontal: 20
    }
});

export default StartWorkoutScreen;