import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, ImageBackground  } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { fetchPublicUserData, getActiveSplit, getUserScores } from "../api/profile";
import { useTheme } from "./ThemeProvider";
import { Header } from "./Components/Header";
import NavBar from "./Components/Navbar";
import UserInformation from "./Profile/ProfileComponents/UserInformation";
import DayCard from "./Profile/ProfileComponents/DayCard";
import Carousel from 'react-native-reanimated-carousel';
import DayComponent from "./HomeComponents/DayComponent";
import ScoreCard from "./Profile/ProfileComponents/ScoreCard";
import * as Haptics from 'expo-haptics';
import { getWorkoutDay } from "../api/workout";


const { height, width } = Dimensions.get('window');

const FriendProfileScreen = ({ navigation, route }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { friend } = route.params || {}; // Destructure with default empty object

    if (!friend) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No friend data available.</Text>
            </View>
        );
        
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.friendName}>{friend.username}</Text>
                {/* Render more details about the friend */}
            </ScrollView>
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
        paddingTop: 40,
        backgroundColor: theme.backgroundColor
    },
    scrollViewContent: {
        paddingBottom: 120, 
        marginTop: 23, 
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(18),
    },
    friendName: {
        textAlign: 'center',
        marginTop: 20,
        color: theme.textColor,
        fontSize: getResponsiveFontSize(22),
    },
    
   
});

export default FriendProfileScreen;