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


const { height, width } = Dimensions.get('window');

const ProfileScreen = ({ navigation, route }) => {
    const [publicUserData, setPublicUserData] = useState({});
    const [activeSplitDays, setActiveSplitDays] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const categories = ["Overall", "Chest", "Back", "Shoulders", "Arms", "Legs"];

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
                        <Carousel
                            width={width}
                            height={width*0.5}
                            data={activeSplitDays.map(day => day.dayName)}
                            renderItem={({ item }) => <DayCard name={item} />}
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
        paddingTop: 58,
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
        paddingBottom: 110, 
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
    }
   
});

export default ProfileScreen;