import React from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
 

export default class RegisterScreen extends React.Component {
    state = {
        name: "",
        email: "",
        password: "",
        errorMessage: null
    };

    handleSignUp = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then(userCredentials => {
            return userCredentials.user.updateProfile({
                displayName: this.state.name
            });
        })
        .catch(error => this.setState({ errorMessage: error.message }))
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>Welcome to LiftX!</Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>  
                    <View>
                        <Text style={styles.inputTitle}>Full Name</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize="none"
                            onChangeText={name => this.setState({ name })}
                            value={this.state.name}
                        ></TextInput>
                    </View>

                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Email Address</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize="none"
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        ></TextInput>
                    </View>

                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <TextInput 
                                style={styles.input} secureTextEntry autoCapitalize="none"
                                onChangeText={password => this.setState({ password })}
                                value={this.state.password}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={this.handleSignUp}>
                    <Text style={{ color: "white" }}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ alignSelf: "center", marginTop: 32}}>
                    <Text style={{ color : "#414959", fontSize: 13}}>
                        Already a member of LiftX? 
                        <Text style={{ fontWeight: "500", color: "black" }} onPress={() => this.props.navigation.navigate("Login")}> Login</Text>
                    </Text>
                </TouchableOpacity>
            </View>   
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    greeting: {
        marginTop:32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center"
    },
    errorMessage: {
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30,
        color: "red"
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    loginButton: {
        marginHorizontal: 30,
        backgroundColor: "black",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    }
});