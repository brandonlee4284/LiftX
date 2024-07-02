import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, ImageBackground  } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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



const { height, width } = Dimensions.get('window');

const FriendProfileScreen = ({ navigation, route }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { friend } = route.params || {}; // Destructure with default empty object
    const categories = ["overall", "chest", "back", "shoulders", "arms", "legs"];

    const stats = {
        overall: 85,
        chest: 75,
        back: 80,
        shoulders: 78,
        arms: 76,
        legs: 82
    } // placeholder stats

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
            const workoutDay = await getWorkoutDay(dayName, activeSplit);
            navigation.navigate('ProfileNav', {
                screen: 'PreviewProfileWorkout',
                params: { workoutDay, splitName: friend.activeSplit.splitName, user: friend.displayName },
            });
        } catch (error) {
            console.error(error);
        }
    };

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const renderScoreCards = () => {
        return categories.map((category, index) => (
            <ScoreCard 
                key={index}
                category={capitalize(category)}
                score={friend.displayScores[category]}
                stat={stats[category]}
            />
        ));
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.header}>
                    <Ionicons name="chevron-back" onPress={() => navigation.goBack()}  size={getResponsiveFontSize(25)} color={theme.textColor} style={{left:-width * 0.32}} />
                    <Text style={styles.headerText}>{friend.username}</Text>
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
                        <MaterialIcons name="save-alt" size={getResponsiveFontSize(25)} color={theme.textColor} />
                    </View>
                    <View style={styles.carouselContainer}>
                        {friend.activeSplit.days.length > 0 ? (
                            <Carousel
                                width={width}
                                height={width * 0.5}
                                data={friend.activeSplit.days.map(day => day.dayName)}
                                renderItem={({ item }) => <DayCard name={item} onPress={() => handleSelectDay(item, friend.activeSplit)} />}
                                mode="parallax"
                                modeConfig={{
                                    parallaxScrollingScale: 1,
                                    parallaxScrollingOffset: getResponsiveFontSize(250),
                                    parallaxAdjacentItemScale: 0.65,
                                    parallaxAdjacentItemOpacity: 0.8,
                                }}
                                snapEnabled={true}
                                pagingEnabled={true}
                                loop={false}
                            />
                        ) : (
                            <Text style={styles.noWorkoutsText}>
                                {friend.displayName} has no workouts in their active split
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
        width: '100%',
        flexDirection: 'row',
        //alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(20),
        fontWeight: 'bold',
        left: -width*0.04
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
        marginVertical: 90,
    },
    
   
});

export default FriendProfileScreen;