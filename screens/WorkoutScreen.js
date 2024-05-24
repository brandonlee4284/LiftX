/*
import React from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width, height } = Dimensions.get('window');

const blankCardsData = [
    { key: '1' },
    { key: '2' },
    { key: '3' },
];

const splitsData = [
    { key: '1', title: 'Upper Lower' },
    { key: '2', title: 'PPL' },
    { key: '3', title: 'PPL Arnold' },
];

const WorkoutScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <Carousel
                    vertical
                    width={width*1.2}
                    height={height * 0.34}
                    loop
                    autoPlay={false}
                    data={splitsData}
                    scrollAnimationDuration={1000}
                    pagingEnabled={true}
                    mode="parallax"
                    parallaxScrollingScale={0.9}
                    parallaxScrollingOffset={50}
                    renderItem={({ item }) => (
                        <View style={styles.splitContainer}>
                            <Text style={styles.sectionTitle}>{item.title}</Text>
                            <Carousel
                                loop
                                width={width * 0.8}
                                height={150}
                                autoPlay={false}
                                data={blankCardsData}
                                scrollAnimationDuration={1000}
                                mode="blur-parallax"
                                renderItem={({ item }) => (
                                    <View style={styles.carouselItem} />
                                )}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
    splitContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: height * 0.3,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },
    carouselItem: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        width: width * 0.7,
        height: 150,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    
});

export default WorkoutScreen;
*/
import React from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import NestedCarousel from './NestedCarousel';

const { width, height } = Dimensions.get('window');

const blankCardsData = [
    { key: '1' },
    { key: '2' },
    { key: '3' },
];

const splitsData = [
    { key: '1', title: 'Upper Lower' },
    { key: '2', title: 'PPL' },
    { key: '3', title: 'PPL Arnold' },
    { key: '4', title: 'Full Body' },
    { key: '5', title: 'Bro Split' },
];

const ITEM_HEIGHT = height / 3; // Ensure three items fit within the screen height

const WorkoutScreen = () => {
    return (
        // <View style={styles.container}>
        //     <Carousel
        //         vertical
        //         width={width*1.2}
        //         height={height}
        //         loop
        //         autoPlay={false}
        //         data={splitsData}
        //         scrollAnimationDuration={1000}
        //         pagingEnabled={true}
        //         mode="parallax"
        //         parallaxScrollingScale={0.85}
        //         parallaxScrollingOffset={70}
            
        //         renderItem={({ item, index, currentIndex }) => (
        //             <View style={[
        //                 styles.splitContainer,
        //             ]}>
        //                 <Text style={styles.sectionTitle}>{item.title}</Text>
        //                 <Carousel
        //                     loop
        //                     width={width * 0.8}
        //                     height={150}
        //                     autoPlay={false}
        //                     data={blankCardsData}
        //                     scrollAnimationDuration={1000}
        //                     renderItem={({ item }) => (
        //                         <View style={styles.carouselItem} />
        //                     )}
        //                 />
        //             </View>
        //         )}
        //     />
        // </View>
        <NestedCarousel />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
    },
    splitContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: ITEM_HEIGHT,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginVertical: 5, // Add some margin to space the items
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },
    carouselItem: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        width: width * 0.7,
        height: 150,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
});

export default WorkoutScreen;