import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ScrollView } from 'react-native';
import { getAuth } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";



const HomeScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");

    const [publicUserData, setPublicUserData] = useState({});
    const [privateUserData, setPrivateUserData] = useState({});

  
    useEffect(() => {
        const auth = getAuth();
        const { email, displayName } = auth.currentUser;
        setEmail(email);
        setDisplayName(displayName);

        const fetchPublicUserData = async () => {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
              const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
              try {
                const docData = await getDoc(userDocRef);
                if (docData.exists()) {
                  setPublicUserData(docData.data());
                } else {
                  console.log('No such document!');
                }
              } catch (error) {
                console.error('Error fetching public data: ', error);
              }
            }
          };
      
          const fetchPrivateUserData = async () => {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
              const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'data');
              try {
                const docData = await getDoc(privateDataDocRef);
                if (docData.exists()) {
                  setPrivateUserData(docData.data());
                } else {
                  console.log('No such document!');
                }
              } catch (error) {
                console.error('Error fetching private data: ', error);
              }
            }
          };
      
          fetchPublicUserData();
          fetchPrivateUserData();
    }, []);

    useEffect(() => {
        LayoutAnimation.easeInEaseOut();
    }, []);

    const handleWorkoutButtonPress = () => {
        navigation.navigate('Workout');
    };

    let name = publicUserData.name

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.title}>LiftX</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                        <Ionicons name="person-add-outline" size={28} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Messages pressed')}>
                        <Ionicons name="chatbubble-ellipses-outline" size={28} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                        <Ionicons name="settings-outline" size={28} color="black" style={styles.profileIcon} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.body}>
                    <Text style={styles.welcomeMessage}>Welcome Back {name}!</Text>
                    <TouchableOpacity style={styles.button} onPress={handleWorkoutButtonPress}>
                        <Text style={{ color: "white" }}>Start Today's Workout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 50
    },
    scrollContent: {
        minWidth: '100%',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileIcon: {
        marginLeft: 15
    },
    welcomeMessage: {
        fontSize: 18,
        marginBottom: 20
    },
    button: {
        backgroundColor: "black",
        borderRadius: 7,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        width: 300
    }
});

export default HomeScreen;