import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from "../Components/Header";
import { useTheme } from "../ThemeProvider";
import NavBar from "../Components/Navbar";
import UserContainer from "./LeaderboardComponents/UserContainer";
import { getUserDetails, getFriendList, synchronizeFriends } from '../../api/friends';
import * as Haptics from 'expo-haptics';

const { height, width } = Dimensions.get('window');

const LeaderboardScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [loading, setLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friendProfilePicture, setFriendProfilePicture] = useState("");
    const [friendOverallScore, setFriendOverallScore] = useState(0);

    useEffect(() => {
        const synchronizeAndFetchFriends = async () => {
            setLoading(true); // Show loading indicator
            try {
                const startSync = Date.now();
                await synchronizeFriends();   
                const friendsList = await getFriendList();
                if (friendsList) {
                    const friendsWithDetails = await Promise.all(
                        friendsList.map(async (friend) => {
                            const userDetails = await getUserDetails(friend.uid);
                            return {
                                ...friend,
                                profilePicture: userDetails?.profilePicture,
                                displayName: userDetails?.displayName,
                                friendCount: userDetails?.friendCount,
                                bio: userDetails?.bio,
                                activeSplit: userDetails?.activeSplit,
                                displayScores: userDetails?.displayScores
                            };
                        })
                    );
                    setFriends(friendsWithDetails);
                    const endSync = Date.now();
                    console.log(`Fetching and synchronizing all friend data took ${endSync - startSync} ms`);
                } else {
                    console.log("friend list is null");
                }
            } catch (error) {
                alert('Error syncing friends: ' + error.message);
            } finally {
                setLoading(false); // Hide loading indicator
            }
        };
    
        synchronizeAndFetchFriends();
    }, []);

    const handleFriendProfile = async (friend) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.navigate("FriendProfile", { friend })
    };

    const renderFriends = () => {
        if (loading) {
            return <ActivityIndicator size="medium" color={theme.textColor} style={{ padding: 100 }}/>;
        }

        if (friends.length === 0) {
            return <Text style={styles.noFriendsText}>Add friends to see who's the strongest</Text>;
        }

        return friends.map((friend, index) => (
            <UserContainer
                key={friend.uid}
                rank={index + 1} // Assuming the list is already sorted
                username={friend.username}   
                profilePicture={friend.profilePicture}
                score={friend.displayScores?.overall || 'N/A'}
                onPress={() => handleFriendProfile(friend)}
            />
        ));
    };

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
                            {renderFriends()}
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
        paddingTop: 40,
        backgroundColor: theme.backgroundColor
    },
    body: {
        marginTop: 30,
        paddingHorizontal: 23
    },
    scrollViewContent: {
        paddingBottom: 110, 
        marginTop: 23, 
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
    },
    noFriendsText: {
        textAlign: 'center',
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(18),
        marginTop: 20
    },
    
});


export default LeaderboardScreen;
