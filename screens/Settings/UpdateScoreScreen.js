import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../ThemeProvider";
import Fontisto from 'react-native-vector-icons/Fontisto';
import { getDisplayName, setUserWeight, setUserGender, setUserAge } from '../../api/profile';
import * as Haptics from 'expo-haptics';
import WarningModal from "../Components/WarningModal";
import { customExerciseExist, syncScores, updateExerciseStats, updateOverallStats } from "../../api/workout";
import ExerciseDropdown from "../Components/ExerciseDropdown";
import SafteyModal from "../Components/SafteyModal";
import { Ionicons } from "@expo/vector-icons";

const { height, width } = Dimensions.get('window');

const UpdateScoreScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [exercises, setExercises] = useState([
        { muscle: 'Chest', name: "", reps: "", sets: 1, weight: "" },
        { muscle: 'Back', name: "", reps: "", sets: 1, weight: "" },
        { muscle: 'Shoulders', name: "", reps: "", sets: 1, weight: "" },
        { muscle: 'Arms', name: "", reps: "", sets: 1, weight: "" },
        { muscle: 'Legs', name: "", reps: "", sets: 1, weight: "" },
    ]);
    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const [exerciseWarningModalVisible, setExerciseWarningModalVisible] = useState(false);
    
    const handleHome = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (areFieldsComplete()) {
            try {
                if(await customExerciseExist(exercises)){
                    setExerciseWarningModalVisible(true);
                } else {
                    await updateExerciseStats(exercises);
                    await updateOverallStats();
                    await syncScores();
                    navigation.navigate('Settings');
                }
                
            } catch (error) {
                console.error('Error in handleHome: ', error);
            }
        } else {
            setWarningModalVisible(true);
        }
    };

    const handleContinue = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (areFieldsComplete()) {
            try {
                await updateExerciseStats(exercises);
                await updateOverallStats();
                await syncScores();
                setExerciseWarningModalVisible(false);
                navigation.navigate('Settings');
            } catch (error) {
                console.error('Error in handleHome: ', error);
            }
        } else {
            setWarningModalVisible(true);
        }
        
    };

    const areFieldsComplete = () => {
        return exercises.every(exercise =>
            exercise.name.trim() !== "" &&
            exercise.reps.trim() !== "" &&
            exercise.weight.trim() !== ""
        );
    };

    const handleSkip = () => {
        navigation.navigate('Home');
    };

    const handleInputChange = (index, field, value) => {
        const newExercises = [...exercises];
        if(field === "name"){
            newExercises[index][field] = value;
        } else {
            newExercises[index][field] = value;
        }
        
        setExercises(newExercises);
    };

    const leftContent = exercises.map(exercise => exercise.name).join(", ");
    const rightContent = exercises.map(exercise => `${exercise.reps} reps, ${exercise.weight}lb`).join(", ");
    
    const estimatedLeftWidth = leftContent.length * getResponsiveFontSize(10) * 0.5; // Rough estimate
    const estimatedRightWidth = rightContent.length * getResponsiveFontSize(10) * 0.5; // Rough estimate
    const totalEstimatedWidth = estimatedLeftWidth + estimatedRightWidth + 20 * 2; // Including padding

    const shouldWrap = totalEstimatedWidth > width - 20; // Considering padding

    // Rendering
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View style={styles.header}>
                        <Text style={styles.greetingText}>Update Scores</Text>
                        <TouchableOpacity onPress={handleHome} style={styles.saveButton}>
                            <Text style={styles.saveText}>save</Text>
                        </TouchableOpacity>
                        <Ionicons name="chevron-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                    </View>
                    <View style={styles.body}>
                        <Text style={styles.title}>Select an exercise for each muscle group:</Text>
                        {exercises.map((exercise, index) => (
                            <View key={index} style={styles.muscleGroup}>
                                <Text style={styles.muscleText}>{exercise.muscle}</Text>
                                <View style={[styles.exerciseContainer, shouldWrap ? styles.wrapContainer : null]}>
                                    <View style={styles.leftContainer}>
                                        <ExerciseDropdown
                                            value={exercise.name}
                                            onChangeText={(text) => handleInputChange(index, 'name', text)}
                                            filter={exercise.muscle}
                                        />
                                    </View>
                                    <View style={styles.rightContainer}>
                                        <TextInput
                                            style={[styles.setsReps, styles.editFont]}
                                            keyboardType="numeric"
                                            placeholder={"0"}
                                            placeholderTextColor={theme.grayTextColor}
                                            maxLength={4}
                                            value={exercise.reps}
                                            onChangeText={(text) => handleInputChange(index, 'reps', text)}
                                        />
                                        <Text style={styles.setsReps}> reps @ </Text>
                                        <TextInput
                                            style={[styles.setsReps, styles.editFont]}
                                            keyboardType="numeric"
                                            placeholder={"0"}
                                            placeholderTextColor={theme.grayTextColor}
                                            maxLength={4}
                                            value={exercise.weight}
                                            onChangeText={(text) => handleInputChange(index, 'weight', text)}
                                        />
                                        <Text style={styles.setsReps}>lb</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                    
                    <WarningModal
                        visible={warningModalVisible}
                        close={() => setWarningModalVisible(false)}
                        msg={"Incomplete Fields"}
                        subMsg={"Make sure to fill in all fields before continuing"}
                    />
                    <SafteyModal
                        visible={exerciseWarningModalVisible}
                        close={() => setExerciseWarningModalVisible(false)}
                        msg={"Invalid Exercises"}
                        subMsg={"Some exercises are not recognized and won't count towards your score."}
                        opt1={handleContinue}
                        opt2={() => setExerciseWarningModalVisible(false)}
                        opt1Text={"Continue"}
                        opt2Text={"Go back"}
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
        backgroundColor: theme.backgroundColor,
        paddingTop: 40,
        paddingHorizontal: 30,
    },
    scrollContainer: {
        marginTop: 10,
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: getResponsiveFontSize(26),
        color: theme.textColor,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    saveButton: {
        justifyContent: 'center',
        left: width*0.12
    },
    saveText: {
        position: 'absolute',
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        
    },
    subText: {
        fontSize: getResponsiveFontSize(22),
        color: theme.textColor,
        marginBottom: 20,
    },
    body: {
        marginTop: 30
    },
    title: {
        fontSize: getResponsiveFontSize(22),
        color: theme.textColor,
        marginBottom: 20,
        textAlign: 'left',
        fontWeight: '700'
    },
    muscleGroup: {
        marginBottom: 100,
    },
    muscleText: {
        fontSize: getResponsiveFontSize(18),
        color: theme.textColor,
        marginBottom: 10,
        textAlign: 'left',
        fontWeight: '800'
    },
    exerciseContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        alignItems: 'center',
        flexDirection: 'row',
    },
    setsReps: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        textAlign: 'right',
        bottom: 0.0069*width
    },
    exerciseName: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        textDecorationLine: 'underline',
    },
    editFont: {
        color: theme.textColor,
        textDecorationLine: 'underline',
        padding: 3
    },
    backIcon: {
        position: 'absolute',
        left: 0,
    },
});

export default UpdateScoreScreen;