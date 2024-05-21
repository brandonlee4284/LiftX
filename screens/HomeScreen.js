import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { getAuth } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';

export default class HomeScreen extends React.Component {
    state = {
        email: "",
        displayName: ""
    };

    componentDidMount() {
        const auth = getAuth();
        const { email, displayName } = auth.currentUser;
        this.setState({ email, displayName });
    }

   

    handleWorkoutButtonPress = () => {
        this.props.navigation.navigate('Workout');
    };

    render() {
        LayoutAnimation.easeInEaseOut();
        return (
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Text style={styles.title}>LiftX</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                            <Ionicons name="person-add-outline" size={28} color="black" style={styles.profileIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                            <Ionicons name="chatbubble-ellipses-outline" size={28} color="black" style={styles.profileIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                            <Ionicons name="person-circle-outline" size={28} color="black" style={styles.profileIcon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.welcomeMessage}>Welcome Back {this.state.email}!</Text>

                    <TouchableOpacity style={styles.button} onPress={this.handleWorkoutButtonPress}>
                        <Text style={{ color: "white" }}>Start Today's Workout</Text>
                    </TouchableOpacity>

                    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 50
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileIcon: {
        marginLeft: 15
    },
    welcomeMessage: {
        fontSize: 18,
        marginBottom: 20
    },
    button: {
        backgroundColor: "black",
        borderRadius: 7,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        width: 300
    }
});