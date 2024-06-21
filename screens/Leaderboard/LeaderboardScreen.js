import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from "../Components/Header";
import { useTheme } from "../ThemeProvider";
import NavBar from "../Components/Navbar";
import UserContainer from "./LeaderboardComponents/UserContainer";

const { height, width } = Dimensions.get('window');

const LeaderboardScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <NavBar activeRoute="LeaderboardNav"/>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Header page="Leaderboard" />
                <View style={styles.body}>
                        {/* Title */}
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Leaderboard</Text>
                            <Ionicons name="information-circle-outline" size={getResponsiveFontSize(25)} color={theme.textColor} />
                        </View>

                        {/* Leaderboard */}
                        <View style={styles.leaderboardContainer}>
                            {/* example leaderboard */}
                            <UserContainer rank="1" username="brandon" profilePicture="" score="4.6" />
                            <UserContainer rank="1" username="brandon" profilePicture="" score="4.6" />
                            <UserContainer rank="1" username="brandon" profilePicture="" score="4.6" />
                            <UserContainer rank="1" username="brandon" profilePicture="" score="4.6" />
                        </View>
                        
                </View>
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
        paddingTop: 78,
        backgroundColor: theme.backgroundColor
    },
    body: {
        marginTop: 30,
        paddingHorizontal: 23
    },
    scrollViewContent: {
        paddingBottom: 110, 
        marginTop: 3, 
    },
    title: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(25),
        fontWeight: 'bold'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leaderboardContainer: {
        marginTop: 20
    }
    
});


export default LeaderboardScreen;
