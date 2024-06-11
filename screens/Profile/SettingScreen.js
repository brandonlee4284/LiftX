import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { logoutUser } from "../../api/auth";

const SettingScreen = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        
    }, [navigation]);
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
        alignItems: "center",
        backgroundColor: '#121212' // Dark background color
    },
    scrollContent: {
        minWidth: '100%',
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
    logoutButton: {
        marginTop: 32
    },
    logoutText: {
        color: "red"
    },
});

export default SettingScreen;
