import React from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from "../../ThemeProvider";

const { width } = Dimensions.get('window');

const UpNextActiveExerciseComponent = ({ exerciseName, numReps, weight }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    // i dont get these calculations but chatgpt says so and it appears to works
    // A simple measurement of text width can be done via estimated character count,
    // but for more precise measurement, you might need Text measurement tools
    const leftContent = `${exerciseName}`;
    const rightContent = `${numReps} reps`;
    
    const estimatedLeftWidth = leftContent.length * getResponsiveFontSize(10) * 0.5; // Rough estimate
    const estimatedRightWidth = rightContent.length * getResponsiveFontSize(10) * 0.5; // Rough estimate
    const totalEstimatedWidth = estimatedLeftWidth + estimatedRightWidth + 20 * 2; // Including padding

    const shouldWrap = totalEstimatedWidth > width - 20; // Considering padding

    return (
        <View style={[styles.container, shouldWrap ? styles.wrapContainer : null]}>
            <View style={styles.leftContainer}>
                <Text style={styles.exerciseName}>{exerciseName}</Text>
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.setsReps}>{numReps} reps @ {weight}lb</Text>
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
        flex: 1,
        alignItems: 'flex-end',
        top: width*0.0046
    },
    setsReps: {
        fontSize: getResponsiveFontSize(16),
        color: theme.grayTextColor,
    },
    exerciseName: {
        fontSize: getResponsiveFontSize(18),
        color: theme.grayTextColor,
    },
});

export default UpNextActiveExerciseComponent;