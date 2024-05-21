import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from "firebase/auth";

export default class ProfileScreen extends React.Component {
    state = {
        email: "",
        displayName: "",
        bio: "This is a sample bio.", // Placeholder bio
        profilePicture: "https://via.placeholder.com/150", // Placeholder image
        friendsCount: 9, // Placeholder number of friends
        gymStats: [
            { exercise: "Squat", stats: "315x1" },
            { exercise: "Bench", stats: "225x1" },
            { exercise: "DeadLift", stats: "405x1" }
        ] // Placeholder gym stats
    };

    componentDidMount() {
        const auth = getAuth();
        const { email, displayName, photoURL } = auth.currentUser;
        this.setState({ email, displayName, profilePicture: photoURL || this.state.profilePicture });
    }

    editProfile = () => {
        // Implement the profile edit functionality here
        Alert.alert("Edit Profile", "This will allow the user to edit their profile picture and bio.");
    };

    signOutUser = () => {
        const auth = getAuth();
        auth.signOut();
    };

    render() {
        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

        return (
            <View style={styles.container}>
                <Image source={{ uri: this.state.profilePicture }} style={styles.profilePicture} />
                <Text style={styles.displayName}>{this.state.displayName}</Text>
                <Text style={styles.email}>{this.state.email}</Text>
                <Text style={styles.friendsCount}>
                    <Text style={styles.boldText}>{this.state.friendsCount}</Text> friends
                </Text>
                <Text style={styles.bio}>{this.state.bio}</Text>

                <View style={styles.splitContainer}>
                    <View style={styles.line} />
                    <Text style={styles.splitText}>Current Split</Text>
                </View>

                <View style={styles.daysContainer}>
                    {days.map((day, index) => (
                        <TouchableOpacity key={index} style={styles.dayButton}>
                            <Text style={styles.dayButtonText}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.line} />

                <View style={styles.statsContainer}>
                    <Text style={styles.statsHeader}>Gym Stats</Text>
                    {this.state.gymStats.map((item, index) => (
                        <View key={index} style={styles.statItem}>
                            <Text style={styles.statExercise}>{item.exercise}</Text>
                            <Text style={styles.statValue}>{item.stats}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.line} />

                <TouchableOpacity style={styles.editButton} onPress={this.editProfile}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 32 }} onPress={this.signOutUser}>
                    <Text style={{ color: "red" }}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20
    },
    displayName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10
    },
    email: {
        fontSize: 18,
        color: "gray",
        marginBottom: 5 
    },
    friendsCount: {
        fontSize: 18,
        color: "black",
        marginBottom: 20
    },
    boldText: {
        fontWeight: "bold"
    },
    bio: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20
    },
    splitContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: 'lightgray',
        marginTop: 20,
        marginBottom: 20,
    },
    splitText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    daysContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5
    },
    dayButtonText: {
        color: "white",
        fontSize: 16
    },
    statsContainer: {
        width: '100%',
        marginBottom: 20
    },
    statsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 10
    },
    statItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        marginBottom: 5
    },
    statExercise: {
        fontSize: 16
    },
    statValue: {
        fontSize: 16,
        fontWeight: "bold"
    },
    editButton: {
        backgroundColor: "black",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5
    },
    editButtonText: {
        color: "white",
        fontSize: 16
    }
});