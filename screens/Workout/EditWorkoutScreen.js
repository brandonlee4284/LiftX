import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform  } from 'react-native';
import { useTheme } from "../ThemeProvider";
import { Ionicons, Feather } from "@expo/vector-icons";
import EditExerciseComponent from "./WorkoutComponents/EditExerciseComponent";
import { addDayNameActive, addDayNamePrivate, dayExist, deleteDayActive, deleteDayPrivate, editActiveSplitDayName, editDayName, updateActiveSplitExercises, updateExercises } from "../../api/splits";
import * as Haptics from 'expo-haptics';
import DeleteWorkoutModal from "./WorkoutComponents/DeleteWorkoutModal";
import WarningModal from "../Components/WarningModal";
import DraggableFlatList from 'react-native-draggable-flatlist';

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

    //const [exercises, setExercises] = useState(workoutDay.exercises);
    const [exercises, setExercises] = useState(
        workoutDay.exercises.map((exercise, index) => ({ ...exercise, id: Date.now() + index }))
    );
    const [exerciseIdCounter, setExerciseIdCounter] = useState(workoutDay.exercises.length);

    // modal that pops up if a user is trying to delete a workout
    const [showEndWorkoutModal, setShowEndWorkoutModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showIncompleteExerciseWarningModal, setShowIncompleteExerciseWarningModal] = useState(false);
    const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null);

    const swipeableRefs = useRef([]);

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

        const exercisesWithoutId = exercises.map(({ id, ...rest }) => rest);
        // update exercises private splits
        updateExercises(splitName, updatedDayName, exercisesWithoutId);

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
        const newExercise = { name: "", sets: "", reps: "", weight: "", notes: "", id: Date.now() + exerciseIdCounter };
        //const newExercise = { name: "", sets: "", reps: "", weight: "", notes: "" };
        setExercises([...exercises, newExercise]);
        setExerciseIdCounter(exerciseIdCounter + 1);
    };

    const updateExercise = (index, updatedExercise) => {
        const updatedExercises = exercises.map((exercise, i) => (i === index ? updatedExercise : exercise));
        setExercises(updatedExercises);
    };

    const removeExercise = (index) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        
        const updatedExercises = exercises.filter((_, i) => i !== index);
        swipeableRefs.current = swipeableRefs.current.filter((_, i) => i !== index);
        
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

    const closeAllSwipes = () => {
        swipeableRefs.current.forEach(swipeable => {
            if (swipeable) swipeable.close();
        });
    };

    const handleSwipeableOpen = (index) => {
        if (currentlyOpenSwipeable !== null && currentlyOpenSwipeable !== index) {
            swipeableRefs.current[currentlyOpenSwipeable]?.close();
        }
        setCurrentlyOpenSwipeable(index);
    };

    const handleOutsideTouch = () => {
        Keyboard.dismiss();
        closeAllSwipes();
    };      

    const updateRef = (ref, index) => {
        swipeableRefs.current[index] = ref;
    };
    
    const renderItem = ({ item, index, drag, isActive }) => {
        return (
            <TouchableOpacity onLongPress={drag} disabled={isActive}>
                <EditExerciseComponent
                    ref={(ref) => updateRef(ref, index)}
                    key={item.id}
                    exerciseName={item.name}
                    numSets={item.sets}
                    numReps={item.reps}
                    weight={item.weight}
                    notes={item.notes}
                    onExerciseNameChange={(name) => updateExercise(index, { ...item, name })}
                    onSetsChange={(sets) => updateExercise(index, { ...item, sets })}
                    onRepsChange={(reps) => updateExercise(index, { ...item, reps })}
                    onWeightChange={(weight) => updateExercise(index, { ...item, weight })}
                    onNotesChange={(notes) => updateExercise(index, { ...item, notes })}
                    removeExercise={() => removeExercise(index)}
                    onSwipeableOpen={() => handleSwipeableOpen(index)}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    
                    <TouchableWithoutFeedback onPress={handleOutsideTouch}>
                    <View>
                            <View style={styles.headerContainer}>
                                <Ionicons name="chevron-back" onPress={() => goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
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
                                            ref={(ref) => updateRef(ref, index)}
                                            key={exercise.id}
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
                                            onSwipeableOpen={() => handleSwipeableOpen(index)}
                                        />
                                    ))}
                                    {/*
                                        <DraggableFlatList
                                        data={exercises}
                                        renderItem={renderItem}
                                        keyExtractor={(item) => item.id.toString()}
                                        onDragEnd={({ data }) => setExercises(data)}
                                        />
                                    */}
                                    
                                    <View style={styles.addbuttonContainer}>
                                        <TouchableOpacity style={styles.addButton} onPress={() => { addExerciseBoxes(); handleOutsideTouch(); }} >
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
                    </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
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
        marginTop: 23,
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
        //paddingHorizontal: 20,
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
        width: width * 0.4,
        height: getResponsiveFontSize(57),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.dangerColor,
        borderRadius: 20,
        marginTop: 20
    },
    buttonText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
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