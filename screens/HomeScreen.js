import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchPublicUserData } from '../api/userData';

const HomeScreen = ({ navigation }) => {
    const [publicUserData, setPublicUserData] = useState({});

    useEffect(() => {
        async function fetchData() {
            const data = await fetchPublicUserData();
            if (data) {
                setPublicUserData(data);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        LayoutAnimation.easeInEaseOut();
    }, []);

    const handleWorkoutButtonPress = () => {
        navigation.navigate('Workout');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.topBar}>
                    <Text style={styles.title}>LiftX</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                            <Ionicons name="person-add-outline" size={28} color="white" style={styles.profileIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                            <Ionicons name="chatbubble-ellipses-outline" size={28} color="white" style={styles.profileIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                            <Ionicons name="settings-outline" size={28} color="white" style={styles.profileIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.body}>
                    <Text style={styles.welcomeMessage}>Welcome Back, {publicUserData.username}!</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleWorkoutButtonPress}>
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>Start Today's Workout</Text>
                            <Ionicons name="arrow-forward-circle-outline" size={28} color="black" style={styles.icon} />
                        </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 70,
        backgroundColor: '#121212', // Dark background color
    },
    scrollContent: {
        minWidth: '100%',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white', // Light text color
    },
    body: {
        marginTop: 50,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileIcon: {
        marginLeft: 15,
    },
    welcomeMessage: {
        fontSize: 26,
        marginBottom: 20,
        color: 'white', // Light text color,
        marginLeft: 20
    },
    buttonContainer: {
        alignItems: "center", // Center content horizontally
        marginBottom: 20, // Add margin bottom to create space between the message and button
    },
    button: {
        backgroundColor: "white",
        borderRadius: 20,
        height: 100,
        width: 400,
        alignItems: "center", // Center button content horizontally
        justifyContent: "center", // Center button content vertically
    },
    buttonContent: {
        flexDirection: 'row', // Align text and icon horizontally
        alignItems: 'center', // Align text and icon vertically
    },
    buttonText: {
        color: "black",
        fontSize: 24,
        marginRight: 90, // Add space between text and icon
    },
    icon: {
        padding: 10,
    },
});

export default HomeScreen;