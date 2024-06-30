// SplitComponent.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeProvider';
import Feather from '@expo/vector-icons/Feather';
import EditSplitModal from './EditSplitModal';
import * as Haptics from 'expo-haptics';
import { editSplitNamePrivate, splitNameExist } from "../../api/splits";

const { width } = Dimensions.get('window');

const SplitComponent = ({ name: initialName, subtext, isActive, onPress, onRemove, onNameChange, showSameNameModal  }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme, isActive);
    const [showEditSplitModal, setShowEditSplitModal] = useState(false);
    const [splitName, setSplitName] = useState(initialName);

    const handleSave = async (updatedName) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
        // Check if the updatedName already exists
        const nameExists = await splitNameExist(updatedName);
        
        if ((nameExists && updatedName != splitName) || updatedName === "") {
            // Display an alert to the user
            setShowEditSplitModal(false);
            showSameNameModal();
            //alert("The split name already exists. Please choose a different name.");
            return; // Exit the function if the name exists
        }
        
        // Proceed with updating the split name if it doesn't exist
        setSplitName(updatedName);
        await editSplitNamePrivate(splitName, updatedName);
        setShowEditSplitModal(false);
        onNameChange(); // Call the passed callback function to refetch data  
    };

    const handleRemove = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onRemove(initialName);
        setShowEditSplitModal(false);
    }

    const showModal = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowEditSplitModal(true);
    }

    const closeModal = () => {
        setShowEditSplitModal(false);
    }
    return (
        <View>
            <TouchableOpacity style={styles.splitCard} onPress={onPress}>
                {!isActive && (
                    <TouchableOpacity style={styles.removeIcon} onPress={() => showModal()}>
                        <Feather name="edit" size={getResponsiveFontSize(18)} color={theme.grayTextColor} />
                    </TouchableOpacity>
                )}
                
                <Text style={styles.splitCardText}>{initialName}</Text>
                <Text style={styles.splitCardSubText}>{subtext}-day split</Text>
            </TouchableOpacity>
            <EditSplitModal
                key={initialName + showEditSplitModal}
                visible={showEditSplitModal}
                splitName={splitName}
                savePress={handleSave}
                deletePress={handleRemove}
                onRequestClose={closeModal}
            />
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme, isActive) => StyleSheet.create({
    splitCard: {
        width: width * 0.435,
        height: width * 0.28,
        backgroundColor: theme.backdropColor,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: isActive ? 1.5 : 0,
        borderColor: isActive ? theme.primaryColor : 'transparent',
    },
    splitCardText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(20),
        fontWeight: '600',
        paddingHorizontal: 20,
        textAlign: 'center'
    },
    splitCardSubText: {
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: '300',
        marginTop: 5
    },
    removeIcon: {
        position: 'absolute',
        top: 15, // Adjust as needed
        right: 15, // Adjust as needed
    }
});

export default SplitComponent;