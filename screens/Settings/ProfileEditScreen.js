import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../ThemeProvider";
import { fetchPublicUserData, updateUserProfile } from "../../api/profile";
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { width, height } = Dimensions.get('window');

const ProfileEditScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [publicUserData, setPublicUserData] = useState({});
    const [profilePicture, setProfilePicture] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);

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

    /*
    const handleSaveProfile = async () => {
        // Save profile logic here
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await updateUserProfile(profilePicture, displayName, bio);
        navigation.navigate('Settings',  { showNotification: { message: "Profile Saved!", color: theme.primaryColor } });
    };

    rules_version = '2';

    // Craft rules based on data in your Firestore database
    // allow write: if firestore.get(
    //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
    service firebase.storage {
    match /b/{bucket}/o {

        // This rule allows anyone with your Storage bucket reference to view, edit,
        // and delete all data in your Storage bucket. It is useful for getting
        // started, but it is configured to expire after 30 days because it
        // leaves your app open to attackers. At that time, all client
        // requests to your Storage bucket will be denied.
        //
        // Make sure to write security rules for your app before that time, or else
        // all client requests to your Storage bucket will be denied until you Update
        // your rules
        match /{allPaths=**} {
        allow read, write: if request.time < timestamp.date(2024, 6, 20);
        }
    }
    }
    */

    const handleSaveProfile = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setLoading(true);

        try {
            let imageUrl = profilePicture;
            if (profilePicture && profilePicture.startsWith("file://")) {
                const response = await fetch(profilePicture);
                const blob = await response.blob();

                const storage = getStorage();
                if (publicUserData.username) {
                    const storageRef = ref(storage, `profile_pictures/${publicUserData.username}.jpg`);
                    await uploadBytes(storageRef, blob);

                    imageUrl = await getDownloadURL(storageRef);
                } else {
                    console.error('Username is undefined');
                    throw new Error('Username is undefined');
                }
            }
            await updateUserProfile(imageUrl, displayName, bio);
            navigation.navigate('Settings',  { showNotification: { message: "Profile Saved!", color: theme.primaryColor } });
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Ionicons name="chevron-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                    <Text style={styles.header}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
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
                        <View style={styles.row}>
                            <Text style={styles.label}>Display Name</Text>
                            <TextInput 
                                style={styles.input} 
                                value={displayName} 
                                onChangeText={setDisplayName} 
                                placeholder="Enter display name"
                                placeholderTextColor={theme.grayTextColor}
                                maxLength={25}
                            />
                        </View>
                        <View style={[styles.row, styles.rowTopAlign]}>
                            <Text style={[styles.label, styles.labelTopAlign]}>Bio</Text>
                            <TextInput 
                                style={styles.textArea} 
                                value={bio} 
                                onChangeText={setBio} 
                                placeholder="Enter bio"
                                placeholderTextColor={theme.grayTextColor}
                                multiline={true}
                                maxLength={200}
                            />
                        </View>
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
        marginTop: height > 850 ? 60 : 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: getResponsiveFontSize(20),
    },
    backIcon: {},
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(22),
        fontFamily: theme.fontExtraBold,
    },
    saveButton: {
        paddingVertical: 5,
        borderRadius: 10,
    },
    saveButtonText: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
        fontFamily: theme.fontMedium,
    },
    body: {
        alignItems: 'center',
        marginTop: 30,
        paddingHorizontal: getResponsiveFontSize(10),
        width: '100%',
    },
    profilePicture: {
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: width * 0.3 / 2,
        borderColor: theme.textColor,
        borderWidth: 3,
        marginBottom: getResponsiveFontSize(20),
    },
    label: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
        fontFamily: theme.fontSemiBold,
        width: '35%',
    },
    input: {
        width: '65%',
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
        paddingHorizontal: 10,
        fontFamily: theme.fontLight,
    },
    textArea: {
        width: '65%',
        color: theme.textColor,
        fontSize: getResponsiveFontSize(16),
        paddingHorizontal: 10,
        textAlignVertical: 'top',
        fontFamily: theme.fontLight,

    },
    textInputContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center', // Center items by default
        marginBottom: 30,
    },
    rowTopAlign: {
        alignItems: 'flex-start', // Override for Bio row
    },
    labelTopAlign: {
        paddingTop: 5, // Adjust top padding to align label visually with multi-line input
    },
});

export default ProfileEditScreen;