import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, ImageBackground, ActivityIndicator, Modal } from 'react-native';
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { fetchPublicUserData, getActiveSplit, getUserScores } from "../../api/profile";
import { useTheme } from "../ThemeProvider";
import { Header } from "../Components/Header";
import NavBar from "../Components/Navbar";
import UserInformation from "../Profile/ProfileComponents/UserInformation";
import DayCard from "../Profile/ProfileComponents/DayCard";
import Carousel from 'react-native-reanimated-carousel';
import DayComponent from "../HomeComponents/DayComponent";
import ScoreCard from "../Profile/ProfileComponents/ScoreCard";
import * as Haptics from 'expo-haptics';
import { getWorkoutDay } from "../../api/workout";
import { downloadFriendSplit, removeFriend } from "../../api/friends";
import WarningModal from "../Components/WarningModal";



const { height, width } = Dimensions.get('window');

const FriendProfileScreen = ({ navigation, route }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { friend } = route.params || {}; // Destructure with default empty object
    const categories = ["overall", "chest", "back", "shoulders", "arms", "legs"];
    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const [removeFriendWarningModalVisible, setRemoveFriendWarningModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);

    if (!friend) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No friend data available.</Text>
            </View>
        );
        
    }

    const handleSelectDay = async (dayName, activeSplit) => { 
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
            // Check if activeSplit is not null
            if (activeSplit) {
                const workoutDay = await getWorkoutDay(dayName, activeSplit);
                navigation.navigate('PreviewProfileWorkout', {
                    workoutDay,
                    splitName: friend.activeSplit.splitName,
                    user: friend.displayName
                });
            } else {
                console.log('Active split is null.');
                // Handle the case where activeSplit is null
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownloadFriendSplit = async () => { 
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setLoading(true); // Start loading
            await downloadFriendSplit(friend.uid);
            setLoading(false); 
            navigation.navigate('HomeNav', {
                screen: 'Home',
                params: { showNotification: { message: "Split Added!", color: theme.primaryColor } },
            });
        } catch (error) {
            setLoading(false);
            if (error.message === 'A split with this name already exists') {
                setWarningModalVisible(true);
            } else {
                console.error(error);
            }
        }
        
    };

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setWarningModalVisible(false);
        setRemoveFriendWarningModalVisible(false);
    }

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const renderScoreCards = () => {
        if (!friend.displayScores) {
            return (
                <Text style={styles.privateScoresText}>
                    {friend.username}'s scores are private
                </Text>
            );
        }
    
        return categories.map((category, index) => (
            <ScoreCard 
                key={index}
                category={capitalize(category)}
                score={friend.displayScores[category].score}
                change={friend.displayScores[category].change}
            />
        ));
    };

    const removeWarning = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setRemoveFriendWarningModalVisible(true);
    }

    // remove a friend
    const handleRemove = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await removeFriend(friend.uid);
        setRemoveFriendWarningModalVisible(false);
        navigation.navigate('Leaderboard', { reload: true, showNotification: { message: `${friend.username} removed!`, color: theme.dangerColor } });
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.header}>
                    <Ionicons name="chevron-back" onPress={() => navigation.goBack()}  size={getResponsiveFontSize(25)} color={theme.textColor} style={{position:'absolute', left: width*0.046}} />
                    <Text style={styles.headerText}>{friend.username}</Text>
                    <AntDesign name="deleteuser" onPress={() => removeWarning()}  size={getResponsiveFontSize(25)} color={theme.textColor} style={{position:'absolute', right: width*0.1}} />
                </View>
                <View style={styles.body}>
                    {/* User info */}
                    <View style={styles.userInfoContainer}>
                        <UserInformation
                            profilePicture={friend.profilePicture}
                            displayName={friend.displayName}
                            username={friend.username}
                            friendCount={friend.friendCount}
                            bio={friend.bio}
                        />
                    </View>
                    {/* Active Split */}

                    <View style={styles.activeSplitTextContainer}>
                        <Text style={styles.title}>Active Split</Text>
                        {friend.activeSplit && (
                            <TouchableOpacity onPress={handleDownloadFriendSplit}>
                                <MaterialIcons name="save-alt" size={getResponsiveFontSize(25)} color={theme.textColor} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.carouselContainer}>
                    {friend.activeSplit ? (
                        friend.activeSplit.days.length > 0 ? (
                            <Carousel
                                width={width}
                                height={width * 0.6}
                                data={friend.activeSplit.days.map(day => day.dayName)}
                                renderItem={({ item }) => <DayCard name={item} onPress={() => handleSelectDay(item, friend.activeSplit)} />}
                                mode="parallax"
                                modeConfig={{
                                    parallaxScrollingScale: 1,
                                    parallaxScrollingOffset: getResponsiveFontSize(210),
                                    parallaxAdjacentItemScale: 0.65,
                                    parallaxAdjacentItemOpacity: 0.8,
                                }}
                                snapEnabled={true}
                                pagingEnabled={true}
                                loop={false}
                            />
                        ) : (
                            <Text style={styles.noWorkoutsText}>
                                {friend.username}'s active split is empty
                            </Text>
                        )
                    ) : (
                        <Text style={styles.noWorkoutsText}>
                            {friend.username}'s active split is private
                        </Text>
                    )}
                    </View>
                    {/* Scores */}
                    <View style={styles.scoresContainer}>
                        <View style={styles.scoresTextContainer}>
                            <Text style={styles.title}>Scores</Text>
                        </View>
                        <View style={styles.scoreCardsContainer}>
                            {renderScoreCards()}
                        </View>
                    </View>
                </View>
            </ScrollView>
            {friend.activeSplit && (
                <WarningModal
                    visible={warningModalVisible}
                    msg={"Split Already Exists"}
                    subMsg={`Change the split name '${friend.activeSplit.splitName}' before downloading another one`}
                    close={handleClose}
                />
            )}
            <Modal
                transparent={true}
                animationType="fade"
                visible={removeFriendWarningModalVisible}
                onRequestClose={() => {}}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <AntDesign name="deleteuser" size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.warningIcon}/>
                        <Text style={styles.modalText}>Remove '{friend.username}'?</Text>
                        <Text style={styles.modalSubText}>You can always add them back.</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.endButton} onPress={handleClose}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.resumeButton} onPress={handleRemove}>
                                <Text style={styles.buttonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="auto" color="#fff" />
                </View>
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
        paddingTop: 40,
        backgroundColor: theme.backgroundColor
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(20),
        fontWeight: 'bold',
    },
    scrollViewContent: {
        paddingBottom: 120, 
        marginTop: 23, 
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(18),
    },
    body: {
        marginTop: 10,
        paddingHorizontal: 23
    },
    userInfoContainer: {
        marginTop: 40
    },
    activeSplitTextContainer: {
        marginTop: 80,
        marginHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(25),
        fontWeight: 'bold'
    },
    carouselContainer: {
        marginTop: 20,
        alignItems: 'center',
        
    },
    scoresContainer: {
        marginTop: 10
    },
    scoresTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    scoreCardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    noWorkoutsText: {
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(18),
        textAlign: 'center',
        paddingHorizontal: 40,
        marginVertical: 20,
    },
    privateScoresText: {
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(18),
        textAlign: 'center',
        paddingHorizontal: 40,
        marginVertical: 20,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: getResponsiveFontSize(14),
        color: theme.textColor,
        paddingTop: 20
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: width * 0.8,
        backgroundColor: theme.backdropColor,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: getResponsiveFontSize(20),
        fontWeight: '700',
        color: theme.textColor,
        marginBottom: 10,
    },
    modalSubText: {
        fontSize: getResponsiveFontSize(16),
        color: theme.grayTextColor,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    endButton: {
        width: width*0.25,
        backgroundColor: theme.grayTextColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginRight: 10
    },
    resumeButton: {
        width: width*0.25,
        backgroundColor: theme.primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginLeft: 10
    },
    buttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: '600',
        textAlign: 'center'
    },
    warningIcon: {
        marginBottom: 10
    }
   
});

export default FriendProfileScreen;