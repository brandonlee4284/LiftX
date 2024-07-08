import React from 'react';
import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../ThemeProvider";

const { height, width } = Dimensions.get('window');

const ExerciseDropdown = ({ navigation }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    

    return (
        <View style={styles.container}>
            
        </View>
    );
}


const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({    
    container: {
        backgroundColor: theme.backgroundColor,
    }
    
  
});

export default ExerciseDropdown;