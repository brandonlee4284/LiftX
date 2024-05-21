import React from "react";
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import { getAuth } from "firebase/auth";

export default class SettingScreen extends React.Component {
    /*
    signOutUser = () => {
        const auth = getAuth(); 
        auth.signOut();
    };
    */
    
    render() {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
                <ActivityIndicator></ActivityIndicator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});