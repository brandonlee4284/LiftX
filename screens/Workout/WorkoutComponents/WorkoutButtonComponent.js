import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from "../../ThemeProvider";
import { Ionicons } from "@expo/vector-icons";



const { height, width } = Dimensions.get('window');

const WorkoutButtonComponent = ({ text, onPress }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
  
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};


const createStyles = (theme) => StyleSheet.create({    
    button: {
        width: width * 0.5,
        height: getResponsiveFontSize(57),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 20,
       
    },
    buttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
    },
    
    

});

export default WorkoutButtonComponent;