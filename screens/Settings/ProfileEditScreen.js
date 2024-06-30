import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../ThemeProvider";

const { width } = Dimensions.get('window');

const ProfileEditScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    },
    
});

export default ProfileEditScreen;