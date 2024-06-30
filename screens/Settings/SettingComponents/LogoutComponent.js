import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeProvider";
import { logoutUser } from "../../../api/auth";


const { height, width } = Dimensions.get('window');

const LogoutComponent = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.row} onPress={logoutUser}>
                    <MaterialCommunityIcons name="logout-variant" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};
    
const createStyles = (theme) => StyleSheet.create({    
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(20),
        fontWeight: '800',
        paddingBottom: 10,
        marginLeft: 10
    },
    container: {
        paddingVertical: 7,
        paddingHorizontal: 16,
        backgroundColor: theme.backdropColor,
        borderRadius: 12,
        width: width* 0.88
        
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    icon: {
        marginRight: 16,
        color: theme.grayTextColor
    },
    text: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        textAlign: 'left',
        fontWeight: 'bold'
    },
});

export default LogoutComponent;