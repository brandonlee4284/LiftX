import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from "../../ThemeProvider";
const { height, width } = Dimensions.get('window');

const ScoreCard = ({ category, score, stat }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.card}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.stat}>Stronger than <Text style={{fontWeight:'bold'}}>{stat}%</Text> of LiftX users</Text>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};


const createStyles = (theme) => StyleSheet.create({      
    card: {
        width: width*0.39,
        height: width*0.39,
        borderRadius: 40,
        backgroundColor: theme.backdropColor,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8.7
    },
    category: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.textColor
    },
    score: {
        fontSize: getResponsiveFontSize(36),
        fontWeight: '800',
        marginVertical: 10,
        textAlign: 'center',
        color: theme.textColor
    },
    stat: {
        fontSize: getResponsiveFontSize(14),
        textAlign: 'center',
        color: theme.textColor,
        paddingHorizontal: 10
    },
});

export default ScoreCard;