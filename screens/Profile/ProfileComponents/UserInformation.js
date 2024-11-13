import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeProvider";

const { width, height } = Dimensions.get("window");

const UserInformation = ({ profilePicture, displayName, username, friendCount, bio }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <View style={styles.container}>
            {profilePicture ? (
                <>
                    <TouchableOpacity onPress={toggleModal}>
                        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                    </TouchableOpacity>
                    <Modal visible={modalVisible} transparent={true} animationType="fade">
                        <View style={styles.modalContainer}>
                            <TouchableOpacity onPress={toggleModal} style={styles.modalOverlay}>
                                <Image source={{ uri: profilePicture }} style={styles.modalImage} />
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </>
            ) : (
                <Ionicons name="person-circle" size={getResponsiveFontSize(130)} color={theme.textColor} />
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
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: width * 0.3 / 2,
        borderColor: theme.textColor,
        borderWidth: 3,
        marginBottom: 10,
    },
    displayName: {
        fontSize: getResponsiveFontSize(24),
        fontFamily: theme.fontBold,
        color: theme.textColor,
        marginTop: 10,
        marginBottom: 5,
    },
    username: {
        fontSize: getResponsiveFontSize(16),
        fontFamily: theme.fontSemiBold,
        color: theme.textColor,
        marginBottom: 5,
    },
    friendCount: {
        fontSize: getResponsiveFontSize(14),
        color: theme.textColor,
        marginBottom: 20,
        fontFamily: theme.fontLight,
    },
    bio: {
        fontSize: getResponsiveFontSize(16),
        fontFamily: theme.fontMedium,
        color: theme.textColor,
        textAlign: "center",
        marginHorizontal: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalImage: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: width * 0.3,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default UserInformation;