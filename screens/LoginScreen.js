import React from "react";
import {View, Text, StyleSheet} from 'react-native';

export default class LoginScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Log In Screen</Text>
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