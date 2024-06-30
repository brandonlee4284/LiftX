import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from "../ThemeProvider";
import WorkoutButtonComponent from "./WorkoutComponents/WorkoutButtonComponent";
import { Octicons, Feather } from '@expo/vector-icons';
import EndWorkoutModal from "./WorkoutComponents/EndWorkoutModal";
import * as Haptics from 'expo-haptics';
import ActiveExerciseComponent from "./WorkoutComponents/ActiveExerciseComponent";
import UpNextActiveExerciseComponent from "./WorkoutComponents/UpNextExerciseComponent";


const { height, width } = Dimensions.get('window');

const WorkoutScreen = ({ navigation, route }) => {
    const { workoutDay } = route.params;
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const flattenedSets = workoutDay.exercises.reduce((acc, exercise, index) => {
        acc.push(...Array.from({ length: exercise.sets }, () => exercise));
        return acc;
    }, []);

    const [activeSet, setActiveSet] = useState(workoutDay.exercises.length > 0 ? workoutDay.exercises[0] : null);
    const [currentNote, setCurrentNote] = useState(activeSet ? activeSet.notes : "");
    const [upNextSets, setUpNextSets] = useState(() => {
        const remainingSets = activeSet ? flattenedSets.slice(1) : flattenedSets;
        return remainingSets.slice(0, Math.min(remainingSets.length, 6));
    });
    const [restOfSets, setRestOfSets] = useState(() => {
        const remainingSets = activeSet ? flattenedSets.slice(1) : flattenedSets;
        return remainingSets.slice(upNextSets.length);
    });

    const [setsCompleted, setSetsCompleted] = useState(1);
    const handleEndWorkout = () => {
        // save workout to workout history
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (activeSet === null) {
            navigation.navigate('Home', { completedWorkout: true, stopwatch: secondsElapsed, setsCompleted, dayName: workoutDay.dayName });
        } else {
            setShowEndWorkoutModal(true);
        }
    }

    useEffect(() => {
        setCurrentNote(activeSet ? activeSet.notes : "");
    }, [activeSet]);

    // Function to handle feedback buttons
    const handleFeedback = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (upNextSets.length > 0) {
            const nextActiveSet = upNextSets[0] || null;
            let newUpNextSets = [...upNextSets];
            if (restOfSets.length > 0) {
                newUpNextSets.push(restOfSets[0]);
                setRestOfSets(restOfSets.slice(1));
            }
            const updatedUpNext = [...newUpNextSets.slice(1)];
            setUpNextSets(updatedUpNext);
            setActiveSet(nextActiveSet);
            setSetsCompleted(prevCompleted => prevCompleted + 1);
        } else {
            setActiveSet(null);
            
        }
    };

    // modal that pops up if a user is trying to end a workout early
    const [showEndWorkoutModal, setShowEndWorkoutModal] = useState(false);

    const handleEnd = () => {
        navigation.navigate('Home', { completedWorkout: false });
        setShowEndWorkoutModal(false);
    };

    const handleResume = () => {
        setShowEndWorkoutModal(false);
    };

    // Stopwatch functionality
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [stopwatchInterval, setStopwatchInterval] = useState(null);

    useEffect(() => {
        // Start the stopwatch interval
        const interval = setInterval(() => {
            setSecondsElapsed(prevSeconds => prevSeconds + 1);
        }, 1000);

        setStopwatchInterval(interval);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>{workoutDay.dayName}</Text>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.stopwatchContainer}>
                    <Text style={styles.stopwatchText}>{formatTime(secondsElapsed)}</Text>
                </View>
                <View style={styles.notesContainer}>
                    <Text style={styles.notes}>{currentNote}</Text>
                </View>
                <View style={styles.exerciseContainer}>
                    {activeSet && (
                        <ActiveExerciseComponent
                            exerciseName={activeSet.name}
                            numReps={activeSet.reps}
                            weight={activeSet.weight}
                        />
                    )}
                </View>
                <View style={styles.upNextTextContainer}>
                    <Text style={styles.upNextText}>Up Next</Text>
                </View>
                <View style={styles.upNextContainer}>
                    {upNextSets.map((exercise, index) => (
                        <UpNextActiveExerciseComponent
                            key={index}
                            exerciseName={exercise.name}
                            numReps={exercise.reps}
                            weight={exercise.weight}
                        />
                     
                    ))}
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.feedbackButtonContainer}>
                        <TouchableOpacity style={styles.smallButton} onPress={handleFeedback}>
                            <Octicons name="thumbsdown" size={getResponsiveFontSize(20)} color={theme.backgroundColor} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.largeButton} onPress={handleFeedback}>
                            <Feather name="skip-forward" size={getResponsiveFontSize(30)} color={theme.backgroundColor} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smallButton} onPress={handleFeedback}>
                            <Octicons name="thumbsup" size={getResponsiveFontSize(20)} color={theme.backgroundColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <WorkoutButtonComponent text="End Workout" onPress={handleEndWorkout} />
                    </View>
                </View>
            </View>
            <EndWorkoutModal
                visible={showEndWorkoutModal}
                onEndWorkout={handleEnd}
                onResume={handleResume}
            />
        </View>
    );
};

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};


const createStyles = (theme) => StyleSheet.create({    
    container: {
        flex: 1,
        paddingTop: 78,
        backgroundColor: theme.backgroundColor,
    },
    wrapContainer: {
        flexWrap: 'wrap',
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(42),
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        marginTop: 35
    },
    stopwatchContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    stopwatchText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(25),
    },
    notesContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    notes: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
        opacity: 0.7,
    },
    exerciseContainer: {
        marginBottom: 60,
        paddingHorizontal: 35,
    },
    upNextContainer: {
        paddingHorizontal: 55,
    },
    upNextTextContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    upNextText: {
        fontSize: getResponsiveFontSize(26),
        color: theme.textColor,
        marginBottom: 10,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    feedbackButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
    },
    smallButton: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: (width * 0.1) / 2,
        backgroundColor: theme.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        shadowColor: theme.textColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    largeButton: {
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: (width * 0.15) / 2,
        backgroundColor: theme.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        shadowColor: theme.textColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: theme.backgroundColor,
        paddingBottom: 20,
        marginTop: 10,
        alignItems: 'center',
    }

});

export default WorkoutScreen;