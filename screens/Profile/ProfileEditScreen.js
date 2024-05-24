import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const ProfileEditScreen = ({ navigation }) => {
    const [publicUserData, setPublicUserData] = useState({});
    const [profilePicture, setProfilePicture] = useState(null);
    const [bio, setBio] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchPublicUserData = async () => {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
                try {
                    const docData = await getDoc(userDocRef);
                    if (docData.exists()) {
                        const userData = docData.data();
                        setPublicUserData(userData);
                        setProfilePicture(userData.profilePicture);
                        setBio(userData.bio);
                        setUsername(userData.username);
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching public data: ', error);
                }
            }
        };

        fetchPublicUserData();
    }, []);

    const saveProfile = async () => {
        // Save profile logic here
        const user = FIREBASE_AUTH.currentUser;
        const userDocRef = doc(FIRESTORE_DB, "users", user.uid);
        try {
            await updateDoc(userDocRef, {
                username: username,
                bio: bio,
                profilePicture: profilePicture
            });
            navigation.navigate("Profile", { reload: true });
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePicture(result.uri);
        }
    };
    
    let displayName = publicUserData.name
    let email = publicUserData.email
    let activeSplit = publicUserData.activeSplit

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    <TouchableOpacity onPress={pickImage}>
                        {profilePicture ? (
                            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                        ) : (
                            <Ionicons name="person-circle" size={150} color="gray" style={styles.profileIcon} />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.uploadText} onPress={pickImage}>Upload a picture</Text>

                    <Text style={styles.label}>New Username:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new username"
                        onChangeText={setUsername}
                        value={username}
                    />

                    <Text style={styles.label}>Bio:</Text>
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        placeholder="Enter your bio"
                        onChangeText={setBio}
                        value={bio}
                        multiline
                    />

                    <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
    scrollContent: {
        width: '100%',
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10
    },
    profileIcon: {
        marginBottom: 10
    },
    uploadText: {
        fontSize: 16,
        color: "blue",
        marginBottom: 20
    },
    label: {
        alignSelf: "flex-start",
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 0
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20
    },
    bioInput: {
        height: 100, // Make the bio input larger
    },
    saveButton: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20
    },
    saveButtonText: {
        color: "white",
        fontSize: 16
    }
});

export default ProfileEditScreen;