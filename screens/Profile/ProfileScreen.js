import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, ImageBackground  } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { fetchPublicUserData, getActiveSplit, getUserScores } from "../../api/profile";
import { useTheme } from "../ThemeProvider";
import { Header } from "../Components/Header";
import NavBar from "../Components/Navbar";
import UserInformation from "./ProfileComponents/UserInformation";
import backgroundImage from "../../assets/profilebackDrop.png";
import DayCard from "./ProfileComponents/DayCard";
import Carousel from 'react-native-reanimated-carousel';
import DayComponent from "../HomeComponents/DayComponent";
import ScoreCard from "./ProfileComponents/ScoreCard";
import * as Haptics from 'expo-haptics';
import { getWorkoutDay } from "../../api/workout";


const { height, width } = Dimensions.get('window');

const ProfileScreen = ({ navigation, route }) => {
    const [publicUserData, setPublicUserData] = useState({});
    const [activeSplitDays, setActiveSplitDays] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const categories = ["Overall", "Chest", "Back", "Shoulders", "Arms", "Legs"];
    const [activeSplit, setActiveSplitState] = useState(null);
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const stats = [82.2, 93.3, 84.4, 80.2, 85.3, 74.1]; // placeholder stats
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch public user data
                const userData = await fetchPublicUserData();
                if (userData) {
                    setPublicUserData(userData);
                }
    
                // Fetch active split day names
                const fetchedActiveSplit = await getActiveSplit();
                if (fetchedActiveSplit) {
                    setActiveSplitDays(fetchedActiveSplit.days);
                    setActiveSplitState(fetchedActiveSplit); 
                }
    
                // Fetch user scores
                const fetchedUserScores = await getUserScores();
                if (fetchedUserScores){
                    setUserScores(fetchedUserScores);
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []); 

    const renderScoreCards = () => {
        return categories.map((category, index) => (
            <ScoreCard 
                key={index}
                category={category}
                score={userScores[index]}
                stat={stats[index]}
            />
        ));
    };

    const handleSnap = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    const handleSelectDay = async (dayName, activeSplit) => { 
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            const workoutDay = await getWorkoutDay(dayName, activeSplit);
            navigation.navigate('PreviewProfileWorkout', { workoutDay, splitName: activeSplit.splitName, user: publicUserData.displayName });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <NavBar activeRoute="ProfileNav"/>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="contain"/>
                <Header page="Profile" />
                <View style={styles.body}>
                    {/* User info */}
                    <View style={styles.userInfoContainer}>
                        <UserInformation
                            profilePicture={publicUserData.profilePicture}
                            displayName={publicUserData.displayName}
                            username={publicUserData.username}
                            friendCount={publicUserData.numFriends}
                            bio={publicUserData.bio}
                        />
                    </View>
                    {/* Active Split */}

                    <View style={styles.activeSplitTextContainer}>
                        <Text style={styles.title}>Active Split</Text>
                        <MaterialIcons name="save-alt" size={getResponsiveFontSize(25)} color={theme.textColor} />
                    </View>
                    <View style={styles.carouselContainer}>
                        {activeSplitDays.length > 0 ? (
                            <Carousel
                                width={width}
                                height={width * 0.5}
                                data={activeSplitDays.map(day => day.dayName)}
                                renderItem={({ item }) => <DayCard name={item} onPress={() => handleSelectDay(item, activeSplit)} />}
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
                                onSnapToItem={handleSnap}
                            />
                        ) : (
                            <Text style={styles.noWorkoutsText}>
                                {publicUserData.displayName} has no workouts in their active split
                            </Text>
                        )}
                    </View>
                    {/* Scores */}
                    <View style={styles.scoresContainer}>
                        <View style={styles.scoresTextContainer}>
                            <Text style={styles.title}>Scores</Text>
                            <Ionicons name="information-circle-outline" size={getResponsiveFontSize(25)} color={theme.textColor} style={{marginLeft:10}} />
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
    backgroundImage: {
        position: 'absolute',
        width: '120%',
        height: '120%',
        transform: [
            { translateX: -width*0.24 }, 
            { translateY: -width*1.366 }, 
        ],
        zIndex: -1,
    },
    body: {
        marginTop: 30,
        paddingHorizontal: 23
    },
    scrollViewContent: {
        paddingBottom: 120, 
        marginTop: 23, 
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

export default ProfileScreen;