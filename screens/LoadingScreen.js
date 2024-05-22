import React from "react";
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

export default class LoadingScreen extends React.Component {    
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