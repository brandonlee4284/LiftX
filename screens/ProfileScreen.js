import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
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
        ], // Placeholder gym stats
        selectedDay: null,
        workoutSplit: {
            M: [
                { exercise: "Bench", stats: "4x6" },
                { exercise: "Incline DB Press", stats: "4x10" },
                { exercise: "Cable Tricep Ext", stats: "4x10" }
            ],
            Tu: [
                { exercise: "DeadLift", stats: "4x5" },
                { exercise: "Barbell Row", stats: "4x10" },
                { exercise: "Pull Up", stats: "4x8" },
                { exercise: "Bicep Curl", stats: "4x8" }
            ],
            W: [
                { exercise: "Squat", stats: "4x5" },
                { exercise: "Leg Press", stats: "4x10" },
                { exercise: "Leg Curl", stats: "4x10" }
            ],
            Th: [
                { exercise: "Bench", stats: "4x6" },
                { exercise: "Incline DB Press", stats: "4x10" },
                { exercise: "Cable Tricep Ext", stats: "4x10" }
            ],
            F: [
                { exercise: "DeadLift", stats: "4x5" },
                { exercise: "Barbell Row", stats: "4x10" },
                { exercise: "Pull Up", stats: "4x8" }
            ],
            S: [
                { exercise: "Squat", stats: "4x5" },
                { exercise: "Leg Press", stats: "4x10" },
                { exercise: "Leg Curl", stats: "4x10" }
            ],
            S: [
                { exercise: "Bench", stats: "4x6" },
                { exercise: "Incline DB Press", stats: "4x10" },
                { exercise: "Cable Tricep Ext", stats: "4x10" }
            ]
        } // placeholder
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

    renderExerciseCard = () => {
        const { selectedDay, workoutSplit } = this.state;
        if (!selectedDay) return null;

        const exercises = workoutSplit[selectedDay];
        const dayNames = {
            M: "Monday",
            Tu: "Tuesday",
            W: "Wednesday",
            Th: "Thursday",
            F: "Friday",
            S: "Saturday",
            S: "Sunday"
        };

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                onRequestClose={() => this.setState({ selectedDay: null })}
            >
                <TouchableWithoutFeedback onPress={() => this.setState({ selectedDay: null })}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{dayNames[selectedDay]}</Text>
                            {exercises.map((exercise, index) => (
                                <View key={index} style={styles.exerciseRow}>
                                    <Text style={styles.exerciseName}>{exercise.exercise}</Text>
                                    <Text style={styles.exerciseStats}>{exercise.stats}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    };

    render() {
        const days = ['M', 'Tu', 'W', 'Th', 'F', 'S', 'S'];

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
                        <TouchableOpacity 
                            key={index} 
                            style={styles.dayButton} 
                            onPress={() => this.setState({ selectedDay: day })}
                        >
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

                {this.renderExerciseCard()}
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    exerciseRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: '100%',
        marginVertical: 5
    },
    exerciseName: {
        fontSize: 16
    },
    exerciseStats: {
        fontSize: 16,
        fontWeight: "bold"
    }
});