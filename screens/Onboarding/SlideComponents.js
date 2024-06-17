import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useTheme } from "../ThemeProvider";
import svg1 from "./SVGs/SVG1.png"
import svg2 from "./SVGs/SVG2.png"
import svg3 from "./SVGs/SVG3.png"

const { height, width } = Dimensions.get('window');


export const Slide1 = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.slide}>
            <Image source={svg1} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.slideTitle}>Design & Record Your Lifts</Text>
                <Text style={styles.slidetext}>Effortlessly customize and log your lifting splits to maximize your gains</Text>
            </View>
        </View>
    );
};

export const Slide2 = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.slide}>
            <Image source={svg2} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.slideTitle}>Connect With Friends</Text>
                <Text style={styles.slidetext}>Connect with other gym goers to share and celebrate your PRs and achievements</Text>
            </View>
        </View>
    );
};

export const Slide3 = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.slide}>
            <Image source={svg3} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.slideTitle}>Climb the Leaderboard</Text>
                <Text style={styles.slidetext}>Challenge your friends and climb the leaderboard to prove your strength!</Text>
            </View>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    slide: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.backgroundColor,
    },
    image: {
        position: 'absolute',
        width: width,
        height: height*0.8,
        aspectRatio: 1,
        resizeMode: 'contain',
        bottom: width*.67
    },
    textContainer: {
        justifyContent: 'center',
        bottom: -width*0.39
    },
    slideTitle: {
        fontSize: getResponsiveFontSize(29),
        fontWeight: '800',
        color: theme.primaryColor,
        textAlign: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
    },
    slidetext: {
        fontSize: getResponsiveFontSize(18),
        fontWeight: '100',
        color: theme.textColor,
        textAlign: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
        lineHeight: 30
    },
});
