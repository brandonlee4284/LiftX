import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../ThemeProvider";
import Carousel from 'react-native-reanimated-carousel';
import { Slide1, Slide2, Slide3 } from "./SlideComponents";
import * as Haptics from 'expo-haptics';

const { height, width } = Dimensions.get('window');

const OnboardingScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    // slide indexing
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef(null);
    
    // get slide data
    const slides = [
        <Slide1 />,
        <Slide2 />,
        <Slide3 />,
    ];
    // continue to next slide handling
    const onNextSlide = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
            carouselRef.current?.scrollTo({ index: currentSlide + 1, animated: true });
        } else {
            navigation.navigate('OnboardingQuestions'); // change to OnboardingQuestions
        }
    };

    const slideAnim = useRef(new Animated.Value(height)).current; 
    useFocusEffect(
        React.useCallback(() => {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600, // Duration of the slide-in animation
                useNativeDriver: true,
            }).start();

            return () => {
                slideAnim.setValue(height); // Reset the animation when the screen is unfocused
            };
        }, [slideAnim])
    );

    //rendering
    return (
        <View style={styles.backgroundContainer}>
            <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
                <Carousel
                    ref={carouselRef}
                    loop={false}
                    width={width}
                    height={height}
                    data={slides}
                    scrollAnimationDuration={400}
                    scrollEnabled={false}
                    onSnapToItem={(index) => setCurrentSlide(index)}
                    renderItem={({ item }) => item}
                />
                <View style={styles.overlayContainer}>
                    <View style={styles.dotContainer}>
                        {slides.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentSlide ? styles.activeDot : styles.inactiveDot
                                ]}
                            />
                        ))}
                    </View>
                    <TouchableOpacity style={styles.button} onPress={onNextSlide}>
                        <Text style={styles.buttonText}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        position: 'relative',
    },
    overlayContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: height * 0.1,
        width: '100%',
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    dot: {
        width: getResponsiveFontSize(10),
        height: getResponsiveFontSize(10),
        borderRadius: getResponsiveFontSize(5),
        marginHorizontal: 10,
    },
    activeDot: {
        backgroundColor: theme.primaryColor,
    },
    inactiveDot: {
        backgroundColor: theme.textColor,
    },
    button: {
        width: width * 0.7,
        height: getResponsiveFontSize(57),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: theme.primaryColor,
        shadowOpacity: 0.52,
        shadowRadius: 50,
        shadowOffset: {
            width: 0,
            height: 20,
        },
    },
    buttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;