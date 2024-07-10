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
        marginTop: height > 850 ? 60 : 50,
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
        paddingTop: getResponsiveFontSize(250)
    }
});

export default ProfileEditScreen;