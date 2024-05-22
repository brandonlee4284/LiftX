import React from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
 

export default class LoginScreen extends React.Component {
    state = {
        email: "",
        password: "",
        errorMessage: null
    };

    handleLogin = () => {
        const {email, password} = this.state;
        const auth = FIREBASE_AUTH;
        signInWithEmailAndPassword(auth, email, password).catch(error => this.setState({errorMessage: error.message}));
        
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>LiftX Login</Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View>
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

                <TouchableOpacity style={styles.loginButton} onPress={this.handleLogin}>
                    <Text style={{ color: "white" }}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ alignSelf: "center", marginTop: 32}}>
                    <Text style={{ color : "#414959", fontSize: 13}}>
                        New to LiftX? 
                        <Text style={{ fontWeight: "500", color: "black" }} onPress={() => this.props.navigation.navigate("Register")}> Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>   
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    greeting: {
        marginTop:32,
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
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