import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from "../../ThemeProvider";
const { height, width } = Dimensions.get('window');

const ScoreCard = ({ category, score, change }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const formattedChange = change > 0 ? `+${change}` : change;
    const changeColor = change > 0 ? theme.positiveColor : change < 0 ? theme.dangerColor : theme.grayTextColor;

    return (
        <View style={styles.card}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.score}>{score}</Text>
        <Text style={[styles.change, { color: changeColor }]}>({formattedChange})</Text>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};


const createStyles = (theme) => StyleSheet.create({      
    card: {
        width: width*0.37,
        height: width*0.37,
        borderRadius: 25,
        backgroundColor: theme.backdropColor,
        alignItems: 'center',
        margin: 10
    },
    category: {
        fontSize: getResponsiveFontSize(20),
        fontWeight: '600',
        textAlign: 'center',
        color: theme.grayTextColor,
        paddingTop: 20,
    },
    score: {
        fontSize: getResponsiveFontSize(36),
        fontWeight: '800',
        paddingVertical: 10,
        textAlign: 'center',
        color: theme.textColor
    },
    change: {
        fontSize: getResponsiveFontSize(14),
        fontWeight: '200',
        textAlign: 'center'
    }
});

export default ScoreCard;