// DayComponent.js
import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../ThemeProvider';

const { width } = Dimensions.get('window');

const DayComponent = ({ name }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <ImageBackground 
            source={require(`../../assets/day_layout.png`)} 
            style={styles.card}
            imageStyle={styles.cardImage}
        >
            <View style={styles.cardTextContainer}>
                <Text style={styles.cardText}>{name}</Text>
            </View>
        </ImageBackground>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
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
});

export default DayComponent;