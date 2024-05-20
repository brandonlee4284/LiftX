import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { getAuth } from "firebase/auth";

export default class HomeScreen extends React.Component {
    state = {
        email: "",
        displayName: ""
    };

    componentDidMount() {
        const auth = getAuth()
        const {email, displayName} = auth.currentUser;
        this.setState({email, displayName});
    }

    signOutUser = () => {
        const auth = getAuth(); 
        auth.signOut();
    };

    render() {
        return (
            <View style={styles.container}>
                <Text>Welcome Back {this.state.email}!</Text>

                <TouchableOpacity style={{marginTop: 32}} onPress={this.signOutUser}>
                    <Text>Logout</Text>
                </TouchableOpacity>
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