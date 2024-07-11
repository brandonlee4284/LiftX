import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../ThemeProvider";
import { getUsername } from '../../api/profile';
import Ionicons from '@expo/vector-icons/Ionicons';
import GradientText from './GradientText';
import * as Haptics from 'expo-haptics';
import { getFriendRequests } from '../../api/friends';

const { height, width } = Dimensions.get('window');

export function Header(props) {
    const [username, setUsername] = useState('');
    const [friendRequestNum, setFriendRequestNum] = useState(0);
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    // Fetch friend requests
                    const friendRequestsData = await getFriendRequests();
                    if (friendRequestsData) {
                        setFriendRequestNum(friendRequestsData.length);
                    }
                    
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }, [])
    );

    useEffect(() => {
        async function fetchData() {
            const data = await getUsername();
            if (data) {
                setUsername(data);
            }

            
        }

        fetchData();
    }, []);

    const handleAddProfile = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.navigate('AddFriend');
    };

    const handleSettings = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.navigate('Setting');
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Text style={styles.pageText}>{props.page}</Text>
                
                <GradientText
                    text={`@${username}`}
                    gradientColors={['#74B3DC', '#E1EDF4']}
                    style={styles.usernameText}
                />
                
                {/*<Text style={styles.usernameText}>@{publicUserData.username}</Text >*/}
            </View>
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={handleAddProfile} style={styles.iconButton}>
                    <Ionicons name="person-add-outline" size={getResponsiveFontSize(24)} color={theme.textColor} />
                    {friendRequestNum > 0 && (
                        <View style={styles.notificationDot}>
                            <Text style={styles.notificationText}>{friendRequestNum}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSettings} style={styles.iconButton}>
                    <Ionicons name="settings-outline" size={getResponsiveFontSize(24)} color={theme.textColor} />
                </TouchableOpacity>
            </View>
        </View>
    );
}


const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({    
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 23
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'column',
        bottom: width*0.0116
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pageText: {
        fontSize: getResponsiveFontSize(14),
        fontWeight: '500',
        color: theme.textColor,
    },
    usernameText: {
        fontSize: getResponsiveFontSize(24),
        color: theme.textColor,
        fontWeight: '800',
    },
    iconButton: {
        marginLeft: 15,
    },
    notificationDot: {
        minWidth: 0.042*width,
        height: 0.042*width,
        borderRadius: 9,
        backgroundColor: theme.primaryColor,
        position: 'absolute',
        top: -0.0054*height,
        right: -0.023*width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },
    notificationText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(10),
        fontWeight: 'bold',
        textAlign: 'center',
    },

    
  
});

export default Header;