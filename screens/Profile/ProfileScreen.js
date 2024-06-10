import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { fetchPublicUserData, fetchPrivateUserData } from "../../api/userData";

const { height, width } = Dimensions.get('window');

const ProfileScreen = ({ navigation, route }) => {
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

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.title}>LiftX</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                        <Ionicons name="person-add-outline" size={getResponsiveFontSize(28)} color="white" style={styles.profileIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                        <Ionicons name="chatbubble-ellipses-outline" size={getResponsiveFontSize(28)} color="white" style={styles.profileIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                        <Ionicons name="settings-outline" size={getResponsiveFontSize(28)} color="white" style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    {!!publicUserData.profilePicture ? (
                        <Image source={{ uri: publicUserData.profilePicture }} style={styles.profilePicture} />
                    ) : (
                        <Ionicons name="person-circle" size={getResponsiveFontSize(150)} color="gray" style={styles.profileIcon} />
                    )}
                    <Text style={styles.username}>@{publicUserData.username}</Text>
                    <Text style={styles.friendsCount}>
                        <Text style={styles.boldText}>{publicUserData.numFriends}</Text> friends
                    </Text>
                    <Text style={styles.bio}>{publicUserData.bio}</Text>

                    {/* <View style={styles.splitContainer}>
                        <View style={styles.line} />
                        <Text style={styles.splitText}>Current Split</Text>
                    </View>

                    <ScrollView horizontal contentContainerStyle={styles.daysContainer} showsHorizontalScrollIndicator={false}>
                        {workoutSplit && Object.keys(workoutSplit).map(day => renderExerciseCard(day, workoutSplit[day]))}
                    </ScrollView>

                    <View style={styles.line} />

                    <View style={styles.statsContainer}>
                        <Text style={styles.statsHeader}>Gym Stats</Text>
                        {publicUserData.displayStats && Object.entries(publicUserData.displayStats).map(([exercise, stats], index) => (
                            <View key={index} style={styles.statItem}>
                                <Text style={styles.statExercise}>{exercise}</Text>
                                <Text style={styles.statValue}>{stats}</Text>
                            </View>
                        ))}
                    </View> */}

                    <View style={styles.line} />

                    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('ProfileEdit')}>
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 70,
        backgroundColor: '#121212' // Dark background color
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20
    },
    displayName: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: "bold",
        marginBottom: 10,
        color: 'white' // Light text color
    },
    username: {
        fontSize: 18,
        color: "gray",
        marginBottom: 5
    },
    friendsCount: {
        fontSize: getResponsiveFontSize(18),
        color: "white",
        marginBottom: 20
    },
    boldText: {
        fontWeight: "bold"
    },
    bio: {
        fontSize: getResponsiveFontSize(16),
        textAlign: "center",
        marginBottom: 20,
        color: 'white' // Light text color
    },
    splitContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: 'lightgray',
        marginTop: 20,
        marginBottom: 20,
    },
    splitText: {
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
        color: 'white', // Light text color
        marginBottom: 20
    },
    daysContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    dayCard: {
        width: 200,
        backgroundColor: "#1E1E1E", // Dark card background color
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5
    },
    dayTitle: {
        fontSize: getResponsiveFontSize(18),
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: 'white' // Light text color
    },
    exerciseRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5
    },
    exerciseName: {
        fontSize: getResponsiveFontSize(16),
        flex: 1,
        flexWrap: 'wrap',
        color: 'white' // Light text color
    },
    exerciseStats: {
        fontSize: getResponsiveFontSize(16),
        fontWeight: "bold",
        textAlign: "right",
        color: 'white' // Light text color
    },
    statsContainer: {
        width: '80%',
        marginBottom: 20
    },
    statsHeader: {
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
        color: 'white', // Light text color
        textAlign: 'center',
        marginBottom: 20
    },
    statItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginBottom: 5
    },
    statExercise: {
        fontSize: getResponsiveFontSize(16),
        color: 'white' // Light text color
    },
    statValue: {
        fontSize: getResponsiveFontSize(16),
        fontWeight: "bold",
        color: 'white' // Light text color
    },
    editButton: {
        backgroundColor: "gray",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20
    },
    editButtonText: {
        color: "white",
        fontSize: getResponsiveFontSize(16)
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20
    },
    title: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: 'bold',
        color: 'white' // Light text color
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileIcon: {
        marginLeft: 15
    },
    scrollContent: {
        minWidth: '100%',
    },
});

export default ProfileScreen;