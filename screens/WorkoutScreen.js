import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

const WorkoutScreen = () => {
    return (
        <View style={styles.container}>
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
        justifyContent: "center",
        alignItems: "center"
    },
    scrollContent: {
        minWidth: '100%',
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
});

export default WorkoutScreen;
