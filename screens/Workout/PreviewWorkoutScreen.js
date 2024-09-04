import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Dimensions, ScrollView, Animated } from 'react-native';
import { useTheme } from "../ThemeProvider";
import { Ionicons, Feather } from "@expo/vector-icons";
import ExerciseComponent from "./WorkoutComponents/ExerciseComponent";
import WorkoutButtonComponent from "./WorkoutComponents/WorkoutButtonComponent";
import { getActiveSplit } from "../../api/profile";
import { getWorkoutDay } from "../../api/workout";
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const PreviewWorkoutScreen = ({ navigation, route }) => {
    const { workoutDay, splitName, updatedWorkoutDay } = route.params;
    const { theme } = useTheme();
    const styles = createStyles(theme); 
    const currentWorkoutDay = updatedWorkoutDay ? updatedWorkoutDay : workoutDay;

    const [notification, setNotification] = useState({ message: '', visible: false, color: theme.primaryColor });
    const notificationTimeoutRef = useRef(null);
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (route.params?.showNotification) {
            const { message, color } = route.params.showNotification;
            showNotification(message, color);
        }
    }, [route.params]);

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
        }, 3000);
    };
    
    const handleWorkout = (workoutDay) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.navigate('Workout', { workoutDay });
    };

    const handleEditWorkoutDay = (workoutDay) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.navigate('EditWorkout', { workoutDay, splitName });
    };

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Ionicons name="chevron-back" onPress={() => goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                    <Text style={styles.header}>{currentWorkoutDay.dayName}</Text>
                    <Feather name="edit" onPress={() => handleEditWorkoutDay(currentWorkoutDay)} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.editIcon}/>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.exerciseContainer}>
                        {currentWorkoutDay.exercises.length > 0 ? (
                            currentWorkoutDay.exercises.map((exercise, index) => (
                                <ExerciseComponent
                                    key={index}
                                    exerciseName={exercise.name}
                                    numSets={exercise.sets}
                                    numReps={exercise.reps}
                                    weight={exercise.weight}
                                    notes={exercise.notes}
                                />
                            ))
                        ) : (
                            <Text style={styles.noExerciseText}>Add an exercise to start a workout</Text>
                        )}
                    </View>
                    {currentWorkoutDay.exercises.length > 0 && (
                        <View style={styles.buttonContainer}>
                            <WorkoutButtonComponent text="Start Workout" onPress={() => handleWorkout(currentWorkoutDay)}/>
                        </View>
                    )}
                </View>
            </ScrollView>
            {notification.visible && (
                <Animated.View style={[styles.notificationContainer, { backgroundColor: notification.color, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.notificationText}>{notification.message}</Text>
                </Animated.View>
            )}
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: theme.backgroundColor,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 40,
        marginTop: 10
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        position: 'absolute',
        left: width*0.07,
    },
    editIcon: {
        position: 'absolute',
        left: width*0.85,
    },
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(42),
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    exerciseContainer: {
        marginTop: 40,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20, // Adds space between button and bottom of ScrollView
    },
    noExerciseText: {
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(18),
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 20,
    },
    notificationContainer: {
        position: 'absolute',
        width: width,
        paddingTop: height*0.055,
        padding: 5,
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

export default PreviewWorkoutScreen;