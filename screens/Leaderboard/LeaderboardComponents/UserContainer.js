import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const UserContainer = ({ rank, username, profilePicture, score }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View>
            <TouchableOpacity style={styles.container}>
                <Text style={styles.rank}>{rank}</Text>
                {profilePicture ? (
                    <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                ) : (
                    <Ionicons name="person-circle" size={getResponsiveFontSize(40)} color={theme.textColor} style={styles.defaultIcon} />
                )}
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.score}>{score}</Text>
            </TouchableOpacity>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.primaryColor,
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        height: height*0.065,
        borderWidth: 2,
        borderColor: theme.textColor
    },
    rank: {
        fontSize: getResponsiveFontSize(18),
        color: theme.textColor,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingHorizontal: 10
    },
    profilePicture: {
        width: width*0.093,
        height: width*0.093,
        borderRadius: (width*0.093) / 2,
        marginRight: 10,
    },
    username: {
        fontSize: getResponsiveFontSize(18),
        color: theme.textColor,
        flex: 1,
        textAlign: 'left',
        fontWeight: 'bold'
    },
    score: {
        fontSize: getResponsiveFontSize(18),
        color: theme.textColor,
        fontWeight: '400',
        textAlign: 'right',
        paddingHorizontal: 10
    },
    defaultIcon: {
        marginRight: 10,
    },
});

export default UserContainer;