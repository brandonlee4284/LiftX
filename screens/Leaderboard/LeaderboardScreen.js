import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from "../Components/Header";
import { useTheme } from "../ThemeProvider";


const { height, width } = Dimensions.get('window');

const LeaderboardScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Header page="Leaderboard" />
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
        alignItems: "center",
        paddingTop: 78,
        backgroundColor: theme.backgroundColor
    },
    
});


export default LeaderboardScreen;
