import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../ThemeProvider";
import Fontisto from 'react-native-vector-icons/Fontisto';
import { getDisplayName, setUserWeight, setUserGender, setUserAge } from '../../api/profile';
import * as Haptics from 'expo-haptics';
import WarningModal from "../Components/WarningModal";
import { syncScores, updateExerciseStats, updateOverallStats } from "../../api/workout";

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

    
    const handleHome = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (areFieldsComplete()) {
            try {
                //console.log(exercises);
                await updateExerciseStats(exercises);
                await updateOverallStats();
                await syncScores();
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

    const handleSkip = () => {
        navigation.navigate('Home');
    };

    const handleInputChange = (index, field, value) => {
        const newExercises = [...exercises];
        if(field === "name"){
            newExercises[index][field] = value.toLowerCase().replace(/\s+/g, '');
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                                        <TextInput
                                            style={styles.exerciseName}
                                            keyboardType="default"
                                            placeholder="exercise name"
                                            placeholderTextColor={theme.grayTextColor}
                                            value={exercise.name}
                                            onChangeText={(text) => handleInputChange(index, 'name', text)}
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
                </ScrollView>
                <WarningModal
                    visible={warningModalVisible}
                    close={() => setWarningModalVisible(false)}
                    msg={"Incomplete Fields"}
                    subMsg={"Make sure to fill in all fields before continuing"}
                />
            </KeyboardAvoidingView>
            
        </TouchableWithoutFeedback>
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
        paddingTop: 78,
        paddingHorizontal: 40
    },
    scrollContainer: {
        flexGrow: 1,
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
        marginBottom: 20,
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
        top: -width * 0.006
    },
    setsReps: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        textAlign: 'right',
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
        marginTop: 150,
    },
    button: {
        width: width * 0.7,
        height: getResponsiveFontSize(57),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 10,
        shadowColor: theme.primaryColor,
        shadowOpacity: 0.52,
        shadowRadius: 50,
        shadowOffset: {
            width: 0,
            height: 20,
        },
    },
    buttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
    },
});

export default OnboardingInitializeScores;