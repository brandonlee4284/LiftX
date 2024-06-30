import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from "../ThemeProvider";
import { Ionicons, Feather } from "@expo/vector-icons";
import EditExerciseComponent from "./WorkoutComponents/EditExerciseComponent";
import { addDayNameActive, addDayNamePrivate, dayExist, deleteDayActive, deleteDayPrivate, editActiveSplitDayName, editDayName, updateActiveSplitExercises, updateExercises } from "../../api/splits";
import * as Haptics from 'expo-haptics';
import DeleteWorkoutModal from "./WorkoutComponents/DeleteWorkoutModal";
import WarningModal from "../Components/WarningModal";

/*
To-Do list
- catch duplicate day names (done)
- catch empty exercises (done)
*/

const { width } = Dimensions.get('window');

const EditWorkoutScreen = ({ navigation, route }) => {
    const { workoutDay, splitName } = route.params;
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [oldDayName, setOldDayName] = useState(workoutDay.dayName);
    const [updatedDayName, setUpdatedDayName] = useState(workoutDay.dayName);
    const [exercises, setExercises] = useState(workoutDay.exercises);
    // modal that pops up if a user is trying to delete a workout
    const [showEndWorkoutModal, setShowEndWorkoutModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showIncompleteExerciseWarningModal, setShowIncompleteExerciseWarningModal] = useState(false);

    const handleSaveWorkout = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        // check if there are any empty exercises inputs (name, sets, reps, weight)
        for (let exercise of exercises) {
            if (
                !exercise.name || 
                exercise.sets === '' || 
                exercise.reps === '' || 
                exercise.weight === ''
            ) {
                handleIncompleteExerciseWarningModal();
                return;
            }
        }

        // checks if the day already exists
        if(await dayExist(splitName, updatedDayName) && updatedDayName != oldDayName) {
            // do not allow duplicate daynames
            handleWarningModal();
            return;
        } else if(await dayExist(splitName, oldDayName)){
            // update day
            // update dayName for active split
            await editActiveSplitDayName(oldDayName, updatedDayName);
            // update dayName for private split
            await editDayName(splitName, oldDayName, updatedDayName);
        } else {
            // create new day (add updatedDayName to split)
            await addDayNameActive(updatedDayName);
            await addDayNamePrivate(splitName, updatedDayName);
        }
        
        // update exercise active split
        updateActiveSplitExercises(updatedDayName, exercises);
        // update exercises private splits
        updateExercises(splitName, updatedDayName, exercises);

        // update workoutDay and pass to previous screen
        const newWorkoutDay = {
            dayName: updatedDayName,
            exercises: exercises
        };
        navigation.navigate('PreviewWorkout', { updatedWorkoutDay: newWorkoutDay, splitName });
    };

    const handleDeleteWorkout = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if(await dayExist(splitName, oldDayName)){
            await deleteDayActive(updatedDayName);
            await deleteDayPrivate(splitName, updatedDayName);
        }
        navigation.navigate("Home");
        setShowEndWorkoutModal(false);
    };

    const goBack = () => {
        navigation.goBack()
    };

    const addExerciseBoxes = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        const newExercise = { name: "", sets: "", reps: "", weight: "", notes: "" };
        setExercises([...exercises, newExercise]);
    };

    const updateExercise = (index, updatedExercise) => {
        const updatedExercises = exercises.map((exercise, i) => (i === index ? updatedExercise : exercise));
        setExercises(updatedExercises);
    };

    const removeExercise = (index) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        const updatedExercises = exercises.filter((_, i) => i !== index);
        setExercises(updatedExercises);
    };

    const handleCancel = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowEndWorkoutModal(false);
    };

    const deleteWarning = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowEndWorkoutModal(true);
    }

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowWarningModal(false);
        setShowIncompleteExerciseWarningModal(false);
    };

    const handleWarningModal = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowWarningModal(true);
    }

    const handleIncompleteExerciseWarningModal = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowIncompleteExerciseWarningModal(true);
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust this offset as needed
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Ionicons name="arrow-back" onPress={() => goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                    <TextInput 
                        style={styles.header}
                        keyboardType="default"
                        value={updatedDayName}
                        onChangeText={setUpdatedDayName}
                        maxLength={8}
                    />
                    <Feather name="check-square" onPress={handleSaveWorkout} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.saveIcon}/>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.exerciseContainer}>
                        {exercises.map((exercise, index) => (
                            <EditExerciseComponent
                                key={index}
                                exerciseName={exercise.name}
                                numSets={exercise.sets}
                                numReps={exercise.reps}
                                weight={exercise.weight}
                                notes={exercise.notes}
                                onExerciseNameChange={(name) => updateExercise(index, { ...exercise, name })}
                                onSetsChange={(sets) => updateExercise(index, { ...exercise, sets })}
                                onRepsChange={(reps) => updateExercise(index, { ...exercise, reps })}
                                onWeightChange={(weight) => updateExercise(index, { ...exercise, weight })}
                                onNotesChange={(notes) => updateExercise(index, { ...exercise, notes })}
                                removeExercise={() => removeExercise(index)}
                            />
                        ))}
                        <View style={styles.addbuttonContainer}>
                            <TouchableOpacity style={styles.addButton} onPress={addExerciseBoxes}>
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={deleteWarning}>
                            <Text style={styles.buttonText}>Delete Workout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <DeleteWorkoutModal
                visible={showEndWorkoutModal}
                cancel={handleCancel}
                del={handleDeleteWorkout}
                workoutName={updatedDayName}
            />
            <WarningModal
                visible={showWarningModal}
                msg={`${updatedDayName} already exists in this split`}
                subMsg={"Please choose another name."}
                close={handleClose}
            />
            <WarningModal
                visible={showIncompleteExerciseWarningModal}
                msg={"Incomplete exercises"}
                subMsg={"Make sure each exercise has a name, set count, rep count, and weight."}
                close={handleClose}
            />
        </KeyboardAvoidingView>
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
    saveIcon: {
        position: 'absolute',
        left: width*0.85,
    },
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(42),
        fontWeight: '600',
        textDecorationLine: 'underline'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    exerciseContainer: {
        marginTop: 40,
        paddingHorizontal: 20,
    },
    addbuttonContainer: {
        alignItems: 'center',
        marginTop: 20
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20, // Adds space between button and bottom of ScrollView
    },
    button: {
        width: width * 0.5,
        height: getResponsiveFontSize(57),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 20,
        marginTop: 20
    },
    buttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
    },
    addButton: {
        borderRadius: 10,
        backgroundColor: theme.navbarColor,
        justifyContent: 'center',
        alignItems: 'center',
        width: width*0.69,
        height: width*0.116,
    },
    addButtonText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(30),
    },
});

export default EditWorkoutScreen;