// SplitComponent.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeProvider';

const { width } = Dimensions.get('window');

const SplitComponent = ({ name, subtext, isActive, onPress }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme, isActive);

    return (
        <TouchableOpacity style={styles.splitCard} onPress={onPress}>
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
        borderColor: isActive ? theme.textColor : 'transparent',
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
});

export default SplitComponent;