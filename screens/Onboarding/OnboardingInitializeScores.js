import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../ThemeProvider";
import Fontisto from 'react-native-vector-icons/Fontisto';
import { completeOnboarding } from '../../api/profile';
import * as Haptics from 'expo-haptics';
import WarningModal from "../Components/WarningModal";
import { customExerciseExist, syncScores, updateExerciseStats, updateOverallStats } from "../../api/workout";
import ExerciseDropdown from "../Components/ExerciseDropdown";
import SafteyModal from "../Components/SafteyModal";

const { height, width } = Dimensions.get('window');

const OnboardingInitializeScores = () => {
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
                    await completeOnboarding();
                    navigation.navigate('Home');
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
                await completeOnboarding();
                navigation.navigate('Home');
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

    const handleSkip = async () => {
        await completeOnboarding();
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
            

            <ScrollView  contentContainerStyle={styles.scrollContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View style={styles.header}>
                        <Text style={styles.greetingText}>Almost There!</Text>
                        <TouchableOpacity onPress={handleSkip}>
                            <Text style={styles.skipText}>skip</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.subText}>Find out your strength scores..</Text>
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
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleHome} style={styles.button}>
                                <Text style={styles.buttonText}>Get Started</Text>
                            </TouchableOpacity>
                        </View>
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
        marginTop: 23,
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: getResponsiveFontSize(26),
        color: theme.textColor,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    skipText: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        fontWeight: 'bold',
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
    buttonContainer: {
        alignItems: 'center',
    },
    button: {
        width: width * 0.7,
        height: getResponsiveFontSize(57),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 10,
    },
    buttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
    },
});

export default OnboardingInitializeScores;