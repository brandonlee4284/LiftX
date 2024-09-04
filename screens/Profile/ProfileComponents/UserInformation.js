import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeProvider";

const { width } = Dimensions.get("window");

const UserInformation = ({ profilePicture, displayName, username, friendCount, bio }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
            ) : (
                <Ionicons name="person-circle" size={getResponsiveFontSize(130)} color={theme.textColor}/>
            )}
            <Text style={styles.displayName}>{displayName}</Text>
            <Text style={styles.username}>@{username}</Text>
            <Text style={styles.friendCount}>{friendCount} friends</Text>
            <Text style={styles.bio}>{bio}</Text>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};

const createStyles = (theme) => StyleSheet.create({    
    container: {
        alignItems: "center",
    },
    profilePicture: {
        width: width*0.3,
        height: width*0.3,
        borderRadius: width*0.3 / 2,
        borderColor: theme.textColor,
        borderWidth: 3,
        marginBottom: 10
    },
    displayName: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: "800",
        color: theme.textColor,
        marginTop: 20,
        marginBottom: 8,
    },
    username: {
        fontSize: getResponsiveFontSize(16),
        fontWeight: "bold",
        color: theme.textColor,
        marginBottom: 5,
    },
    friendCount: {
        fontSize: getResponsiveFontSize(14),
        color: theme.textColor,
        marginBottom: 20,
    },
    bio: {
        fontSize: getResponsiveFontSize(16),
        fontWeight: "bold",
        color: theme.textColor,
        textAlign: "center",
        marginHorizontal: 20,
    },
});

export default UserInformation;