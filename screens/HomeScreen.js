import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { Header } from "./Components/Header";
import { useTheme } from "./ThemeProvider";
import NavBar from "./Components/Navbar";
import Carousel from 'react-native-reanimated-carousel';
import DayComponent from './HomeComponents/DayComponent';
import SplitComponent from './HomeComponents/SplitComponent';
import { getSplitDescriptions, getSplits } from "../api/splits";
import { getActiveSplit, setActiveSplit } from "../api/profile";
import { getWorkoutDay } from "../api/workout";



const { height, width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [splits, setSplits] = useState([]);
    const [activeSplitDays, setActiveSplitDays] = useState([]);
    const [splitDescription, setSplitDescription] = useState([]);
    const [activeSplit, setActiveSplitState] = useState(null);

    const { theme } = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
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
    }, []);

    // handles setting a split active
    const handleSetSplitActive = async (split) => {
        setActiveSplitDays(split.days);
        setActiveSplitState(split);
        await setActiveSplit(split); // set the active split in backend
        
    };

    // handles selecting a day to preview a workout
    const handleSelectDay = async (dayName, activeSplit) => {
        try {
            const workoutDay = await getWorkoutDay(dayName, activeSplit);
            navigation.navigate('PreviewWorkout', { workoutDay });
        } catch (error) {
            console.error(error);
        }
    };

    // display split cards (2 cards in a row) 
    const renderSplitRows = () => {
        if (splits.length === 0) {
            return [];
        }
    
        const rows = [];
        for (let i = 0; i < splits.splits.length; i += 2) {
            rows.push(
                <View key={i} style={styles.splitRow}>
                    <SplitComponent
                        name={splits.splits[i].splitName}
                        subtext={splitDescription[i]}
                        isActive={activeSplit && activeSplit.splitName === splits.splits[i].splitName}
                        onPress={() => handleSetSplitActive(splits.splits[i])}
                    />
                    {i + 1 < splits.splits.length && (
                        <SplitComponent
                            name={splits.splits[i+1].splitName}
                            subtext={splitDescription[i + 1]}
                            isActive={activeSplit && activeSplit.splitName === splits.splits[i+1].splitName}
                            onPress={() => handleSetSplitActive(splits.splits[i+1])}
                        />
                    )}
                </View>
            );
        }
        return rows;
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
                                data={activeSplitDays.map(day => day.dayName)}
                                renderItem={({ item }) => <DayComponent name={item} onPress={() => handleSelectDay(item, activeSplit)} />}
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
        backgroundColor: theme.backgroundColor,
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

});

export default HomeScreen;