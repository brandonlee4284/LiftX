import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { useTheme } from "../ThemeProvider";
import WorkoutButtonComponent from "./WorkoutComponents/WorkoutButtonComponent";


const { height, width } = Dimensions.get('window');

const WorkoutScreen = ({ navigation, route }) => {
    const { workoutDay } = route.params;
    const { theme } = useTheme();
    const styles = createStyles(theme);
  
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>{workoutDay.dayName}</Text>
            </View>
            <View style={styles.contentContainer}>
              
                <View style={styles.buttonContainer}>
                    <WorkoutButtonComponent text="End Workout" />
                </View>
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
        flex: 1,
        paddingTop: 78,
        backgroundColor: theme.backgroundColor,
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20, // Adds space between button and bottom of ScrollView
    },

});

export default WorkoutScreen;