import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { Header } from "./Components/Header";
import { useTheme } from "./ThemeProvider";
import NavBar from "./Components/Navbar";
import Carousel from 'react-native-reanimated-carousel';
import DayComponent from './HomeComponents/DayComponent';
import SplitComponent from './HomeComponents/SplitComponent';
import { getSplitDescriptions, getSplitNames } from "../api/splits";
import { getActiveSplitDayNames } from "../api/profile";


const { height, width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [splits, setSplits] = useState([]);
    const [activeSplitDays, setActiveSplitDays] = useState([]);
    const [splitDescription, setSplitDescription] = useState([]);

    const { theme } = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch splits
                const fetchedSplits = await getSplitNames();
                setSplits(fetchedSplits);
    
                // Fetch active split day names
                const fetchedSplitDayNames = await getActiveSplitDayNames();
                setActiveSplitDays(fetchedSplitDayNames);
    
                // Fetch split descriptions
                const fetchedSplitDescriptions = await getSplitDescriptions();
                setSplitDescription(fetchedSplitDescriptions);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);


   
    // display split cards (2 cards in a row)
    const renderSplitRows = () => {
        const rows = [];
        for (let i = 0; i < splits.length; i += 2) {
            rows.push(
                <View key={i} style={styles.splitRow}>
                    <SplitComponent name={splits[i]} subtext={splitDescription[i]} />
                    {i + 1 < splits.length && (
                        <SplitComponent name={splits[i + 1]} subtext={splitDescription[i + 1]} />
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
                                data={activeSplitDays}
                                renderItem={({ item }) => <DayComponent name={item} />}
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
                            <Text style={styles.title}>Other Splits</Text>
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
        paddingTop: 78,
        backgroundColor: theme.backgroundColor,
    },
    body: {
        marginTop: 30,
        paddingHorizontal: 23
    },
    scrollViewContent: {
        paddingBottom: 110, 
        marginTop: 3, 
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