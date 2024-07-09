import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from "../Components/Header";
import { useTheme } from "../ThemeProvider";
import NavBar from "../Components/Navbar";
import UserContainer from "./LeaderboardComponents/UserContainer";
import { getUserDetails, getFriendList, synchronizeFriends } from '../../api/friends';
import * as Haptics from 'expo-haptics';
import { fetchPublicUserData } from "../../api/profile";
import FriendContainer from "./LeaderboardComponents/FriendContainer";
import InformationModal from "../Components/InformationModal"; 
import { useFocusEffect } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const LeaderboardScreen = ({ navigation, route }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [loading, setLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [reload, setReload] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (route.params?.reload) {
                const synchronizeAndFetchFriends = async () => {
                    setLoading(true); // Show loading indicator
                    try {
                        const startSync = Date.now();
                        await synchronizeFriends();   
                        const userData = await fetchPublicUserData();
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
                            const userWithDetails = {
                                uid: "currentUser",
                                username: "You",
                                profilePicture: userData?.profilePicture,
                                displayScores: {
                                    overall: userData?.displayScore?.overall.toFixed(1) || '-'
                                }
                            };
        
                            const allFriends = [userWithDetails, ...friendsWithDetails];
                            handleLeaderboardRanks(allFriends);  // Call with the updated friends array
                            setFriends(allFriends);
                            
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
                navigation.setParams({ reload: false });
            }
        }, [route.params?.reload])
    );

    useEffect(() => {
        const synchronizeAndFetchFriends = async () => {
            setLoading(true); // Show loading indicator
            try {
                const startSync = Date.now();
                await synchronizeFriends();   
                const userData = await fetchPublicUserData();
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
                    const userWithDetails = {
                        uid: "currentUser",
                        username: "You",
                        profilePicture: userData?.profilePicture,
                        displayScores: {
                            overall: userData?.displayScore?.overall.toFixed(1) || '-'
                        }
                    };

                    const allFriends = [userWithDetails, ...friendsWithDetails];
                    handleLeaderboardRanks(allFriends);  // Call with the updated friends array
                    setFriends(allFriends);
                    
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

    // sort friends by overall score descending
    const handleLeaderboardRanks = (friendsArray) => {
        const sortedFriends = friendsArray.sort((a, b) => {
            const scoreA = parseFloat(a.displayScores?.overall) || 0;
            const scoreB = parseFloat(b.displayScores?.overall) || 0;
            return scoreB - scoreA;
        });
        setFriends(sortedFriends);
    };


    const renderFriends = () => {
        if (loading) {
            return <ActivityIndicator size="medium" color={theme.textColor} style={{ padding: 100 }}/>;
        }

        if (friends.length === 0) {
            return <Text style={styles.noFriendsText}>No friends found</Text>;
        }
        
        return friends.map((friend, index) => {
            if (friend.uid === "currentUser") {
                return (
                    <View key={friend.uid}>
                        <UserContainer
                            rank={index + 1}
                            username={friend.username}
                            profilePicture={friend.profilePicture}
                            score={friend.displayScores?.overall || '-'}
                        />
                    </View>
                );
            } else {
                return (
                    <FriendContainer
                        key={friend.uid}
                        rank={index + 1}
                        username={friend.username}
                        profilePicture={friend.profilePicture}
                        score={friend.displayScores?.overall || '-'}
                        onPress={() => handleFriendProfile(friend)}
                    />
                );
            }
        });
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
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Ionicons name="information-circle-outline" size={getResponsiveFontSize(25)} color={theme.textColor} />
                            </TouchableOpacity>
                        </View>

                        {/* Leaderboard */}
                        <View style={styles.leaderboardContainer}>
                            {/* example leaderboard */}
                            {renderFriends()}
                        </View>
                        
                </View>
            </ScrollView>
            <InformationModal
                visible={modalVisible}
                close={() => setModalVisible(false)}
                msg="Leaderboard"
                subMsg="This is a brief explanation of the leaderboard, how scores are calculated, and how you can improve your rank."
            />
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
