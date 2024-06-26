import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from "../ThemeProvider";
import AccountComponent from "./SettingComponents/AccountComponent";
import SupportComponent from "./SettingComponents/SupportComponent";
import LogoutComponent from "./SettingComponents/LogoutComponent";
import { Ionicons } from "@expo/vector-icons";

const { height, width } = Dimensions.get('window');

const SettingScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons name="arrow-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                <Text style={styles.header}>Settings</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.component}>
                    <AccountComponent />
                </View>
                <View style={styles.component}>
                    <SupportComponent />
                </View>
                <View style={styles.component}>
                    <LogoutComponent />
                </View>
            </View>
        </View>
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
    },
    headerContainer: {
        marginTop: 78,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        right: width*0.25
    },
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(26),
        fontWeight: '800',
        left: -0.0347*width
    },
    body: {
        alignItems: "center",
        marginTop: 50
    },
    component: {
        marginBottom: 40
    }
    
});

export default SettingScreen;
