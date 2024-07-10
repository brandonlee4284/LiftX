import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../ThemeProvider';
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const InformationModal = ({ visible, close, msg, subMsg }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={close}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={close}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContainer}>
                        <Ionicons name="information-circle" size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.infoIcon}/>
                        <Text style={styles.modalText}>{msg}</Text>
                        <Text style={styles.modalSubText}>{subMsg}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
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
        paddingHorizontal:20
    },
    infoIcon: {
        marginBottom: 10
    }
});

export default InformationModal;