import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeProvider";

const { height, width } = Dimensions.get('window');

const AccountComponent = () => {
    const [showActiveSplit, setShowActiveSplit] = useState(false);
    const [showScores, setShowScores] = useState(false);
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View>
            <Text style={styles.header}>Account</Text>
            <View style={styles.container}>
                <TouchableOpacity style={styles.row}>
                    <MaterialCommunityIcons name="account-edit-outline" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Edit Profile</Text>
                </TouchableOpacity>
                <View style={styles.row}>
                    <Ionicons name="lock-closed" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Privacy</Text>
                </View>
                <View style={styles.subRow}>
                    <Text style={styles.subText}>Show active split on profile</Text>
                    <Switch
                        value={showActiveSplit}
                        onValueChange={setShowActiveSplit}
                        trackColor={{ false: theme.grayTextColor, true: theme.primaryColor }}
                        thumbColor={showActiveSplit ? theme.textColor : theme.textColor}
                        style={styles.switch}
                    />
                </View>
                <View style={styles.subRow}>
                    <Text style={styles.subText}>Show scores on profile</Text>
                    <Switch
                        value={showScores}
                        onValueChange={setShowScores}
                        trackColor={{ false: theme.grayTextColor, true: theme.primaryColor }}
                        thumbColor={showActiveSplit ? theme.textColor : theme.textColor}
                        style={styles.switch}
                    />
                </View>
                <TouchableOpacity style={styles.row}>
                    <Ionicons name="key-outline" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <MaterialCommunityIcons name="book" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Workout History</Text>
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
        paddingBottom: 20,
        marginLeft: 10
    },
    container: {
        padding: 26,
        backgroundColor: theme.backdropColor,
        borderRadius: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    subRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingLeft: 32,
    },
    icon: {
        marginRight: 16,
        color: theme.grayTextColor
    },
    text: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        fontWeight: 'bold'
    },
    subText: {
        fontSize: getResponsiveFontSize(14),
        color: theme.textColor,
    },
    switch: {
        marginLeft: 70
    }
});

export default AccountComponent;