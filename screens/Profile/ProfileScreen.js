import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { fetchPublicUserData, fetchPrivateUserData } from "../../api/userData";

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
                        <Ionicons name="person-add-outline" size={28} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                        <Ionicons name="chatbubble-ellipses-outline" size={28} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                        <Ionicons name="settings-outline" size={28} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    {!!publicUserData.profilePicture ? (
                        <Image source={{ uri: publicUserData.profilePicture }} style={styles.profilePicture} />
                    ) : (
                        <Ionicons name="person-circle" size={150} color="gray" style={styles.profileIcon} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 50
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20
    },
    displayName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10
    },
    username: {
        fontSize: 18,
        color: "gray",
        marginBottom: 5
    },
    friendsCount: {
        fontSize: 18,
        color: "black",
        marginBottom: 20
    },
    boldText: {
        fontWeight: "bold"
    },
    bio: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20
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
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20
    },
    daysContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    dayCard: {
        width: 200,
        backgroundColor: "white",
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
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center"
    },
    exerciseRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5
    },
    exerciseName: {
        fontSize: 16,
        flex: 1,
        flexWrap: 'wrap'
    },
    exerciseStats: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "right"
    },
    statsContainer: {
        width: '80%',
        marginBottom: 20
    },
    statsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
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
        fontSize: 16
    },
    statValue: {
        fontSize: 16,
        fontWeight: "bold"
    },
    editButton: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20
    },
    editButtonText: {
        color: "white",
        fontSize: 16
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
        fontSize: 24,
        fontWeight: 'bold'
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