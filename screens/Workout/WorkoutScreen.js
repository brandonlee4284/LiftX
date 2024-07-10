import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, ImageBackground, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from "../ThemeProvider";
import WorkoutButtonComponent from "./WorkoutComponents/WorkoutButtonComponent";
import { MaterialCommunityIcons, Feather, Octicons } from '@expo/vector-icons';
import EndWorkoutModal from "./WorkoutComponents/EndWorkoutModal";
import * as Haptics from 'expo-haptics';
import ActiveExerciseComponent from "./WorkoutComponents/ActiveExerciseComponent";
import UpNextActiveExerciseComponent from "./WorkoutComponents/UpNextExerciseComponent";
import { fetchPrivateWorkout, syncScores, updateExerciseStats, updateOverallStats } from "../../api/workout";
import { ActivityIndicator } from 'react-native';


const { height, width } = Dimensions.get('window');

const WorkoutScreen = ({ navigation, route }) => {
    const { workoutDay } = route.params;
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [isLoading, setIsLoading] = useState(false);

    const flattenedSets = workoutDay.exercises.reduce((acc, exercise) => {
        const setsWithNumbers = Array.from({ length: exercise.sets }, (_, setNumber) => ({
            ...exercise,
            setNumber: setNumber + 1
        }));
        acc.push(...setsWithNumbers);
        return acc;
    }, []);
    const [currentNote, setCurrentNote] = useState(activeSet ? activeSet.notes : "");
    // active set
    const [activeSet, setActiveSet] = useState(
        workoutDay.exercises.length > 0
            ? { ...workoutDay.exercises[0], setNumber: 1 }
            : null
    );
    // next 6 sets
    const [upNextSets, setUpNextSets] = useState(() => {
        const remainingSets = activeSet ? flattenedSets.slice(1) : flattenedSets;
        return remainingSets.slice(0, Math.min(remainingSets.length, 6));
    });
    // all sets after upNextSets
    const [restOfSets, setRestOfSets] = useState(() => {
        const remainingSets = activeSet ? flattenedSets.slice(1) : flattenedSets;
        return remainingSets.slice(upNextSets.length);
    });

    const [setsCompleted, setSetsCompleted] = useState(1);

    // Stopwatch functionality
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [stopwatchInterval, setStopwatchInterval] = useState(null);

    // modal that pops up if a user is trying to end a workout early
    const [showEndWorkoutModal, setShowEndWorkoutModal] = useState(false);

    // completed exercises ([{name sets reps weight}, ...])
    const [completedExercises, setCompletedExercises] = useState([]);

    const [notification, setNotification] = useState({ message: '', visible: false, color: theme.primaryColor });
    const notificationTimeoutRef = useRef(null);
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        // Start the stopwatch interval
        const interval = setInterval(() => {
            setSecondsElapsed(prevSeconds => prevSeconds + 1);
        }, 1000);

        setStopwatchInterval(interval);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setCurrentNote(activeSet ? activeSet.notes : "");
    }, [activeSet]);

    const handleEndWorkout = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (activeSet === null) {
            setIsLoading(true); // Start loading
            console.log(completedExercises);
            try {
                await updateExerciseStats(completedExercises);
                //console.log("Exercise stats updated.");
                await updateOverallStats();
                //console.log("Overall stats updated.");
                await syncScores();
                //console.log("Scores synced.");

                // get score changes
                //console.log("Fetching score changes...");
                let workoutData = await fetchPrivateWorkout();
                //console.log('Workout data fetched:', workoutData.overallScore);

                navigation.navigate('Home', { 
                    completedWorkout: true, 
                    stopwatch: secondsElapsed, 
                    setsCompleted, 
                    dayName: workoutDay.dayName,
                    scoreChanges: workoutData.overallScore
                });
            } catch (error) {
                console.error("Error updating stats:", error);
            } finally {
                setIsLoading(false); // End loading
            }
        } else {
            setShowEndWorkoutModal(true);
        }
    };

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

            setCompletedExercises(prevExercises => [
                ...prevExercises,
                {
                    name: activeSet.name,
                    sets: activeSet.sets,
                    reps: activeSet.reps,
                    weight: activeSet.weight
                }
            ]);

            setActiveSet(nextActiveSet);
            setSetsCompleted(prevCompleted => prevCompleted + 1);
            showNotification('Set completed and applied to your score!', theme.positiveColor);
        } else if(activeSet != null) {
            setCompletedExercises(prevCompletedExercises => [
                ...prevCompletedExercises,
                {
                    name: activeSet.name,
                    sets: activeSet.setNumber,
                    reps: activeSet.reps,
                    weight: activeSet.weight
                }
            ]);
            setActiveSet(null);
            showNotification('Set completed and applied to your score!', theme.positiveColor);
            
        } 
    };

    // puts the active exercise to the end of the restOfSets
    const handleRequeue = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        //console.log("handleRequeue called");

        if (!activeSet || upNextSets.length === 0) {
            // Do not proceed if there's no active set or upNextSets is empty
            return;
        }
    
        if (activeSet) {    
            const tempActiveSet = activeSet;
            const nextActiveSet = upNextSets.length > 0 ? upNextSets[0] : null;
    
            const newUpNextSets = upNextSets.slice(1);
    
            let updatedRestOfSets = restOfSets;
    
            if (restOfSets.length > 0) {
                const firstRestSet = restOfSets[0];
                newUpNextSets.push(firstRestSet);
                updatedRestOfSets = restOfSets.slice(1);
            }
    
            if (newUpNextSets.length < 6) {
                newUpNextSets.push(tempActiveSet);
            } else {
                updatedRestOfSets.push(tempActiveSet);
            }
        
            setActiveSet(nextActiveSet);
            setUpNextSets(newUpNextSets);
            setRestOfSets(updatedRestOfSets);
            showNotification('Set requeued to the end of workout', theme.warningColor);
        }
    };

    // when next button is clicked set doesn't get added to score calculations
    const handleNext = () => {
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
            showNotification('Set skipped and will not affect your score', theme.dangerColor);
        } else if(activeSet != null) {
            setActiveSet(null);
            showNotification('Set skipped and will not affect your score', theme.dangerColor);
        } 
    };

    const handleEnd = () => {
        //console.log(completedExercises);
        navigation.navigate('Home', { completedWorkout: false });
        setShowEndWorkoutModal(false);
    };

    const handleResume = () => {
        setShowEndWorkoutModal(false);
    };

    /*
    const showNotification = (message, color) => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }
        setNotification({ message, visible: true, color });
        notificationTimeoutRef.current = setTimeout(() => {
            setNotification({ message: '', visible: false, color: theme.primaryColor });
        }, 5000);
    };
    */

    const showNotification = (message, color) => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }
        setNotification({ message, visible: true, color });

        // Slide the notification in
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        notificationTimeoutRef.current = setTimeout(() => {
            // Slide the notification out
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setNotification({ message: '', visible: false, color: theme.primaryColor });
            });
        }, 5000);
    };

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
                            setNumber={activeSet.setNumber}
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
                        {
                        <TouchableOpacity style={styles.smallButton} onPress={handleRequeue}>
                            <MaterialCommunityIcons name="reload" size={getResponsiveFontSize(20)} color={theme.backgroundColor} />
                        </TouchableOpacity>
                        }
                        <TouchableOpacity style={styles.largeButton} onPress={handleFeedback}>
                            <Feather name="check" size={getResponsiveFontSize(30)} color={theme.backgroundColor} />
                        </TouchableOpacity>
                        {
                        <TouchableOpacity style={styles.smallButton} onPress={handleNext}>
                            <Feather name="skip-forward" size={getResponsiveFontSize(20)} color={theme.backgroundColor} />
                        </TouchableOpacity>
                        }
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
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Updating your scores...</Text>
                </View>
            )}
            {notification.visible && (
                <Animated.View style={[styles.notificationContainer, { backgroundColor: notification.color, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.notificationText}>{notification.message}</Text>
                </Animated.View>
            )}
          
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
        paddingHorizontal: 70,
    },
    notes: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
        opacity: 0.7,
        textAlign: 'center'
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
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: getResponsiveFontSize(20),
        color: theme.textColor,
        paddingTop: 20
    },
    notificationContainer: {
        position: 'absolute',
        width: width,
        paddingTop: 50,
        padding: 10,
        backgroundColor: theme.primaryColor,
        borderRadius: 20,
        alignItems: 'center',
    },
    notificationText: {
        color: theme.textColor,
        fontWeight: 'bold',
        textAlign: 'center'
    },

});

export default WorkoutScreen;