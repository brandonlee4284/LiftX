import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { getAuth } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import * as ImagePicker from 'expo-image-picker';

export default class ProfileEditScreen extends React.Component {
    state = {
        bio: "",
        profilePicture: null,
    };

    // Function to handle saving the profile
    saveProfile = () => {
        // Save profile logic here
        this.props.navigation.navigate("Profile");
    };

    // Function to handle picking an image from photo album
    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            this.setState({ profilePicture: result.uri });
        }
    };

    render() {
        const { bio, profilePicture } = this.state;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.body}>
                        <TouchableOpacity onPress={this.pickImage}>
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
                            onChangeText={(text) => this.setState({ bio: text })}
                            value={bio}
                            multiline
                        />

                        <TouchableOpacity style={styles.saveButton} onPress={this.saveProfile}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

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
    bioTitle :{
        justifyContent: "left",
        fontWeight: 'bold'
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