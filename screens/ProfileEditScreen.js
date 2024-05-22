import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ProfileEditScreen = ({ navigation }) => {
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);

    // Function to handle saving the profile
    const saveProfile = () => {
        // Save profile logic here
        navigation.navigate("Profile");
    };

    // Function to handle picking an image from photo album
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

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    <TouchableOpacity onPress={pickImage}>
                        {profilePicture ? (
                            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                        ) : (
                            <Text style={styles.addPictureText}>Upload Profile Picture</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.bioTitle}>Bio:</Text>
                    <TextInput
                        style={styles.bioInput}
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
        justifyContent: "center",
        padding: 20
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
    scrollContent: {
        minWidth: '100%',
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20
    },
    addPictureText: {
        fontSize: 16,
        color: "black"
    },
    bioTitle: {
        alignSelf: "flex-start",
        fontWeight: 'bold',
        marginBottom: 10
    },
    bioInput: {
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20
    },
    saveButton: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    saveButtonText: {
        color: "white",
        fontSize: 16
    }
});

export default ProfileEditScreen;
