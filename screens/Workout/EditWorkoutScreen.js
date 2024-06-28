import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from "../ThemeProvider";
import { Ionicons, Feather } from "@expo/vector-icons";


const { width } = Dimensions.get('window');

const EditWorkoutScreen = ({ navigation, route }) => {
    const { workoutDay } = route.params;
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const handleSaveWorkout = () => {
        // save workout and navigate back
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Ionicons name="arrow-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                    <Text style={styles.header}>{workoutDay.dayName}</Text>
                    <Feather name="check-square" onPress={handleSaveWorkout} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.saveIcon}/>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.exerciseContainer}>
                        
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
    saveIcon: {
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
});

export default EditWorkoutScreen;