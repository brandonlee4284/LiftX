import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from "../ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import ExerciseComponent from "./WorkoutComponents/ExerciseComponent";
import WorkoutButtonComponent from "./WorkoutComponents/WorkoutButtonComponent";

const { width } = Dimensions.get('window');

const PreviewWorkoutScreen = ({ navigation, route }) => {
    const { workoutDay } = route.params;
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const handleWorkout = (workoutDay) => {
        navigation.navigate('Workout', { workoutDay });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Ionicons name="arrow-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                    <Text style={styles.header}>{workoutDay.dayName}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.exerciseContainer}>
                        {workoutDay.exercises.map((exercise, index) => (
                            <ExerciseComponent
                                key={index}
                                exerciseName={exercise.name}
                                numSets={exercise.sets}
                                numReps={exercise.reps}
                                weight={exercise.weight}
                                notes={exercise.notes || "enter notes"}
                            />
                        ))}
                    </View>
                    <View style={styles.buttonContainer}>
                        <WorkoutButtonComponent text="Start Workout" onPress={() => handleWorkout(workoutDay)}/>
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
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20, // Adds space between button and bottom of ScrollView
    },
});

export default PreviewWorkoutScreen;