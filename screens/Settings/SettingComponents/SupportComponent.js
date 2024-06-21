import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeProvider";

const { height, width } = Dimensions.get('window');

const SupportComponent = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View>
            <Text style={styles.header}>Support & About</Text>
            <View style={styles.container}>
                <TouchableOpacity style={styles.row}>
                    <Ionicons name="information-circle-outline" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Terms and Services</Text>
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
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: theme.backdropColor,
        borderRadius: 12,
        width: width* 0.84
        
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

export default SupportComponent;