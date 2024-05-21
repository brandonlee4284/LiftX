import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from "firebase/auth";

export default class LeaderboardScreen extends React.Component {
    /*
    componentDidMount() {
        const auth = getAuth()
        auth.onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? "App" : "Auth");
        });
    }
    */
    
    render() {
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
                    <Text>Loading...</Text>
                    <ActivityIndicator></ActivityIndicator>
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
});