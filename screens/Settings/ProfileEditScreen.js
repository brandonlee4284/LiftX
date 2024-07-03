import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../ThemeProvider";
import { fetchPublicUserData, updateUserProfile } from "../../api/profile";
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const ProfileEditScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [publicUserData, setPublicUserData] = useState({});
    const [profilePicture, setProfilePicture] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch public user data
                const userData = await fetchPublicUserData();
                if (userData) {
                    setPublicUserData(userData);
                    setProfilePicture(userData.profilePicture);
                    setDisplayName(userData.displayName);
                    setBio(userData.bio);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []); 

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const handleSaveProfile = async () => {
        // Save profile logic here
        await updateUserProfile(profilePicture, displayName, bio);

        navigation.goBack();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Ionicons name="chevron-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                    <Text style={styles.header}>Edit Profile</Text>
                </View>
                <View style={styles.body}>
                    <TouchableOpacity onPress={handlePickImage}>
                        {profilePicture ? (
                            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                        ) : (
                            <Ionicons name="person-circle" size={getResponsiveFontSize(130)} color={theme.textColor} />
                        )}
                    </TouchableOpacity>
                    <View style={styles.textInputContainer}>
                        <Text style={styles.label}>Display Name</Text>
                        <TextInput 
                            style={styles.input} 
                            value={displayName} 
                            onChangeText={setDisplayName} 
                            placeholder="Enter display name"
                            placeholderTextColor={theme.grayTextColor}
                        />
                        <Text style={styles.label}>Bio</Text>
                        <TextInput 
                            style={styles.textArea} 
                            value={bio} 
                            onChangeText={setBio} 
                            placeholder="Enter bio"
                            placeholderTextColor={theme.grayTextColor}
                            multiline={true}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425;
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    },
    headerContainer: {
        marginTop: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        position: 'absolute',
        left: 0.046*width,
    },
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(26),
        fontWeight: '800',
    },
    body: {
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
        width: '100%',
    },
    profilePicture: {
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: width * 0.3 / 2,
        borderColor: theme.textColor,
        borderWidth: 3,
        marginBottom: 20,
    },
    label: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(18),
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginBottom: 10,
        paddingTop: 10
    },
    input: {
        width: '100%',
        height: width*0.0926,
        borderColor: theme.textColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: theme.textColor,
    },
    textArea: {
        width: '100%',
        height: 0.23 * width,
        borderColor: theme.textColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: theme.textColor,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: theme.primaryColor,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: width*0.6
    },
    saveButtonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(18),
        fontWeight: '600',
    },
    textInputContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 30
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 250
    }
});

export default ProfileEditScreen;