import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from "../ThemeProvider";
import LottieView from 'lottie-react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AnimatedProgressBar from '../Components/AnimatedProgressBar';

const { width, height } = Dimensions.get('window');

const CompleteWorkoutModal = ({
    visible = false,
    onClose = () => {},
    dayName = '',
    time = '',
    setsCompleted = 0,
    scoreChanges = {} // Ensure this includes all muscle groups
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const animation = useRef(null);

    // States to hold progress for each muscle group
    const [progress, setProgress] = useState({
        chest: 0,
        back: 0,
        shoulders: 0,
        arms: 0,
        legs: 0,
        overall: 0,
    });

    useEffect(() => {
        if (visible) {
            animation.current?.play();

            // Animate progress bars for each muscle group
            setProgress(prev => ({
                chest: scoreChanges?.chest?.score || prev.chest,
                back: scoreChanges?.back?.score || prev.back,
                shoulders: scoreChanges?.shoulders?.score || prev.shoulders,
                arms: scoreChanges?.arms?.score || prev.arms,
                legs: scoreChanges?.legs?.score || prev.legs,
                overall: scoreChanges?.overall?.score || prev.overall,
            }));
        }
    }, [visible, scoreChanges]);

    // Define muscle groups and their progress
    const muscleGroups = [
        { name: 'Chest', key: 'chest' },
        { name: 'Back', key: 'back' },
        { name: 'Shoulders', key: 'shoulders' },
        { name: 'Arms', key: 'arms' },
        { name: 'Legs', key: 'legs' },
        { name: 'Overall', key: 'overall' },
    ];

    // Filter muscle groups to only show those with a change not equal to 0
    const filteredMuscleGroups = muscleGroups.filter(group => {
        const change = scoreChanges[group.key]?.change;
        return change !== undefined && (change >= 0.001 || change <= -0.001);
    });

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <LottieView
                        ref={animation}
                        source={require('../../assets/confettiBurst.json')}
                        style={styles.lottie}
                        autoPlay={false}
                        loop={false}
                    />
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>Workout Summary</Text>
                            {/* Workout stats */}
                            <View style={styles.durationContainer}>
                                <Text style={styles.summaryText}>Duration: <Text style={styles.boldText}>{time}</Text></Text>
                                <Text style={styles.summaryText}>Sets completed: <Text style={styles.boldText}>{setsCompleted}</Text></Text>
                            </View>
                            {/* Score updates */}
                            <View style={styles.scoreContainer}>
                                <Text style={styles.scoreTitle}>Score Updates</Text>
                                {filteredMuscleGroups.length > 0 ? (
                                    filteredMuscleGroups.map((group) => (
                                        <View key={group.key} style={styles.scoreRow}>
                                            <View style={styles.scoreTextContainer}>
                                                <Text style={styles.scoreText}>
                                                    {group.name}:
                                                    <Text style={styles.oldScoreText}>
                                                        {scoreChanges[group.key] ? 
                                                            ` ${(scoreChanges[group.key].score - scoreChanges[group.key].change).toFixed(2)} ` 
                                                            : 'No score changes available'}  
                                                    </Text>
                                                </Text>
                                                {scoreChanges[group.key] && 
                                                    <Entypo name="arrow-long-right" size={getResponsiveFontSize(16)} color={theme.textColor} style={{paddingHorizontal:5}}/>
                                                }
                                                <Text style={styles.newScoreText}>
                                                    {scoreChanges[group.key] && 
                                                        ` ${(scoreChanges[group.key].score).toFixed(2)}`
                                                    }
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.changeScoreText,
                                                        { color: scoreChanges[group.key]?.change > 0 ? theme.positiveColor : theme.dangerColor }
                                                    ]}
                                                >
                                                    {scoreChanges[group.key] &&
                                                        ` (${scoreChanges[group.key].change > 0 ? '+' : ''}${(scoreChanges[group.key].change).toFixed(2)})`
                                                    }
                                                </Text>
                                            </View>
                                            {/* Animated Progress Bar for each muscle group */}
                                            <AnimatedProgressBar
                                                progress={progress[group.key]}
                                                maxValue={1000}
                                                color={theme.primaryColor}
                                            />
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noChangesText}>
                                        No changes to your score. Try increasing the weight or reps!
                                    </Text>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: width * 0.8,
        minHeight: width * 0.8,
        backgroundColor: theme.backdropColor,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 25
    },
    modalText: {
        fontSize: getResponsiveFontSize(20),
        fontWeight: '700',
        color: theme.textColor,
        marginBottom: 10,
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
    summaryText: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        marginBottom: 10,
        textAlign: 'center',
        paddingHorizontal: 5
    },
    lottie: {
        width: width,
        height: height,
        position: 'absolute',
        zIndex: 10,
    },
    scoreTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scoreContainer: {
    },
    scoreTitle: {
        fontSize: getResponsiveFontSize(20),
        fontWeight: '600',
        color: theme.textColor,
        marginBottom: 5,
        textAlign: 'left',
    },
    scoreText: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        fontWeight: 'bold',
    },
    oldScoreText: {
        fontSize: getResponsiveFontSize(16),
        color: theme.grayTextColor,
        fontWeight: 'bold',
    },
    newScoreText: {
        fontSize: getResponsiveFontSize(16),
        color: theme.primaryColor,
        fontWeight: 'bold',
    },
    changeScoreText: {
        fontSize: getResponsiveFontSize(12),
        color: theme.textColor,
        paddingLeft: 5
    },
    scoreRow: {
        marginBottom: 10,
    },
    noChangesText: {
        fontSize: getResponsiveFontSize(16),
        color: theme.grayTextColor,
        textAlign: 'left',
        marginTop: 10,
    },
    progressBar: {
        height: width*0.023,
        borderRadius: 5,
        marginTop: 10,
    },
    arrowIcon: {
        marginHorizontal: 20,
    }
});

export default CompleteWorkoutModal;