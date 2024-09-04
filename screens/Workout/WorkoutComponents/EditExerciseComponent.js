import React, { useState, forwardRef } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from "../../ThemeProvider";
import { Swipeable } from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';
import ExerciseDropdown from "../../Components/ExerciseDropdown";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const EditExerciseComponent = forwardRef(({ 
    exerciseName, 
    numSets, 
    numReps, 
    weight, 
    notes, 
    onExerciseNameChange, 
    onSetsChange, 
    onRepsChange, 
    onWeightChange, 
    onNotesChange, 
    removeExercise,
    onSwipeableOpen,
}, ref) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [exerciseNameState, setExerciseNameState] = useState(exerciseName);
    const [notesState, setNotesState] = useState(notes);
    const [sets, setSets] = useState(numSets.toString());
    const [reps, setReps] = useState(numReps.toString());
    const [weightValue, setWeightValue] = useState(weight.toString());

    const leftContent = `${exerciseName}`;
    const rightContent = `${numSets} sets, ${numReps} reps ${notes ? notes : ''}`;

    const estimatedLeftWidth = leftContent.length * getResponsiveFontSize(10) * 0.5; // Rough estimate
    const estimatedRightWidth = rightContent.length * getResponsiveFontSize(10) * 0.5; // Rough estimate
    const totalEstimatedWidth = estimatedLeftWidth + estimatedRightWidth + 20 * 2; // Including padding

    const shouldWrap = totalEstimatedWidth > width - 20; // Considering padding

    const handleExerciseNameChange = (name) => {
        setExerciseNameState(name);
        onExerciseNameChange(name);
    };

    const handleNotesChange = (notes) => {
        setNotesState(notes);
        onNotesChange(notes);
    };

    const handleSetsChange = (sets) => {
        setSets(sets);
        onSetsChange(parseInt(sets));
    };

    const handleRepsChange = (reps) => {
        setReps(reps);
        onRepsChange(parseInt(reps));
    };

    const handleWeightChange = (weight) => {
        setWeightValue(weight);
        onWeightChange(parseInt(weight));
    };

    const renderRightActions = () => (
        <TouchableOpacity onPress={removeExercise} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={getResponsiveFontSize(30)} color={theme.textColor} />
        </TouchableOpacity>
    );

    return (
        <Swipeable 
            ref={ref}
            renderRightActions={renderRightActions} 
            onSwipeableOpen={onSwipeableOpen}
        >
            <View style={[styles.container, shouldWrap ? styles.wrapContainer : null]}>
                <View style={styles.leftContainer}>
                    <ExerciseDropdown
                        value={exerciseNameState}
                        onChangeText={handleExerciseNameChange}
                    />
                    
                    
                </View>
                <View style={styles.rightContainer}>
                    <View style={styles.setsRepsRow}>
                        <TextInput
                            style={[styles.setsReps, styles.editFont]}
                            keyboardType="numeric"
                            value={sets}
                            onChangeText={handleSetsChange}
                            placeholder={"0"}
                            placeholderTextColor={theme.grayTextColor}
                            maxLength={4}
                        />
                        <Text style={styles.setsReps}> sets, </Text>
                        <TextInput
                            style={[styles.setsReps, styles.editFont]}
                            keyboardType="numeric"
                            value={reps}
                            onChangeText={handleRepsChange}
                            placeholder={"0"}
                            placeholderTextColor={theme.grayTextColor}
                            maxLength={4}
                        />
                        <Text style={styles.setsReps}> reps @ </Text>
                        <TextInput
                            style={[styles.setsReps, styles.editFont]}
                            keyboardType="numeric"
                            value={weightValue}
                            onChangeText={handleWeightChange}
                            placeholder={"0"}
                            placeholderTextColor={theme.grayTextColor}
                            maxLength={4}
                        />
                        <Text style={styles.setsReps}>lb</Text>
                    </View>
                    <TextInput
                        style={styles.notes}
                        keyboardType="default"
                        value={notesState}
                        onChangeText={handleNotesChange}
                        placeholder="notes"
                        placeholderTextColor={theme.grayTextColor}
                        maxLength={29}
                    />
                </View>
            </View>
        </Swipeable>
    );
});

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 40,
        backgroundColor: theme.backgroundColor,
        
    },
    wrapContainer: {
        flexWrap: 'wrap',
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
        marginBottom: 50
    },
    rightContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        top: -width * 0.007
    },
    setsRepsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    setsReps: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        textAlign: 'right',
    },
    notes: {
        fontSize: getResponsiveFontSize(14),
        color: theme.textColor,
        opacity: 0.7,
        textDecorationLine: 'underline',
        //marginTop: 10,
        textAlign: 'right',
        width: '100%',
    },
    exerciseName: {
        fontSize: getResponsiveFontSize(18),
        color: theme.textColor,
        textDecorationLine: 'underline'
    },
    
    editFont: {
        color: theme.textColor,
        textDecorationLine: 'underline',
        padding: 3
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.2,
        backgroundColor: theme.dangerColor,
    },
    deleteButtonText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: 'bold',
    },
});

export default EditExerciseComponent;