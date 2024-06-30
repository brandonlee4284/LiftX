// SplitComponent.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeProvider';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const SplitComponent = ({ name, subtext, isActive, onPress, onRemove }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme, isActive);

    return (
        <TouchableOpacity style={styles.splitCard} onPress={onPress}>
            {!isActive && (
                <TouchableOpacity style={styles.removeIcon} onPress={() => onRemove(name)}>
                    <Ionicons name="remove-circle" size={getResponsiveFontSize(20)} color={theme.grayTextColor} />
                </TouchableOpacity>
            )}
            
            <Text style={styles.splitCardText}>{name}</Text>
            <Text style={styles.splitCardSubText}>{subtext}-day split</Text>
        </TouchableOpacity>
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