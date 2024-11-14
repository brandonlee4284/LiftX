import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeProvider";
import * as Haptics from 'expo-haptics';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const SupportComponent = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const navigation = useNavigation();

    const handlePrivacyPolicy = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.navigate("PrivacyPolicy");
    }

    return (
        <View>
            <Text style={styles.header}>Support & About</Text>
            <View style={styles.container}>
                <TouchableOpacity style={styles.row} onPress={handlePrivacyPolicy}>
                    <Ionicons name="information-circle-outline" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Privacy Policy</Text>
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
        fontFamily: theme.fontBold,
        paddingBottom: 20,
        marginLeft: 10
    },
    container: {
        paddingVertical: 5,
        paddingHorizontal: 16,
        backgroundColor: theme.backdropColor,
        borderRadius: getResponsiveFontSize(12),
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
        fontFamily: theme.fontSemiBold,
    },
});

export default SupportComponent;