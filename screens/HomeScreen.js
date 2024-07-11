import React, { useState, useEffect, useCallback, useRef  } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView, Animated } from 'react-native';
import { Header } from "./Components/Header";
import { useTheme } from "./ThemeProvider";
import NavBar from "./Components/Navbar";
import Carousel from 'react-native-reanimated-carousel';
import DayComponent from './HomeComponents/DayComponent';
import SplitComponent from './HomeComponents/SplitComponent';
import { addSplitPrivate, getSplitDescriptions, getSplits, removeSplit, splitNameExist } from "../api/splits";
import { getActiveSplit, setActiveSplit } from "../api/profile";
import { getWorkoutDay, newWorkoutDay } from "../api/workout";
import CompleteWorkoutModal from "./HomeComponents/CompletedWorkoutModal";
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import AddSplitComponent from "./HomeComponents/AddSplitComponent";
import DeleteWorkoutModal from "./Workout/WorkoutComponents/DeleteWorkoutModal";
import WarningModal from "./Components/WarningModal";

/*
To-Do list
- unique usernames (done)
- info modal - leaderboard, scores in profile (done)
- make it required to do onboarding questionaire (done)
- sort leaderboard (done)
- display scores (done)
- logout warning modal (done)
- update friend count (done)
- show score change in end workout modal (done)
- download another persons split (done)
- show 1 rm in previewWorkout under exercise name (done)
- send friend req/accept friend req alerts (done)
- only send one friend req to a account (done)
- cannot send a friend req to a friend (done)
- cannot send a friend req to a friend that has already sent you one (done)
- cannot send a freiend req to yourself
- prevent keyboard from blocking input boxes (done)
- onboarding scores (done)
- remove friend (done)
- workout screen improvements (done)
- dropdown select exercise (done)
- apply drop down (muscle specific) for onboarding names (done)
- warning message if exercise is inputed not in exercise.json (done)
- update score manually (done)
- notifications for updated scores, updated profile, save workout, dowload another persons split, etc. (done)
- fix scores calculations/display percentiles/stats (done)
- fix profile pictures (done)
- privacy settings (done)
- change password/forgot password login screen (done)
- email verification (done)

- fix persistence


*/

const { height, width } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
    const [splits, setSplits] = useState([]);
    const [activeSplitDays, setActiveSplitDays] = useState([]);
    const [splitDescription, setSplitDescription] = useState([]);
    const [activeSplit, setActiveSplitState] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    // modal that pops up if a user is trying to delete a split
    const [showEndWorkoutModal, setShowEndWorkoutModal] = useState(false);
    const [showSameSplitWarningModal, setShowSameSplitNameWarningModal] = useState(false);
    const [deleteSplitName, setDeleteSplitName] = useState("");
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [notification, setNotification] = useState({ message: '', visible: false, color: theme.primaryColor });
    const notificationTimeoutRef = useRef(null);
    const slideAnim = useRef(new Animated.Value(-100)).current;

    const {
        completedWorkout = false,
        stopwatch = '00:00:00',
        setsCompleted = 0,
        dayName = 'Unknown',
        scoreChanges = {}
    } = route.params || {};
    

    useEffect(() => {
        //synchronizeFriends();
        if (route.params?.completedWorkout) {
            setModalVisible(true);
            navigation.setParams({ completedWorkout: false });
        }
    }, [route.params?.completedWorkout]);

    useEffect(() => {
        if (route.params?.showNotification) {
            const { message, color } = route.params.showNotification;
            showNotification(message, color);
        }
    }, [route.params]);


    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    // Fetch splits
                    const fetchedSplits = await getSplits();
                    if(fetchedSplits){
                        setSplits(fetchedSplits);
                    }
                    
                    // Fetch active split day
                    const fetchedActiveSplit = await getActiveSplit();
                    if(fetchedActiveSplit){
                        setActiveSplitDays(fetchedActiveSplit.days);
                        setActiveSplitState(fetchedActiveSplit);   
                    }
                                
                    // Fetch split descriptions
                    const fetchedSplitDescriptions = await getSplitDescriptions();
                    if(fetchedSplitDescriptions){
                        setSplitDescription(fetchedSplitDescriptions);  
                    }
                    
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }, [])
    );

    // resets modal visibility to false
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    // handles setting a split active
    const handleSetSplitActive = async (split) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setActiveSplitDays(split.days);
        setActiveSplitState(split);
        showNotification(`${split.splitName} set active!`, theme.primaryColor);
        await setActiveSplit(split); // set the active split in backend
        
        //console.log(split.splitName);
        
        
    };

    // handles selecting a day to preview a workout
    const handleSelectDay = async (dayName, activeSplit) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        try {
            const workoutDay = await getWorkoutDay(dayName, activeSplit);
            navigation.navigate('PreviewWorkout', { workoutDay, splitName: activeSplit.splitName });
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddSplit = async () => {
        // Implement the logic for adding a new split
        try {
            // Implement the logic for adding a new split
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            let newSplitName = "Split 1";
            let count = 1;
            
            // Check if the initial split name already exists
            while (await splitNameExist(newSplitName)) {
                newSplitName = `Split ${count}`;
                count++;
            }
            
            // Add the new split with the modified name
            await addSplitPrivate(newSplitName);
            
            // Fetch updated splits after adding the new split
            const fetchedSplits = await getSplits();
            if (fetchedSplits) {
                setSplits(fetchedSplits);
            }

            // Fetch split descriptions
            const fetchedSplitDescriptions = await getSplitDescriptions();
            if(fetchedSplitDescriptions){
                setSplitDescription(fetchedSplitDescriptions);  
            }
            showNotification(`New split added!`, theme.primaryColor);
        } catch (error) {
            console.error('Error adding new split:', error);
        }
        
    };

    const handleDeleteSplit = async (splitName) => {
        // Implement the logic for deleting a split
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            if (activeSplit && activeSplit.splitName === splitName) {
                console.log("Cannot delete the active split.");
                alert("Cannot delete the active split. Please set another split as active before deleting.");
                return;
            }
            await removeSplit(splitName);
            
            
            // Fetch updated splits after removing the split
            const fetchedSplits = await getSplits();
            if (fetchedSplits) {
                setSplits(fetchedSplits);
            }
    
            const fetchedSplitDescriptions = await getSplitDescriptions();
            if (fetchedSplitDescriptions) {
                setSplitDescription(fetchedSplitDescriptions);
            }
            setShowEndWorkoutModal(false);
            showNotification(`${splitName} removed!`, theme.dangerColor);
        } catch (error) {
            console.error('Error deleting split:', error);
        }
    };
    

    const handleAddDay = async () => {
        // Implement the logic for adding a new day
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        const workoutDay = await newWorkoutDay(activeSplit.splitName);
        navigation.navigate('PreviewWorkout', { workoutDay, splitName: activeSplit.splitName });

    };

    const handleSplitNameChange = async () => {
        const fetchedSplits = await getSplits();
        if(fetchedSplits){
            setSplits(fetchedSplits);
        }
        showNotification(`Split saved!`, theme.primaryColor);
    };

    // display split cards (2 cards in a row)
    const renderSplitRows = () => {
        if (splits.length === 0) {
            return [];
        }
    
        const rows = [];
        // Ensure splits.splits always has an extra item for the '+' card
        const splitsWithExtra = [...splits.splits, { splitName: '+' }];
    
        for (let i = 0; i < splitsWithExtra.length; i += 2) {
            rows.push(
                <View key={i} style={styles.splitRow}>
                    {splitsWithExtra[i].splitName === '+' ? (
                        <AddSplitComponent onPress={handleAddSplit} />
                    ) : (
                        <SplitComponent
                            name={splitsWithExtra[i].splitName}
                            subtext={i < splits.splits.length ? splitDescription[i] : ''}
                            isActive={activeSplit && activeSplit.splitName === splitsWithExtra[i].splitName}
                            onPress={() => handleSetSplitActive(splits.splits[i])}
                            onRemove={deleteWarning}
                            onNameChange={handleSplitNameChange}
                            showSameNameModal={sameSplitNameWarning}
                        />
                    )}
                    {i + 1 < splitsWithExtra.length && (
                        splitsWithExtra[i + 1].splitName === '+' ? (
                            <AddSplitComponent onPress={handleAddSplit} />
                        ) : (
                            <SplitComponent
                                name={splitsWithExtra[i + 1].splitName}
                                subtext={i < splits.splits.length ? splitDescription[i + 1] : ''}
                                isActive={activeSplit && activeSplit.splitName === splitsWithExtra[i + 1].splitName}
                                onPress={() => handleSetSplitActive(splits.splits[i + 1])}
                                onRemove={deleteWarning}
                                onNameChange={handleSplitNameChange}
                                showSameNameModal={sameSplitNameWarning}
                            />
                        )
                    )}
                </View>
            );
        }
        return rows;
    };

    const handleCancel = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowEndWorkoutModal(false);
    };

    const deleteWarning = (splitName) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setDeleteSplitName(splitName);
        setShowEndWorkoutModal(true);
    }

    const sameSplitNameWarning = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowSameSplitNameWarningModal(true);
    }

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowSameSplitNameWarningModal(false);
    }
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
        }, 3000);
    };

    return (
        <View style={styles.container}>
            <NavBar activeRoute="HomeNav" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Header page="Home" />
                <View style={styles.body}>
                        {/* Title */}
                        <Text style={styles.title}>Start Today's Workout!</Text>
                        {/* Split Carousel */}
                        <View style={styles.carouselContainer}>
                            <Carousel
                                width={width}
                                height={width*0.7}
                                data={[...activeSplitDays.map(day => day.dayName), 'Add Day']}
                                renderItem={({ item }) => {
                                    if (item === 'Add Day') {
                                        return (
                                            <TouchableOpacity style={styles.addDayCard} onPress={handleAddDay}>
                                                <Text style={styles.addDayText}>+</Text>
                                            </TouchableOpacity>
                                        );
                                    } else {
                                        return (
                                            <DayComponent
                                                name={item}
                                                onPress={() => handleSelectDay(item, activeSplit)}
                                            />
                                        );
                                    }
                                }}
                                mode="parallax"
                                modeConfig={{
                                    parallaxScrollingScale: 1,
                                    parallaxScrollingOffset: getResponsiveFontSize(180),
                                    parallaxAdjacentItemScale: 0.65,
                                    parallaxAdjacentItemOpacity: 0.8,
                                }}
                                snapEnabled={true}
                                pagingEnabled={true}
                                loop={false}
                            />
                        </View>
                        {/* Other Splits */}
                        <View style={styles.otherSplitContainer}>
                            <Text style={styles.title}>Select a Split</Text>
                            <View style={styles.splitGrid}>
                                {renderSplitRows()}
                            </View>
                        </View>
                </View>
           </ScrollView>
            <CompleteWorkoutModal visible={modalVisible} onClose={handleCloseModal} dayName={dayName} time={formatTime(stopwatch)} setsCompleted={setsCompleted} scoreChanges={scoreChanges}/>
            <DeleteWorkoutModal
                visible={showEndWorkoutModal}
                cancel={handleCancel}
                del={() => handleDeleteSplit(deleteSplitName)}
                workoutName={deleteSplitName}
            />
            <WarningModal
                visible={showSameSplitWarningModal}
                msg={"Split Already Exists or Invalid"}
                subMsg={"Try a different name"}
                close={handleClose}
            />
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
const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
};


const createStyles = (theme) => StyleSheet.create({    
    container: {
        flex: 1,
        paddingTop: height > 850 ? 40 : 30,
        backgroundColor: theme.backgroundColor,
    },
    body: {
        marginTop: 30,
        paddingHorizontal: 23
    },
    scrollViewContent: {
        paddingBottom: 120, 
        marginTop: 23, 
    },
    title: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(25),
        fontWeight: 'bold'
    },
    carouselContainer: {
        marginTop: 30,
        alignItems: 'center',
        
    },
    otherSplitContainer: {
        marginTop: 10,
    },
    splitGrid: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 20,
    },
    splitRow: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        marginBottom: 10,
    },
    addDayCard: {
        width: width * 0.6,
        height: width * 0.6,
        backgroundColor: 'rgba(9, 20, 27, 0.85)',
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 85,
        marginVertical: 10,
    },
    addDayText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(50),
        fontWeight: '300',
    },
    notificationContainer: {
        position: 'absolute',
        width: width,
        paddingTop: height > 850 ? 50 : 45,
        padding: 5,
        backgroundColor: theme.primaryColor,
        borderRadius: 20,
        alignItems: 'center',
    },
    notificationText: {
        color: theme.textColor,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

export default HomeScreen;