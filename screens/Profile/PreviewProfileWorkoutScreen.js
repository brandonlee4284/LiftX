import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from "../ThemeProvider";
import { Ionicons, Feather } from "@expo/vector-icons";
import ExerciseComponent from "../Workout/WorkoutComponents/ExerciseComponent";
import WorkoutButtonComponent from "../Workout/WorkoutComponents/WorkoutButtonComponent";
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const PreviewProfileWorkoutScreen = ({ navigation, route }) => {
    const { workoutDay, splitName, updatedWorkoutDay } = route.params;
    const { theme } = useTheme();
    const styles = createStyles(theme); 
    const currentWorkoutDay = updatedWorkoutDay ? updatedWorkoutDay : workoutDay;
    
    const goBack = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Ionicons name="arrow-back" onPress={() => goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                    <Text style={styles.header}>{currentWorkoutDay.dayName}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.exerciseContainer}>
                        {currentWorkoutDay.exercises.map((exercise, index) => (
                            <ExerciseComponent
                                key={index}
                                exerciseName={exercise.name}
                                numSets={exercise.sets}
                                numReps={exercise.reps}
                                weight={exercise.weight}
                                notes={exercise.notes}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
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
        paddingTop: 58,
        backgroundColor: theme.backgroundColor,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 40,
        marginTop: 23
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
});

export default PreviewProfileWorkoutScreen;