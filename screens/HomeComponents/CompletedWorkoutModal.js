import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from "../ThemeProvider";
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const CompleteWorkoutModal = ({ visible, onClose, dayName, time, setsCompleted}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const animation = useRef(null);

    useEffect(() => {
        if (visible) {
            animation.current?.play();
        }
    }, [visible]);
    
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
                            <Text style={styles.summaryText}>Sets completed: <Text style={styles.boldText}>{setsCompleted}</Text></Text>
                            <Text style={styles.summaryText}>Duration: <Text style={styles.boldText}>{time}</Text></Text>                            

                            {/*
                                Animation to show change in score
                            */}
                            
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
        height: width * 0.8,
        backgroundColor: theme.backdropColor,
        borderRadius: 40,
        paddingTop: 30,
        alignItems: 'center',
        
    },
    modalText: {
        fontSize: getResponsiveFontSize(20),
        fontWeight: '700',
        color: theme.textColor,
        marginBottom: 20,
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
    },
    lottie: {
        width: width,
        height: height,
        position: 'absolute',
        zIndex: 10,
       
    },
});

export default CompleteWorkoutModal;