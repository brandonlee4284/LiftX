import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeProvider";
import { logoutUser } from "../../../api/auth";
import * as Haptics from 'expo-haptics';


const { height, width } = Dimensions.get('window');

const LogoutComponent = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [modalVisible, setModalVisible] = useState(false);

    const handleLogout = () => {
        setModalVisible(true);
    };

    const confirmLogout = async () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await logoutUser();
            setModalVisible(false);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.row} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout-variant" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Logout</Text>
                </TouchableOpacity>
            </View>
            <Modal
                transparent={true}
                animationType="fade"
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                                <Ionicons name="warning" size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.warningIcon} />
                                <Text style={styles.modalText}>Logout of your account?</Text>
                                <Text style={styles.modalSubText}>We will miss you!</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.endButton} onPress={closeModal}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.resumeButton} onPress={confirmLogout}>
                                        <Text style={styles.buttonText}>Logout</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        paddingVertical: 7,
        paddingHorizontal: 16,
        backgroundColor: theme.backdropColor,
        borderRadius: 12,
        width: width * 0.88
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    icon: {
        marginRight: 16,
        color: theme.grayTextColor
    },
    text: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: width * 0.8,
        backgroundColor: theme.backdropColor,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: getResponsiveFontSize(20),
        fontWeight: '700',
        color: theme.textColor,
        marginBottom: 10,
    },
    modalSubText: {
        fontSize: getResponsiveFontSize(16),
        color: theme.grayTextColor,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    endButton: {
        width: width * 0.25,
        backgroundColor: theme.grayTextColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginRight: 10
    },
    resumeButton: {
        width: width * 0.25,
        backgroundColor: theme.primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginLeft: 10
    },
    buttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: '600',
        textAlign: 'center'
    },
    warningIcon: {
        marginBottom: 10
    }
});

export default LogoutComponent;