import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from "../../ThemeProvider";

const { width } = Dimensions.get('window');

const EditExerciseComponent = ({ exerciseName, numSets, numReps, weight, notes, onExerciseNameChange, onSetsChange, onRepsChange, onWeightChange, onNotesChange, removeExercise }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [exerciseNameState, setExerciseNameState] = useState(exerciseName);
    const [notesState, setNotesState] = useState(notes);
    const [sets, setSets] = useState(numSets.toString());
    const [reps, setReps] = useState(numReps.toString());
    const [weightValue, setWeightValue] = useState(weight.toString());

    const leftContent = `${exerciseName} ${notes ? notes : ''}`;
    const rightContent = `${numSets} sets, ${numReps} reps`;
    
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

    return (
        <View style={[styles.container, shouldWrap ? styles.wrapContainer : null]}>
            <View style={styles.leftContainer}>
                <TextInput 
                    style={styles.exerciseName}
                    keyboardType="default"
                    value={exerciseNameState}
                    onChangeText={handleExerciseNameChange}
                    placeholder="exercise name"
                    placeholderTextColor={theme.grayTextColor}
                />
                <TextInput 
                    style={styles.notes}
                    keyboardType="default"
                    value={notesState}
                    onChangeText={handleNotesChange}
                    placeholder="notes"
                    placeholderTextColor={theme.grayTextColor}
                />
                <TouchableOpacity onPress={removeExercise} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Delete exercise</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.rightContainer}>
                <TextInput 
                    style={[styles.setsReps, styles.editFont]}
                    keyboardType="numeric"
                    value={sets}
                    onChangeText={handleSetsChange}
                    placeholder={"0"}
                    placeholderTextColor={theme.grayTextColor}
                />
                <Text style={styles.setsReps}> sets, </Text>
                <TextInput 
                    style={[styles.setsReps, styles.editFont]}
                    keyboardType="numeric"
                    value={reps}
                    onChangeText={handleRepsChange}
                    placeholder={"0"}
                    placeholderTextColor={theme.grayTextColor}
                />
                <Text style={styles.setsReps}> reps @ </Text>
                <TextInput 
                    style={[styles.setsReps, styles.editFont]}
                    keyboardType="numeric"
                    value={weightValue}
                    onChangeText={handleWeightChange}
                    placeholder={"0"}
                    placeholderTextColor={theme.grayTextColor}
                />
                <Text style={styles.setsReps}>lb</Text>
            </View>
            
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: theme.backgroundColor,
    },
    wrapContainer: {
        flexWrap: 'wrap',
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    rightContainer: {
        //flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        top: -width*0.06
    },
    setsReps: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        textAlign: 'right',
        
    },
    exerciseName: {
        fontSize: getResponsiveFontSize(18),
        color: theme.textColor,
        //fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    notes: {
        fontSize: getResponsiveFontSize(14),
        color: theme.textColor,
        opacity: 0.7,
        textDecorationLine: 'underline'
    },
    editFont: {
        color: theme.textColor,
        //fontWeight: '800',
        textDecorationLine: 'underline',
        padding:3
    },
    removeButton: {
        marginTop: 10,
        padding: 5,
        backgroundColor: theme.primaryColor,
        borderRadius: 5,
    },
    removeButtonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(12),
        fontWeight: 'bold',
    },
});

export default EditExerciseComponent;