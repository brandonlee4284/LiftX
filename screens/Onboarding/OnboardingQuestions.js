import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../ThemeProvider";
import { fetchPublicUserData } from "../../api/userData";
import Fontisto from 'react-native-vector-icons/Fontisto';



const { height, width } = Dimensions.get('window');

const OnboardingQuestionsScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [publicUserData, setPublicUserData] = useState({});
   // gender and weight var
   const [gender, setGender] = useState(null);
   const [weight, setWeight] = useState('');

    // get user data
    useEffect(() => {
        async function fetchData() {
            const data = await fetchPublicUserData();
            if (data) {
                setPublicUserData(data);
            }
        }
        fetchData();
    }, []);

    const toggleGender = (selectedGender) => {
        setGender(selectedGender);
    };

    const handleHome = () => {
        navigation.navigate('Home');
    };
    

    //rendering
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.circle} />
                <Text style={styles.greetingText}>Hello {publicUserData.username}!</Text>
                <Text style={styles.subText}>Tell us more about you..</Text>
                <View style={styles.body}>
                    <Text style={styles.title}>Select your gender</Text>
                    <View style={styles.genderContainer}>
                        <TouchableOpacity
                            style={[
                                styles.genderBox,
                                gender === 'male' && styles.selectedGenderBox
                            ]}
                            onPress={() => toggleGender('male')}
                        >
                            <Fontisto name="male" size={getResponsiveFontSize(54)} color={theme.textColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.genderBox,
                                gender === 'female' && styles.selectedGenderBox
                            ]}
                            onPress={() => toggleGender('female')}
                        >
                            <Fontisto name="female" size={getResponsiveFontSize(54)} color={theme.textColor} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>Enter your weight</Text>
                    <View style={styles.weightContainer}>
                        <TextInput
                            style={styles.input}
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                            placeholderTextColor={theme.textColor}
                        />
                        <Text style={styles.weightUnit}>lbs</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleHome} style={styles.button}>
                            <Text style={styles.buttonText}>
                                Get Started
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        paddingTop: 78,
        paddingHorizontal: 40

    },
    circle: {
        position: 'absolute',
        width: width * 1.6, 
        height: width * 1.6, 
        borderRadius: (width * 1.6) / 2,
        backgroundColor: theme.backdropColor,
        top: -width* 1.05, 
        left: -width * 0.48,
        zIndex: -1, 
    },
    greetingText: {
        fontSize: getResponsiveFontSize(26),
        color: theme.textColor,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    subText: {
        fontSize: getResponsiveFontSize(22),
        color: theme.textColor,
        marginBottom: 20,
    },
    body: {
        marginTop: 130
    },
    title: {
        fontSize: getResponsiveFontSize(18),
        color: theme.textColor,
        marginBottom: 20,
        fontWeight: '600',
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 50,
    },
    genderBox: {
        width: width * 0.4,
        height: width * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.backdropColor,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    selectedGenderBox: {
        borderColor: theme.primaryColor,
        borderWidth: 2,
    },
    weightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        height: height * 0.06,
        borderColor: theme.textColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: theme.textColor,
        fontSize: getResponsiveFontSize(30),
        fontWeight: 'bold',
        width: width * 0.25,
        marginRight: 10,
    },
    weightUnit: {
        fontSize: getResponsiveFontSize(30),
        color: theme.textColor,
        fontWeight: 'bold',
        paddingHorizontal: 5
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20
    },
    button: {
        width: width * 0.7,
        height: getResponsiveFontSize(57),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: theme.primaryColor,
        shadowOpacity: 0.52,
        shadowRadius: 50,
        shadowOffset: {
            width: 0,
            height: 20,
        },
        marginTop: 70
    },
    buttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
    },
    
});

export default OnboardingQuestionsScreen;