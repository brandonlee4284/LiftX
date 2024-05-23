import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const data = [
    { key: '1', text: 'Slide 1' },
    { key: '2', text: 'Slide 2' },
    { key: '3', text: 'Slide 3' },
];

const WorkoutScreen = () => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    <Text>Loading...</Text>

                    <Carousel
                        loop
                        width={1000}
                        height={500}
                        autoPlay={true}
                        data={data}
                        scrollAnimationDuration={1000}
                        renderItem={({ item }) => (
                            <View style={styles.carouselItem}>
                                <Text style={styles.text}>{item.text}</Text>
                            </View>
                        )}
                    />

                    <ActivityIndicator />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    carouselItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
      },
      text: {
        fontSize: 24,
        fontWeight: 'bold',
      },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    scrollContent: {
        minWidth: '100%',
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
});

export default WorkoutScreen;
