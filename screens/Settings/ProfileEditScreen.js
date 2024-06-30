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
            <View style={styles.circle}/>
            <View style={styles.headerContainer}>
                <Ionicons name="arrow-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                <Text style={styles.header}>Edit Profile</Text>
            </View>
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
    circle: {
        position: 'absolute',
        width: width * 2.29, 
        height: width * 2.29, 
        borderRadius: (width * 2.29) / 2,
        backgroundColor: theme.backdropColor,
        bottom: -width * 0.8,  
        right: -width * 0.6335,  
        zIndex: -1,
        justifyContent: 'center'
    },
    headerContainer: {
        marginTop: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        right: width*0.25
    },
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(26),
        fontWeight: '800',
        left: -0.03*width
    },
    
});

export default ProfileEditScreen;