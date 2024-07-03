import React, { useState, useEffect } from 'react';
import { View, TextInput, Modal, TouchableOpacity, StyleSheet, Dimensions, Text, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../ThemeProvider';

const { width } = Dimensions.get('window');

const EditSplitModal = ({ visible, splitName, savePress, deletePress, onRequestClose }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [name, setName] = useState(splitName);

    // Sync state with props
    useEffect(() => {
        if (splitName !== name) {
            console.log(name);
            setName(splitName);
        }
    }, [splitName]);

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onRequestClose}>
            <TouchableWithoutFeedback onPress={onRequestClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <TextInput
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                                maxLength={20}
                            />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => savePress(name)}>
                                    <Text style={styles.savebuttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.removeButton} onPress={deletePress}>
                                    <Text style={styles.removebuttonText}>Remove Split</Text>
                                </TouchableOpacity>
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
        backgroundColor: theme.backdropColor,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    textInput: {
        width: '100%',
        fontSize: getResponsiveFontSize(25),
        fontWeight: '800',
        color: theme.textColor,
        padding: 30,
        marginBottom: 20,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    buttonContainer: {
        flexDirection: 'column', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20
    },
    saveButton: {
        width: width * 0.35, 
        backgroundColor: theme.primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    removeButton: {
        width: width * 0.35, 
        backgroundColor: theme.grayTextColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10, 
    },
    savebuttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: '600',
        textAlign: 'center'
    },
    removebuttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: '600',
        textAlign: 'center'
    },
});

export default EditSplitModal;