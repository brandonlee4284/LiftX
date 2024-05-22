import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class LeaderboardScreen extends React.Component {  
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
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Setting')}>
                            <Ionicons name="settings-outline" size={28} color="black" style={styles.profileIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.body}>
                        <Text>Loading...</Text>
                        <ActivityIndicator></ActivityIndicator>
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
        paddingTop: 50
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