import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LeaderboardScreen = ({ navigation }) => {
    React.useEffect(() => {
        LayoutAnimation.easeInEaseOut();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.title}>LiftX</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                        <Ionicons name="person-add-outline" size={28} color="white" style={styles.profileIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                        <Ionicons name="chatbubble-ellipses-outline" size={28} color="white" style={styles.profileIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                        <Ionicons name="settings-outline" size={28} color="white" style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>
            </View>
            
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    <Text>Loading...</Text>
                    <ActivityIndicator />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 70,
        backgroundColor: '#121212' // Dark background color
    },
    scrollContent: {
        minWidth: '100%',
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
        fontWeight: 'bold',
        color: 'white' // Light text color
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
    loadingText: {
        color: 'white', // Light text color
        marginBottom: 10
    }
});


export default LeaderboardScreen;
