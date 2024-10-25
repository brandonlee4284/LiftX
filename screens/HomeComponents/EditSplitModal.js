import React, { useState, useEffect } from 'react';
import { View, TextInput, Modal, TouchableOpacity, StyleSheet, Dimensions, Text, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../ThemeProvider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

const EditSplitModal = ({ visible, splitName, savePress, deletePress, onRequestClose }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [name, setName] = useState(splitName);

    // Sync state with props
    useEffect(() => {
        if (splitName !== name) {
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
                            <FontAwesome5 name="dumbbell" size={getResponsiveFontSize(30)} color={theme.textColor} style={{marginBottom: 10}}/>
                            <View style={styles.textInputContainer}> 
                                <TextInput
                                    style={styles.textInput}
                                    value={name}
                                    onChangeText={setName}
                                    maxLength={20}
                                />  
                                <TouchableOpacity style={styles.removeButton} onPress={deletePress}>
                                    <MaterialIcons name="delete" size={getResponsiveFontSize(30)} color={theme.textColor} style={styles.removebuttonText}/>
                                </TouchableOpacity>
                                
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={() => savePress(name)}>
                                    <Text style={styles.savebuttonText}>Save</Text>
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
        backgroundColor: 'rgba(135, 150, 159, 0.1)',
        borderRadius: 7,
        width: '80%',
        fontSize: getResponsiveFontSize(22),
        fontWeight: '800',
        color: theme.textColor,
        paddingVertical: 6,
        paddingHorizontal: 15,
        textAlign: 'left',
        //textDecorationLine: 'underline',
        //marginBottom: 20
    },
    textInputContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        paddingBottom: 10,
        marginVertical: 20
    },
    buttonContainer: {
        flexDirection: 'center', 
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        paddingBottom: 10
    },
    saveButton: {
        width: width * 0.62, 
        backgroundColor: theme.primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        //marginBottom: 10,
    },
    removeButton: {
        //left: getResponsiveFontSize(130)
        backgroundColor: 'rgba(135, 150, 159, 0.1)',
        padding: 4,
        borderRadius: 6
    },

    savebuttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: '600',
        textAlign: 'center'
    },
    removebuttonText: {
        color: theme.textColor,
    },
});

export default EditSplitModal;