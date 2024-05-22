import React from "react";
import {View, Text, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';

export default class WorkoutScreen extends React.Component {
    
    render() {
        return (
            <View style={styles.container}>
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