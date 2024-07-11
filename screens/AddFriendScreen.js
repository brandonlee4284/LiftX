import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "./ThemeProvider";
import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import { getUserUIDByUsername, sendFriendRequest, getFriendRequests, acceptFriendRequest, denyFriendRequest, synchronizeFriends, usernameRecieved } from '../api/friends';
import * as Haptics from 'expo-haptics';
import WarningModal from "./Components/WarningModal";


const { height, width } = Dimensions.get('window');

const AddFriendScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [notification, setNotification] = useState({ message: '', visible: false, color: theme.primaryColor });
    const notificationTimeoutRef = useRef(null);
    const slideAnim = useRef(new Animated.Value(-100)).current;
    // Fetch friend requests on component mount
    useEffect(() => {
        const synchronizeAndFetchRequests = async () => {
            setLoading(true); // Show loading indicator
            try {
                await synchronizeFriends();
                await fetchFriendRequests();
            } catch (error) {
                console.error('Error syncing and fetching friend requests: ' + error.message);
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
            console.error('Error fetching friend requests: ' + error.message);
        } finally {
            setLoading(false);
        }
    };


    const showNotification = (message, color) => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }
        setNotification({ message, visible: true, color });

        // Slide the notification in
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        notificationTimeoutRef.current = setTimeout(() => {
            // Slide the notification out
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setNotification({ message: '', visible: false, color: theme.primaryColor });
            });
        }, 5000);
    };

    const handleFindUser = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setLoading(true);
        try {
            const sanitizedUsername = username.trim();
            const uid = await getUserUIDByUsername(sanitizedUsername);
            if (uid) {
                await usernameRecieved(sanitizedUsername);
                await sendFriendRequest(uid, sanitizedUsername);
                showNotification('Friend request sent!', theme.primaryColor);
            } else {
                showNotification('Username not found!', theme.dangerColor);
            }
        } catch (error) {
            if (error.message === 'Friend request already sent.') {
                showNotification('Friend request is pending', theme.warningColor);
            } else if (error.message === 'This user is already your friend.') {
                showNotification('User is already your friend', theme.warningColor);
            } else if (error.message === 'User has already sent you a friend request.') {
                showNotification('User already sent you a friend request, check pending requests', theme.warningColor);
            } else if (error.message === 'You cannot add yourself as a friend.') {
                showNotification('Cannot send a friend request to yourself', theme.warningColor);
            } else {
                console.error('Error finding user: ' + error.message);
                showNotification('Error sending friend request. Please try again.', theme.dangerColor);
            }
        } finally {
            setLoading(false);
            setUsername('');
        }
    };

    const handleAcceptRequest = async (senderUid, senderUsername) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setLoading(true);
        try {
            await acceptFriendRequest(senderUid, senderUsername);
            showNotification('Friend request accepted!', theme.primaryColor);
            fetchFriendRequests(); // Refresh the friend requests list
        } catch (error) {
            console.error('Error accepting friend request: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async (senderUid) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setLoading(true);
        try {
            await denyFriendRequest(senderUid);
            fetchFriendRequests(); // Refresh the friend requests list
            showNotification('Friend request removed!', theme.dangerColor);
        } catch (error) {
            console.error('Error rejecting friend request: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                    {friendRequests.length === 0 ? (
                        <Text style={styles.noRequestsText}>No new friend requests</Text>
                    ) : (
                        friendRequests.map((request, index) => (
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
                                        <AntDesign
                                            name="adduser"
                                            size={getResponsiveFontSize(20)}
                                            color={theme.backgroundColor}
                                            style={styles.addIcon}
                                        />
                                        <Text style={styles.buttonText}>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.rejectButton]}
                                        onPress={() => handleRejectRequest(request.senderUid)}
                                    >
                                        <Octicons
                                            name="x"
                                            size={getResponsiveFontSize(18)}
                                            color={theme.grayTextColor}
                                            style={styles.addIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
                
            </ScrollView>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="medium" color="#fff" />
                </View>
            )}
            {notification.visible && (
                <Animated.View style={[styles.notificationContainer, { backgroundColor: notification.color, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.notificationText}>{notification.message}</Text>
                </Animated.View>
            )}
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
        paddingTop: height > 850 ? 50 : 40,
        backgroundColor: theme.backgroundColor,
    },
    scrollContainer: {
        marginTop: 10,
        paddingBottom: 80,
    },
    headerContainer: {
        //marginTop: 50,
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
        fontWeight: 'bold',
        color: theme.backgroundColor
    },
    buttonRemoveText: {
        fontWeight: 'bold',
        color: theme.textColor
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
    addIcon: {
        marginRight: 5,
    },
    friendDisplayName: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: 'bold',
        paddingBottom: 5
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    friendRequestText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(12),
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 20,
        marginLeft: 10,
    },
    acceptButton: {
        backgroundColor: theme.primaryColor,
        alignItems: 'center'
    },
    rejectButton: {
        backgroundColor: theme.backgroundColor,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationContainer: {
        position: 'absolute',
        width: width,
        paddingTop: 50,
        padding: 10,
        backgroundColor: theme.primaryColor,
        borderRadius: 20,
        alignItems: 'center',
    },
    notificationText: {
        color: theme.textColor,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    noRequestsText: {
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(16),
        textAlign: 'center',
        marginTop: 30,
    },

});

export default AddFriendScreen;