// DayComponent.js
import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../../ThemeProvider';

const { width } = Dimensions.get('window');

const DayComponent = ({ name, onPress }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableOpacity onPress={onPress}>
            <ImageBackground 
                source={require(`../../../assets/day_layout.png`)} 
                style={styles.card}
                imageStyle={styles.cardImage}
            >
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardText}>{name}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    card: {
        width: width * 0.5,
        height: width * 0.5,
        //width: width * 0.4,
        //height: width * 0.4,
        backgroundColor: theme.backdropColor,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        //shadowColor: "#E1EDF4",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
        // marginHorizontal: 130,
        marginHorizontal: getResponsiveFontSize(110),
        marginVertical: 10,

    },
    cardText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(15),
        fontWeight: 'bold',
    },
    cardImage: {
        resizeMode: 'contain',
        width: '90%',
        height: '90%',
        borderRadius: 38,
        left: width*0.03,
        top: width*0.03,
    },
    cardTextContainer: {
        position: 'absolute',
        top: width*0.095,
        left: width*0.05,
    },
});

export default DayComponent;