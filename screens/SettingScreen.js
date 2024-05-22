import React from "react";
import {View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import { FIREBASE_AUTH } from "../FirebaseConfig";

export default class SettingScreen extends React.Component {
    signOutUser = () => {
        FIREBASE_AUTH.signOut();
    };    
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.body}>
                        <TouchableOpacity style={{ marginTop: 32 }} onPress={this.signOutUser}>
                            <Text style={{ color: "red" }}>Logout</Text>
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
        justifyContent: "center",
        alignItems: "center"
    },
    scrollContent: {
        minWidth: '100%', // Ensure content extends horizontally
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
});