import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
            <ActivityIndicator />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default LoadingScreen;
