import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { fetchPublicUserData, fetchPrivateUserData } from "../../api/userData";
import { useTheme } from "../ThemeProvider";
import { Header } from "../Components/Header";
import NavBar from "../Components/Navbar";

const { height, width } = Dimensions.get('window');

const ProfileScreen = ({ navigation, route }) => {
    const [publicUserData, setPublicUserData] = useState({});
    const { theme } = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        async function fetchData() {
            const data = await fetchPublicUserData();
            if (data) {
                setPublicUserData(data);
            }
        }

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Header page="Profile" />
            <NavBar activeRoute="ProfileNav"/>
           
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

export default ProfileScreen;