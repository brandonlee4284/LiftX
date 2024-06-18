import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { fetchPublicUserData } from '../api/userData';
import { Header } from "./Components/Header";
import { useTheme } from "./ThemeProvider";
import NavBar from "./Components/Navbar";
import Carousel from 'react-native-reanimated-carousel';



const { height, width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [publicUserData, setPublicUserData] = useState({});
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const days = ['Push', 'Pull', 'Legs']; // placeholder days
    const other_splits = ['PPL x Arnold', 'Upper/Lower', 'Full Body', 'Full Body', 'Full Body', 'Full Body', 'Full Body', 'Full Body', 'Full Body']; // placeholder splits
    const other_splits_subtext = ['6-day split', '6-day split', '6-day split', '6-day split', '6-day split', '6-day split', '6-day split', '6-day split', '6-day split']; // placeholder subtext


    useEffect(() => {
        async function fetchData() {
            const data = await fetchPublicUserData();
            if (data) {
                setPublicUserData(data);
            }
        }
        fetchData();
    }, []);

   
    // display split cards (2 cards in a row)
    const renderSplitRows = () => {
        const rows = [];
        for (let i = 0; i < other_splits.length; i += 2) {
            rows.push(
                <View key={i} style={styles.splitRow}>
                    <View style={styles.splitCard}>
                        <Text style={styles.splitCardText}>{other_splits[i]}</Text>
                        <Text style={styles.splitCardSubText}>{other_splits_subtext[i]}</Text>
                    </View>
                    {i + 1 < other_splits.length && (
                        <View style={styles.splitCard}>
                            <Text style={styles.splitCardText}>{other_splits[i + 1]}</Text>
                            <Text style={styles.splitCardSubText}>{other_splits_subtext[i + 1]}</Text>
                        </View>
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
                                data={days}
                                renderItem={({ item }) => (
                                    <ImageBackground 
                                        source={require(`../assets/day_layout.png`)} 
                                        style={styles.card}
                                        imageStyle={styles.cardImage}
                                    >
                                        <View style={styles.cardTextContainer}>
                                            <Text style={styles.cardText}>{item}</Text>
                                        </View>
                                    </ImageBackground>
                                )}
                                mode="parallax"
                                modeConfig={{
                                    parallaxScrollingScale: 1,
                                    parallaxScrollingOffset: 180,
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
    card: {
        width: width * 0.6,
        height: width * 0.6,
        backgroundColor: theme.backdropColor,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#E1EDF4",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
        marginHorizontal: 85,
        marginVertical: 10,
        
    },
    cardText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(20),
        fontWeight: 'bold',
    },
    cardImage: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
        borderRadius: 38,
    },
    cardTextContainer: {
        position: 'absolute',
        top: 40,
        left: 40,
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
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    splitCard: {
        width: width * 0.435,
        height: width * 0.28,
        backgroundColor: theme.backdropColor,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    splitCardText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(20),
        fontWeight: '600',
    },
    splitCardSubText: {
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: '300',
        marginTop: 5
    },

});

export default HomeScreen;