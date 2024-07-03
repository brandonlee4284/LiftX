import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "./ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { getUserUIDByUsername, sendFriendRequest, getFriendRequests, acceptFriendRequest, denyFriendRequest, synchronizeFriends } from '../api/friends';
import * as Haptics from 'expo-haptics';


const { height, width } = Dimensions.get('window');

const AddFriendScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);

    // Fetch friend requests on component mount
    useEffect(() => {
        const synchronizeAndFetchRequests = async () => {
            setLoading(true); // Show loading indicator
            try {
                await synchronizeFriends();
                await fetchFriendRequests();
            } catch (error) {
                alert('Error syncing and fetching friend requests: ' + error.message);
            } finally {
                setLoading(false); // Hide loading indicator
            }
        };

        synchronizeAndFetchRequests();
    }, []);


    const fetchFriendRequests = async () => {
        setLoading(true);
        try {
            const requests = await getFriendRequests();
            setFriendRequests(requests);
        } catch (error) {
            alert('Error fetching friend requests: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFindUser = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setLoading(true);
        try {
            const uid = await getUserUIDByUsername(username);
            if (uid) {
                await sendFriendRequest(uid, username);
                alert('Friend request sent!');
            } else {
                alert('User not found!');
            }
        } catch (error) {
            alert('Error finding user: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (senderUid, senderUsername) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setLoading(true);
        try {
            await acceptFriendRequest(senderUid, senderUsername);
            alert('Friend request accepted!');
            fetchFriendRequests(); // Refresh the friend requests list
        } catch (error) {
            alert('Error accepting friend request: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async (senderUid) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setLoading(true);
        try {
            await denyFriendRequest(senderUid);
            alert('Friend request rejected!');
            fetchFriendRequests(); // Refresh the friend requests list
        } catch (error) {
            alert('Error rejecting friend request: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons name="chevron-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon} />
                <Text style={styles.header}>Add Friends</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter friend's username"
                    placeholderTextColor={theme.grayTextColor}
                    value={username}
                    onChangeText={setUsername}
                />
                <TouchableOpacity style={styles.button} onPress={handleFindUser} disabled={loading}>
                    <Text style={styles.buttonText}>Send request</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.friendRequestsContainer}>
                <Text style={styles.friendRequestsTitle}>Pending Requests</Text>
                {friendRequests.map((request, index) => (
                    <View key={index} style={styles.friendRequestRow}>
                        {request.senderPFP ? (
                            <Image
                                source={{ uri: request.senderPFP }}
                                style={styles.profilePicture}
                            />
                        ) : (
                            <Ionicons
                                name="person-circle"
                                size={getResponsiveFontSize(50)}
                                color={theme.textColor}
                                style={styles.defaultIcon}
                            />
                        )}
                        <View style={styles.textContainer}>
                            <Text style={styles.friendDisplayName}>{request.senderDisplayName}</Text>
                            <Text style={styles.friendRequestText}>{request.senderUsername}</Text>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.acceptButton]}
                                onPress={() => handleAcceptRequest(request.senderUid, request.senderUsername)}
                            >
                                <Text style={styles.buttonText}>+ Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.rejectButton]}
                                onPress={() => handleRejectRequest(request.senderUid)}
                            >
                                <Text style={styles.buttonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    headerContainer: {
        marginTop: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        right: width * 0.25,
    },
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(26),
        fontWeight: '800',
        left: -0.03 * width,
    },
    inputContainer: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 45,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: theme.textColor,
        borderRadius: 10,
        color: theme.textColor,
        marginRight: 10,
    },
    button: {
        padding: 10,
        backgroundColor: theme.primaryColor,
        borderRadius: 10,
    },
    buttonText: {
        color: theme.buttonTextColor,
        fontWeight: 'bold',
    },
    friendRequestsContainer: {
        marginTop: 30,
        paddingHorizontal: 45,
    },
    friendRequestsTitle: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(22),
        fontWeight: 'bold',
        marginBottom: 10,
    },
    friendRequestRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    profilePicture: {
        width: width*0.116,
        height: width*0.116,
        borderRadius: (width*0.116) / 2,
        marginRight: 10,
    },
    defaultIcon: {
        width: width*0.116,
        height: width*0.116,
        marginRight: 10,
    },
    friendDisplayName: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    friendRequestText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(18),
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        padding: 10,
        borderRadius: 10,
        marginLeft: 10,
    },
    acceptButton: {
        backgroundColor: theme.primaryColor,
    },
    rejectButton: {
        backgroundColor: theme.primaryColor,
    },
});

export default AddFriendScreen;