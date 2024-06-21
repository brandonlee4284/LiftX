import React from 'react';
import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation  } from '@react-navigation/native';
import { useTheme } from "../ThemeProvider";
import Ionicons from '@expo/vector-icons/Ionicons';

const { height, width } = Dimensions.get('window');

export function NavBar({ activeRoute }) {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
    };
    

    return (
        <View style={styles.floatingContainer}>
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => navigateToScreen('HomeNav')} style={styles.iconContainer}>
                    <Ionicons 
                        name={activeRoute === 'HomeNav' ? 'home' : 'home-outline'} 
                        size={getResponsiveFontSize(24)} 
                        color={theme.textColor} 
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToScreen('LeaderboardNav')} style={styles.iconContainer}>
                    <Ionicons 
                        name={activeRoute === 'LeaderboardNav' ? 'podium' : 'podium-outline'} 
                        size={getResponsiveFontSize(24)} 
                        color={theme.textColor} 
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateToScreen('ProfileNav')} style={styles.iconContainer}>
                    <Ionicons 
                        name={activeRoute === 'ProfileNav' ? 'person' : 'person-outline'} 
                        size={getResponsiveFontSize(24)} 
                        color={theme.textColor} 
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
}


const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({    
    floatingContainer: {
        position: 'absolute',
        bottom: height * 0.03,
        left: width * 0.1,
        right: width * 0.1,
        alignItems: 'center',
        zIndex: 999, 
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: width * 0.8,
        height: width * 0.15,
        backgroundColor: theme.navbarColor,
        borderRadius: (width * 0.2) / 2,

    },
    iconContainer: {
        flex: 1,
        alignItems: 'center',
    },
  
});

export default NavBar;