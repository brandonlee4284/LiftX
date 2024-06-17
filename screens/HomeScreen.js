import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchPublicUserData } from '../api/userData';
import { Header } from "./Components/Header";
import { useTheme } from "./ThemeProvider";


const { height, width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
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
           <Header page="Home" />
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
        backgroundColor: theme.backgroundColor,
    },
    
});

export default HomeScreen;