import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../ThemeProvider';
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const WarningModal = ({ visible, close, msg, subMsg }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={() => {}}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Ionicons name="warning" size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.warningIcon}/>
                    <Text style={styles.modalText}>{msg}</Text>
                    <Text style={styles.modalSubText}>{subMsg}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.endButton} onPress={close}>
                            <Text style={styles.buttonText}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
        textAlign: 'center'
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
        width: width*0.25,
        backgroundColor: theme.primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginRight: 10
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

export default WarningModal;