import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { logoutUser } from "../../api/auth";

const SettingScreen = () => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    <TouchableOpacity style={{ marginTop: 32 }} onPress={logoutUser}>
                        <Text style={{ color: "red" }}>Logout</Text>
                    </TouchableOpacity>
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

export default SettingScreen;
