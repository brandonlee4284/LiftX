// SplitComponent.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeProvider';

const { width } = Dimensions.get('window');

const AddSplitComponent = ({ onPress }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableOpacity style={styles.splitCard} onPress={onPress}>
            <Text style={styles.splitCardText}>+</Text>
        </TouchableOpacity>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    splitCard: {
        width: width * 0.435,
        height: width * 0.28,
        backgroundColor: "rgba(217, 217, 217, 0.1)",
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,

    },
    splitCardText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(40),
        fontWeight: '300',
    },
});

export default AddSplitComponent;