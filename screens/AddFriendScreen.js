import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from "./ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { getUserUIDByUsername } from '../api/friends';
import { sendFriendRequest } from '../api/friends';

const { height, width } = Dimensions.get('window');

const AddFriendScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFindUser = async () => {
        setLoading(true);
        try {
            const uid = await getUserUIDByUsername(username);
            sendFriendRequest(uid, username);
            if (uid) {
                alert('User found!');
            } else {
                alert('User not found!');
            }
        } catch (error) {
            alert('Error finding user: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons name="arrow-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon} />
                <Text style={styles.header}>Add Friends</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter username"
                    placeholderTextColor={theme.textColor}
                    value={username}
                    onChangeText={setUsername}
                />
                <TouchableOpacity style={styles.button} onPress={handleFindUser} disabled={loading}>
                    <Text style={styles.buttonText}>Find User</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};


const createStyles = (theme) => StyleSheet.create({    
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    headerContainer: {
        marginTop: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        right: width*0.25
    },
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(26),
        fontWeight: '800',
        left: -0.03*width
    },
    inputContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: theme.textColor,
        borderRadius: 5,
        color: theme.textColor,
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: theme.primaryColor,
        borderRadius: 5,
    },
    buttonText: {
        color: theme.buttonTextColor,
        fontWeight: 'bold',
    },
    
});

export default AddFriendScreen;
