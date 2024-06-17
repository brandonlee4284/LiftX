import React from 'react';
import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../ThemeProvider";
import { fetchPublicUserData } from '../../api/userData';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height, width } = Dimensions.get('window');

export function Header(props) {
    const [publicUserData, setPublicUserData] = useState({});
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    

    useEffect(() => {
        async function fetchData() {
            const data = await fetchPublicUserData();
            if (data) {
                setPublicUserData(data);
            }
        }

        fetchData();
    }, []);

    const handleAddProfile = () => {
        navigation.navigate('Onboarding');
    };

    const handleSettings = () => {
        navigation.navigate('Setting');
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Text style={styles.pageText}>{props.page}</Text>
                <Text style={styles.usernameText}>@{publicUserData.username}</Text >
            </View>
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={handleAddProfile} style={styles.iconButton}>
                    <Ionicons name="person-add-outline" size={getResponsiveFontSize(24)} color={theme.textColor} />
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
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pageText: {
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
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
    
  
});

export default Header;